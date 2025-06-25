<template>
  <div class="game-search-stage-view">
    <ToolBar :toolTypes="toolTypes" :chapterId="chapterId"/>
    <StageHeader stageName="搜查阶段" />
    <div class="map-container" ref="mapContainer">
      <div class="map-content" ref="mapContent">
        <img 
          :src="scriptChapter?.map?.url" 
          class="map-image" 
          draggable="false"
        />
        <div 
          class="clue-button" 
          v-for="(button, index) in clueButtons" 
          :key="'button-' + index"
          :style="{ left: button.left, top: button.top }"
          @click="showClueDialog(button, index)"
        >
          {{ button.text }}
          <div class="badge-count" :class="{ hidden: button.remaining === 0 }">
            {{ button.remaining }}
          </div>
        </div>
      </div>
      <div class="avatar-list">
        <div 
          class="avatar-item" 
          v-for="(character, index) in characters" 
          :key="index"
          @click="showCharacterDialog(character)"
        >
          <div class="avatar-container">
            <img :src="character.url" class="avatar-image" />
            <div class="badge-count" :class="{ hidden: character.unreadCount === 0 }">
              {{ character.unreadCount }}
            </div>
          </div>
          <div class="character-name">{{ character.name }}</div>
        </div>
      </div>
      
      <!-- Character Dialog -->
      <div class="character-dialog" v-if="showChDialog && currentCharacter">
        <div class="dialog-content">
          <img :src="currentCharacter.url" class="dialog-avatar" />
          <div class="dialog-name">{{ currentCharacter.name }}</div>
          <div class="dialog-message">
            <p>你可以向 {{ currentCharacter.name }} 提问</p>
            <p>TA的回答中可能会有不真实的信息，但是<b>加粗</b>的内容一定是正确的</p>
          </div>
          <textarea class="dialog-input" placeholder="输入你的问题..."></textarea>
          <button class="dialog-confirm" @click="startStreaming">发送</button>
          <button class="dialog-close" @click="closeDialog">X</button>
          <div class="chat-container">
            <div
              class="chat-item"
              v-for="(msg, index) in chatHistory"
              :key="index"
              :class="msg.role"
            >
              <!-- AI 气泡左侧头像 -->
              <template v-if="msg.role === 'ai'">
                <img :src="currentCharacter?.url" class="avatar" />
                <div class="chat-bubble ai">{{ msg.content }}</div>
              </template>

              <!-- 用户气泡右侧头像 -->
              <template v-else>
                <div class="chat-bubble user">{{ msg.content }}</div>
                <img src="/images/pic/大明星最后的演出/韩伟文.jpg" class="avatar" />
              </template>
            </div>

            <!-- AI 正在回复时的流式输出 -->
            <div class="chat-item ai" v-if="loadingAnswer">
              <img :src="currentCharacter?.url" class="avatar" />
              <div class="chat-bubble ai">{{ streamingAnswer }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="character-dialog" v-if="showDialog && currentClueButton">
        <div class="dialog-content">
          <img 
            :src="currentClueButton.clues[currentClueIndex].url" 
            class="dialog-avatar"
            @click="openImagePreview(currentClueButton.clues[currentClueIndex].url)"
          />
          <div class="dialog-message">
            <p>{{ currentClueButton.clues[currentClueIndex].desc }}</p>
          </div>
          <button class="dialog-confirm" @click="closeDialog">
            {{ '关闭' }}
          </button>
        </div>
      </div>

      <!-- 大图预览模态框 -->
      <div class="image-preview-modal" v-if="showImagePreview" @click.self="closeImagePreview">
        <div class="modal-content">
          <img :src="currentPreviewImage" class="preview-image" />
          <button class="modal-close" @click="closeImagePreview">×</button>
        </div>
      </div>

      <img 
        :src="scriptChapter?.map?.url" 
        class="map-image" 
        ref="mapImage"
        draggable="false"
      />
    </div>
    <button class="next-stage-btn" @click="goToReasoningStage">搜证完成，开始推理</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useScriptDataStore } from '@/stores/scriptDataStore'; // 引入Pinia store
import ToolBar from "@/components/ToolBar.vue";
import StageHeader from "@/components/StageHeader.vue";
import { useClueStore } from '@/stores/clueStore';
import { fetchStreamingAnswer } from '@/api/question';

const toolTypes = ref(['script', 'clue', 'note'])

// 获取当前路由参数
const route = useRoute();
const router = useRouter();
const showImagePreview = ref(false);
const currentPreviewImage = ref('');

// 获取 Pinia store 中的 scriptData
const scriptDataStore = useScriptDataStore();
const scriptData = scriptDataStore.scriptData; // 获取完整的 scriptData

// 获取章节ID（从路由参数获取 chapterId）
const chapterId = route.params.chapterIndex;

