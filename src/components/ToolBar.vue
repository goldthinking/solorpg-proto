<template>
  <div
      class="toolbar-container"
      :class="{
      'collapsed': !isExpanded,
      'detail-view': activePanel
    }"
  >
    <!-- 主工具栏 -->
    <div class="main-tools" v-if="!activePanel">
      <div
          v-for="toolType in toolTypes"
          :key="toolType"
          class="tool-item"
          @click="openPanel(toolType)"
      >
        <Icon :icon="toolIcons[toolType]" />
        <span class="tool-label">{{ toolLabels[toolType] }}</span>
      </div>
    </div>

    <!-- 剧本详情 -->
    <div v-if="activePanel === 'script'" class="detail-panel">
      <div class="chapter-tabs">
        <div
            v-for="(chapter, index) in filteredChapters"
            :key="index"
            :class="['tab-item', { active: activeChapter === index + 1 }]"
            @click="activeChapter = index + 1"
        >
          第{{ index + 1 }}章
        </div>
      </div>
      <div class="chapter-content">
        <h3>{{ activeChapterData.title }}</h3>
        <p>{{ activeChapterData.content }}</p>
        <button class="close-btn" @click="closePanel">×</button>
      </div>
    </div>

    <!-- 线索图文和Ai问答详情 -->
    <div v-if="activePanel === 'clue'" class="detail-panel">
      <div class="clueAndai" >
        <div
            class="tab-item"
            :class="{ active: activeClueTab === 'clue' }"
            @click="activeClueTab = 'clue'"
        >
          线索
        </div>
        <!-- AI对话选项卡 -->
        <div
            class="tab-item"
            :class="{ active: activeClueTab === 'ai' }"
            @click="activeClueTab = 'ai'"
        >
          AI对话
        </div>
      </div>

      <div v-if="activeClueTab === 'clue'" class="clue-container">
        <!-- 左侧缩略图列 -->
        <div class="clue-thumbnails">
          <div
              v-for="(clue, index) in clues"
              :key="index"
              class="clue-item"
              @click="activeClue = clue;"
          >
            <img
                :src="clue.url"
                alt="线索缩略图"
                @click="openImagePreview(clue.url)"
            >
          </div>
        </div>
      </div>

      <div v-if="activeClueTab === 'ai'" class="chat-container">
          <div
              v-for="(log, index) in aiLogs"
              :key="index"
              :class="['message', log.type]"
          >
            <div class="avatar">
              <Icon :icon="log.type === 'user' ? 'mdi:account' : 'mdi:robot'" />
            </div>
            <div class="content">{{ log.content }}</div>
          </div>
      </div>
      <button class="close-btn" @click="closePanel">×</button>
    </div>

    <!-- 笔记 -->
    <div v-if="activePanel === 'note'" class="detail-panel">
      <div class="chat-container">
        <div
            v-for="(log, index) in aiLogs"
            :key="index"
            :class="['message', log.type]"
        >
          <div class="avatar">
            <Icon :icon="log.type === 'user' ? 'mdi:account' : 'mdi:robot'" />
          </div>
          <div class="content">{{ log.content }}</div>
        </div>
      </div>
      <button class="close-btn" @click="closePanel">×</button>
    </div>
  </div>

  <!-- 大图预览模态框 -->
  <div class="image-preview-modal" v-if="showImagePreview" @click.self="closeImagePreview">
    <div class="modal-content">
      <img :src="currentPreviewImage" class="preview-image" />
      <button class="modal-close" @click="closeImagePreview">×</button>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useScriptDataStore } from '@/stores/scriptDataStore'
import { useClueStore } from '@/stores/clueStore'

const props = defineProps({
  toolTypes: {
    type: Array,
    required: true,
    default: () => ['script', 'clue', 'note']
  },
  chapterId: {
    type: Number,
    required: true,
  }
})

const isExpanded = ref(false)
const activePanel = ref(null)
const activeChapter = ref(1)
const activeClue = ref(null)
const activeClueTab = ref('clue')

const scriptDataStore = useScriptDataStore()
const clueStore = useClueStore()

