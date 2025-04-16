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
              v-for="clue in clues"
              :key="clue.id"
              class="clue-item"
              @click="activeClue = clue.id"
          >
            <img
                :src="clue.thumbnail"
                alt="线索缩略图"
            >
          </div>
        </div>
        <!-- 右侧详情区域 -->
        <div class="clue-detail" v-if="activeClue">
          <img :src="activeClueData.image" alt="线索大图">
          <p>{{ activeClueData.description }}</p>
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

</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  toolTypes: {
    type: Array,
    required: true,
    default: () => ['script', 'clue', 'note']
  }
})

const isExpanded = ref(false)
const activePanel = ref(null)
const activeChapter = ref(1)
const activeClue = ref(null)
const activeClueTab = ref('clue')

const toolIcons = {
  script: 'mdi:book',
  clue: 'mdi:magnify',
  note: 'mdi:note-text',
  ai: 'mdi:robot'
}

const toolLabels = {
  script: '剧本',
  clue: '线索',
  note: '笔记',
  ai: 'AI问答'
}

// 数据
const chapters = ref([
  {
    id: 1,
    title: '第一章 案发当日',
    content: `2023年10月1日23:17，警方接到报案称青松别墅发生命案。抵达现场时发现：
    - 死者：林氏集团总裁林国栋（52岁）
    - 姿势：仰卧在书房地毯上，右手紧握金色怀表
    - 致命伤：后脑钝器击打（凶器未发现）
    - 异常状况：书房保险柜开启，重要文件散落
    - 关键物证：窗台外侧发现的半枚带血迹指纹`
  },
  {
    id: 2,
    title: '第二章 时间谜团',
    content: `法医报告显示：
    - 死亡时间：当日21:30-22:30
    - 胃内容物检测出微量巴比妥类药物
    - 怀表停摆时间：23:05（明显晚于死亡时间）

矛盾点：
    ① 管家证词称22:45最后一次见到活着的死者
    ② 监控显示21:50后无人进出别墅
    ③ 死者手表停留在22:15`
  },
  {
    id: 3,
    title: '第三章 暗流涌动',
    content: `主要关系人陈述：
    ▶ 林太太（苏婉蓉，45岁）：
    - 案发时在琴房练习《月光奏鸣曲》
    - 近期正协议离婚
    - 被目击案发前日与私人律师密谈

    ▶ 养子林枫（28岁）：
    - 案发后手机定位显示在城南酒吧
    - 两周前被取消遗产继承权
    - 书房发现其撕毁的借条（金额2000万）`
  },
  {
    id: 4,
    title: '第四章 血色往事',
    content: `旧案关联：
    ■ 20年前青松别墅前主人周氏灭门案
    - 相似特征：同款金色怀表出现现场
    - 未解之谜：周家长子下落不明

   新发现：
    - 林国栋书桌暗格内的老照片：
      ▷ 五人合影（其中三人被红笔划去）
      ▷ 背面标注日期：2003.7.15
      ▷ 右下角潦草字迹："该偿还了"`
  }
])

const clues = ref([
  {
    id: 1,
    description: '断裂的怀表（时间停在11:05）',
    image: 'src/assets/watchtest.png',
    thumbnail: 'src/assets/watchtest.png'
  },{
    id: 2,
    description: '断裂的怀表',
    image: 'src/assets/watchtest.png',
    thumbnail: 'src/assets/watchtest.png'
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


const openPanel = (type) => {
  isExpanded.value = false
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
  padding-left:0;
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
  line-height: 1.6;
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
  width: 50px; /* 左侧列宽度 */
  padding: 10px;
  background: rgba(245, 245, 245, 0); /* 可选背景色 */
}

.clue-item {
  cursor: pointer;
  transition: transform 0.2s;
  width: 50px; /* 固定缩略图宽度 */
  height: 50px; /* 固定缩略图高度 */
}

.clue-item img {
  width: 80%;
  height: auto;
  object-fit: contain;  /* 保持图片比例 */
  border: 2px solid transparent;
}

.clue-item:hover {
  transform: scale(1.05);
}

.clue-item.active img { /* 选中状态 */
  border-color: #776ad8;
}

/* 如果需要限制最大高度 */
.clue-detail img {
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
</style>