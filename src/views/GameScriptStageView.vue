<template>
  <div class="game-script-stage-view">
    <ToolBar :items="allTools" />
    <StageHeader :stageName="chapterTitle" />
    <h2 class="script-header">{{ scriptChapter.title }}</h2>
    <div class="script-content">
      <p v-html="formattedContent"></p>
    </div>
    <button class="next-stage-btn" @click="goToSearchStage">阅读完毕，前往搜证</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScriptDataStore } from '@/stores/scriptDataStore' // 引入 store
import ToolBar from "@/components/ToolBar.vue"
import StageHeader from "@/components/StageHeader.vue"

// 获取当前路由参数
const route = useRoute()
const router = useRouter()

// 获取 Pinia store 中的 scriptData
const scriptDataStore = useScriptDataStore()
const scriptData = scriptDataStore.scriptData

// 获取当前章节索引
const chapterIndex = route.params.chapterIndex ? parseInt(route.params.chapterIndex) : 0

// 根据 chapterIndex 设置当前章节数据
const scriptChapter = computed(() => {
  return scriptData?.chapters[chapterIndex] || {}
})

const chapterTitle = computed(() => scriptChapter.value.title || '剧本阶段')
const scriptContent = computed(() => scriptChapter.value.content ? scriptChapter.value.content.split('\n') : [])

const toolTypes = ['script', 'clue', 'note']

// 导航到搜证阶段
const goToSearchStage = () => {
  router.push({ name: 'game-search-stage', params: { chapterIndex: chapterIndex } });
}

const formattedContent = computed(() => {
  // 确保 content 存在
  return scriptChapter.value?.content ? scriptChapter.value.content.replace(/\n/g, '<br>') : '';
});

// 获取并打印章节数据
onMounted(() => {
  console.log('Current Chapter:', scriptChapter.value)
})
</script>

<style scoped>
.game-script-stage-view {
  padding: 20px;
  padding-top: calc(20px + var(--stage-header-height));
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 120px;
}

.script-header {
  margin-bottom: 30px;
}

.script-content {
  line-height: 1.8;
  font-size: 16px;
}

.script-content p {
  margin-bottom: 20px;
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

</style>