<template>
  <div
      class="toolbar-container"
      :class="{
      'collapsed': !isExpanded,
      'detail-view': activePanel
    }"
  >
    <!-- 折叠按钮 -->
    <div class="toggle-button" @click="toggleToolbar">
      <Icon :icon="isExpanded ? 'mdi:chevron-right' : 'mdi:chevron-left'" />
    </div>

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
            v-for="chapter in chapters"
            :key="chapter.id"
            :class="['tab-item', { active: activeChapter === chapter.id }]"
            @click="activeChapter = chapter.id"
        >
          第{{ chapter.id }}章
        </div>
      </div>
      <div class="chapter-content">
        <h3>{{ activeChapterData.title }}</h3>
        <p>{{ activeChapterData.content }}</p>
        <button class="close-btn" @click="closePanel">×</button>
      </div>
    </div>

    <!-- 线索详情 -->
    <div v-if="activePanel === 'clue'" class="detail-panel">
      <div class="clue-list">
        <div
            v-for="clue in clues"
            :key="clue.id"
            class="clue-item"
            @click="activeClue = clue.id"
        >
          <img :src="clue.thumbnail" alt="线索缩略图">
        </div>
      </div>
      <div class="clue-detail" v-if="activeClue">
        <img :src="activeClueData.image" alt="线索大图">
        <p>{{ activeClueData.description }}</p>
        <button class="close-btn" @click="activeClue = null">← 返回列表</button>
      </div>
      <button class="close-btn" @click="closePanel">×</button>
    </div>

    <!-- AI问答 -->
    <div v-if="activePanel === 'ai'" class="detail-panel">
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  toolTypes: {
    type: Array,
    required: true,
    default: () => ['script', 'clue', 'character', 'note']
  }
})

const isExpanded = ref(false)
const activePanel = ref(null)
const activeChapter = ref(1)
const activeClue = ref(null)

const toolIcons = {
  script: 'mdi:book',
  clue: 'mdi:magnify',
  character: 'mdi:account-group',
  note: 'mdi:note-text',
  ai: 'mdi:robot'
}

const toolLabels = {
  script: '剧本',
  clue: '线索',
  character: '人物',
  note: '笔记',
  ai: 'AI问答'
}

// 数据示例
const chapters = ref([
  { id: 1, title: '第一章 案发当日', content: '2023年10月1日晚，别墅内...' },
  { id: 2, title: '第二章 时间疑点', content: '根据法医鉴定结果...' }
])

const clues = ref([
  {
    id: 1,
    description: '断裂的怀表（时间停在11:05）',
    image: '/clues/clue1-full.jpg',
    thumbnail: '/clues/clue1-thumb.jpg'
  }
])

const aiLogs = ref([
  { type: 'user', content: '死者的死亡时间是什么时候？' },
  { type: 'ai', content: '根据法医报告...' }
])

const activeChapterData = computed(() =>
    chapters.value.find(c => c.id === activeChapter.value) || {}
)

const activeClueData = computed(() =>
    clues.value.find(c => c.id === activeClue.value) || {}
)

const toggleToolbar = () => {
  if (!activePanel.value) {
    isExpanded.value = !isExpanded.value
  }
}

const openPanel = (type) => {
  isExpanded.value = true
  activePanel.value = type
}

const closePanel = () => {
  activePanel.value = null
  activeClue.value = null
}
</script>

<style scoped>
.toolbar-container {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  transition: all 0.3s ease;
  z-index: 1000;
  border-radius: 10px 0 0 10px;
  backdrop-filter: blur(10px);
}

.toolbar-container.collapsed {
  width: 36px;
  margin-left:0;
}

.toolbar-container.detail-view {
  width: 80vw;
  height: 90vh;
  top: 50%;
  transform: translateY(-50%);
}

.toggle-button {
  position: absolute;
  left: -40px;
  top: 10px;
  cursor: pointer;
  padding: 10px;
  background: #2c3e50;
  border-radius: 5px 0 0 5px;
}

.main-tools {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toolbar-container.collapsed .main-tools {
  padding-left:0;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s;
}

.tool-item:hover {
  background: rgba(255, 255, 255, 0.1);
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
}

.tab-item {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
}

.tab-item.active {
  background: #42b983;
  font-weight: bold;
}

.chapter-content {
  line-height: 1.6;
}

.clue-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.clue-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s;
}

.clue-item:hover img {
  transform: scale(1.05);
}

.clue-detail img {
  max-width: 100%;
  max-height: 400px;
  margin-bottom: 20px;
}

.chat-container {
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
</style>