// 通过章节ID从 scriptData 中解析出对应的章节数据
const scriptChapter = computed(() => {
  return scriptData?.chapters[chapterId] || {};
});


// 解析 clueButtons 和 characters
const clueButtons = computed(() => {
  return scriptChapter.value?.map?.locations?.map(location => ({
    text: location.name,
    left: location.position.left,
    top: location.position.top,
    clues: location.clues,
    remaining: location.clues.length
  })) || [];
});

const characters = computed(() => {
  return scriptChapter.value?.npcs || [];
});

// 用于控制对话框的显示
const showDialog = ref(false);
const showChDialog = ref(false);
const currentCharacter = ref(null);
const currentClueButton = ref(null);
const currentClueIndex = ref(0);

const clueStore = useClueStore();
// clueStore.clearClues()

// Method: 展示角色对话框
const showCharacterDialog = (character) => {
  currentCharacter.value = character;
  showChDialog.value = true;
};

// Method: 关闭对话框
const closeDialog = () => {
  chatHistory.value = [];
  // 如果有线索，点击后根据 remaining 数量来控制是否继续展示下一条线索
  if (currentClueButton.value && currentClueButton.value.remaining > 0) {
    currentClueIndex.value++;
    if (currentClueIndex.value < currentClueButton.value.clues.length) {
      // 如果有更多线索，展示下一条线索
      showDialog.value = true;
      clueStore.addClues(currentClueButton.value.clues[currentClueButton.value.remaining - 1]);
      currentClueButton.value.remaining--; // 减少 remaining 数量
    } else {
      // 如果没有更多线索了，关闭对话框
      showDialog.value = false;
    }
  } else {
    // 如果没有线索，则直接关闭对话框
    showDialog.value = false;
  }
  showChDialog.value = false;
};

// Method: 进入推理阶段
const goToReasoningStage = () => {
  router.push('/game-reasoning-stage/' + chapterId);
};

// Method: 展示线索对话框
const showClueDialog = (button) => {
  currentClueButton.value = button;
  currentClueIndex.value = button.clues.length > 0 ? 0 : -1; // 设置初始的线索索引
  
  // 如果线索剩余数量大于0，展示第一条线索
  if (button.remaining > 0) {
    // 显示第一条线索
    showDialog.value = true;
    const clueToAdd = button.clues[button.remaining - 1];
    clueStore.addClues(clueToAdd);
    console.log(clueStore)
    currentClueButton.value.remaining--; // 减少 remaining 计数
  }
};

// 拖动地图的逻辑
const mapContainer = ref(null);
const mapContent = ref(null);
const mapImage = ref(null);
const isDragging = ref(false);
const startPos = ref({ x: 0, y: 0 });
const translate = ref({ x: 0, y: 0 });

onMounted(() => {
  const mapContentEl = mapContent.value;
  
  // 鼠标事件
  mapContentEl.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', endDrag);
  
  // 触摸事件
  mapContentEl.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('touchmove', drag, { passive: false });
  window.addEventListener('touchend', endDrag);

  if (clueStore.clues.length > 0) {
    const rawClues = toRaw(clueStore.clues);
    scriptChapter.value?.map?.locations?.forEach(location => {
      location.clues = location.clues.filter(clue => 
        !rawClues.some(storeClue => storeClue.url === clue.url)
      );
    });
  }
});

// 计算边界限制
const getBoundaries = () => {
  if (!mapContainer.value || !mapImage.value) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  
  const containerRect = mapContainer.value.getBoundingClientRect();
  const imageRect = mapImage.value.getBoundingClientRect();
  
  return {
    minX: containerRect.width - imageRect.width,
    maxX: 0,
    minY: containerRect.height - imageRect.height,
    maxY: 0
  };
};

// 检查是否点击的是clue-button
const startDrag = (e) => {
  // 检查点击目标是否是clue-button或其子元素
  const isClueButton = e.target.closest('.clue-button');
  if (isClueButton) {
    return; // 如果是按钮，不启动拖动
  }

  isDragging.value = true;
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;
  
  startPos.value = {
    x: clientX - translate.value.x,
    y: clientY - translate.value.y
  };
  
  mapContent.value.style.cursor = 'grabbing';
  e.preventDefault();
};

// 拖动中
const drag = (e) => {
  if (!isDragging.value) return;
  
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);
  
  if (clientX === undefined || clientY === undefined) return;
  
  const boundaries = getBoundaries();
  
  // 计算新的位置
  let newX = clientX - startPos.value.x;
  let newY = clientY - startPos.value.y;
  
  // 限制在边界内
  newX = Math.max(boundaries.minX, Math.min(boundaries.maxX, newX));
  newY = Math.max(boundaries.minY, Math.min(boundaries.maxY, newY));
  
  translate.value = { x: newX, y: newY };
  mapContent.value.style.transform = `translate(${translate.value.x}px, ${translate.value.y}px)`;
  
  e.preventDefault();
};