const showImagePreview = ref(false);
const currentPreviewImage = ref('');

const toolIcons = {
  script: 'mdi:book',
  clue: 'mdi:magnify',
  note: 'mdi:note-text'
}

const toolLabels = {
  script: '剧本',
  clue: '线索',
  note: '笔记'
}

// 数据
const chapters = computed(() => scriptDataStore.scriptData?.chapters || [])
const clues = computed(() => clueStore.clues || [])

const aiLogs = ref([
  { type: 'user', content: '死者的死亡时间是什么时候？' },
  { type: 'ai', content: '根据法医报告...' }
])

// 根据传入的 chapterId 过滤章节
const filteredChapters = computed(() =>
  chapters.value.filter((_, index) => index <= props.chapterId) // 使用 index 筛选
)

// 获取当前章节的数据
const activeChapterData = computed(() =>
  chapters.value.find((_, index) => index === activeChapter.value - 1) || {}
)

const openPanel = (type) => {
  isExpanded.value = false
  activePanel.value = type
}

const closePanel = () => {
  activePanel.value = null
  activeClue.value = null
}

const openImagePreview = (imageUrl) => {
  currentPreviewImage.value = imageUrl;
  showImagePreview.value = true;
};

const closeImagePreview = () => {
  showImagePreview.value = false;
  currentPreviewImage.value = '';
};
</script>

<style scoped>
.toolbar-container {
  position: fixed;
  right: 0;
  top: 56px;
  width: 300px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  transition: all 0.3s ease;
  z-index: 1000;
  border-radius: 10px 0 0 10px;
  backdrop-filter: blur(10px);
}

.toolbar-container.collapsed {
  width: 40px;
  margin-left:0;
}

.toolbar-container.detail-view {
  width: 80vw;
  height: 90vh;
  top: 50%;
  transform: translateY(-50%);
}


.main-tools {
  padding: 15px 10px; /* 调整内边距 */
  gap: 15px;
}

.toolbar-container.collapsed .main-tools {
  padding-left: 10;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  padding: 15px 10px;
  border-radius: 8px;
  transition: all 0.2s;
}


.tool-label {
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.2;
}

.detail-panel {
  padding: 20px;
  height: 100%;
  margin-top: 10px;
}

.chapter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  white-space: nowrap; /* 文本不会换行，文本会在同一行上继续 */
  overflow-x: auto;
}

.tab-item {
  padding: 10px 10px;
  border-radius: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  text-align: center;
  margin-top: 10px;

}

.tab-item.active {
  background: #776ad8;
  font-weight: bold;
}

.chapter-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.clueAndai {
  display: flex;
  gap: 10px
}

.clue-container {
  display: flex;
  gap: 20px; /* 控制左右间距 */
  height: 80vh; /* 根据需要设置容器高度 */
}

.clue-thumbnails {
  display: flex;
  flex-direction: column; /* 纵向排列 */
  gap: 10px; /* 缩略图间距 */
  overflow-y: auto; /* 添加垂直滚动条 */
  width: 100px; /* 左侧列宽度 */
  padding: 10px;
  background: rgba(245, 245, 245, 0); /* 可选背景色 */
}

.clue-item {
  cursor: pointer;
  transition: transform 0.2s;
  width: 100px; /* 固定缩略图宽度 */
  height: 100px; /* 固定缩略图高度 */
  padding: 10px;
}

.clue-item img {
  width: 80%;
  height: auto;
  object-fit: contain;  /* 保持图片比例 */
  border: 2px solid transparent;
}

.clue-item.active img { /* 选中状态 */
  border-color: #776ad8;
}

/* 如果需要限制最大高度 */
.clue-detail img {
  margin-top: 20px;
  max-height: 400px; /* 根据需求调整 */
}

/* 响应式适配 */
@media (max-width: 768px) {
  .clue-detail {
    width: 200px;
    min-width: 180px;
  }
}


.chat-container {
  margin-top: 20px;
  height: calc(100% - 50px);
  overflow-y: auto;
}

.message {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.message.ai {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #42b983;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 25px;
  cursor: pointer;
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
</style>