// 结束拖动
const endDrag = () => {
  isDragging.value = false;
  if (mapContent.value) {
    mapContent.value.style.cursor = 'grab';
  }
};

const openImagePreview = (imageUrl) => {
  currentPreviewImage.value = imageUrl;
  showImagePreview.value = true;
};

const closeImagePreview = () => {
  showImagePreview.value = false;
  currentPreviewImage.value = '';
};

const streamingAnswer = ref('');
const loadingAnswer = ref(false);
const chatHistory = ref([]) // 聊天记录，包含角色和AI内容


const startStreaming = async () => {
  const inputElement = document.querySelector('.dialog-input');
  const question = inputElement?.value?.trim() || '';

  if (!question) {
    alert('请输入你的问题');
    return;
  }

  // 推入用户提问
  chatHistory.value.push({ role: 'user', content: question });

  const promptPayload = {
    prompt: 1,
    characterName: currentCharacter.value?.name || '',
    scripts: JSON.stringify(scriptData?.chapters[chapterId] || []),
    truth: scriptData?.chapters[chapterId].truth || '',
    question,
  };

  streamingAnswer.value = '';
  loadingAnswer.value = true;

  try {
    await fetchStreamingAnswer(
      promptPayload,
      (chunk) => {
        if (showChDialog.value) {
          streamingAnswer.value += chunk;
        }
      },
      (finalResult) => {
        if (showChDialog.value) {
          chatHistory.value.push({ role: 'ai', content: finalResult });
        }
      }
    );
  } catch (err) {
    console.error('流式AI出错:', err);
  } finally {
    loadingAnswer.value = false;
    inputElement.value = '';
  }
};

</script>

<style scoped>
.avatar-container {
  position: relative;
}

.badge-count {
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  background: var(--accent-dark);
  color: var(--text-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.badge-count.hidden {
  display: none;
}
.game-search-stage-view {
  display: flex;
  flex-direction: column;
  padding-top: var(--stage-header-height);
  position: relative;
  height: 100%;
  overflow: hidden;
}

.map-container {
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
}

.map-content {
  width: fit-content;
  height: 100%;
  will-change: transform;
  touch-action: none;
  white-space: nowrap;
}

.map-image {
  width: auto;
  height: 100%;
}

.edge-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.3);
  z-index: 1000;
}

.edge-indicator.left {
  left: 0;
}

.edge-indicator.right {
  right: 0;
}

.avatar-list {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.avatar-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.character-name {
  margin-top: 5px;
  font-size: 12px;
  color: #8183ff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.character-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.clue-button {
  position: absolute;
  background-color: var(--accent-light);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 80px;
}

.dialog-content {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  text-align: center;
  color: var(--text-primary);
  position: relative;
}

.dialog-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 auto 1px;
  object-fit: cover;
}

.dialog-name {
  font-size: 18px;
  margin-bottom: 1px;
}

.dialog-message {
  margin-bottom: 2px;
  font-size: 16px;
}

.dialog-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-light);
  cursor: pointer;
}

.dialog-input {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  margin: 1px 0;
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-primary);
  resize: vertical;
}

.dialog-confirm {
  padding: 10px 20px;
  margin-top: 1px;
  background-color: var(--accent-dark);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.next-stage-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background-color: var(--accent-dark);
  color: var(--text-light);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 大图预览模态框样式 */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: zoom-out;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  cursor: default;
}

.modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
}

/* 对话框中的图片添加指针样式 */
.dialog-avatar {
  cursor: zoom-in;
  transition: transform 0.2s;
}

.dialog-avatar:hover {
  transform: scale(1.02);
}

.stream-output {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: 12px;
  border-radius: 4px;
  text-align: left;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 10px;
  font-size: 14px;
  border: 1px solid var(--border);
}

.typing {
  font-style: italic;
  color: #aaa;
}

.chat-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  background-color: var(--bg-primary);
  font-size: 14px;
  gap: 8px;
}

.chat-bubble {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  max-width: 75%;
  min-width: 80px;
  width: fit-content;
  box-sizing: border-box;
}

.chat-bubble.user {
  background-color: var(--accent-light);
  color: white;
  align-self: flex-end;
  text-align: right;
  border-top-right-radius: 0;
}

.chat-bubble.ai {
  background-color: #e6e6f7;
  color: #333;
  align-self: flex-start;
  text-align: left;
  border-top-left-radius: 0;
}

.chat-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}

.chat-item.user {
  justify-content: flex-end;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-item.user .avatar {
  order: 2; /* 确保头像在右边 */
}

.chat-item.user .chat-bubble {
  order: 1;
}

.chat-item.ai .avatar {
  order: 1;
}

.chat-item.ai .chat-bubble {
  order: 2;
}
</style>