<template>
  <div class="game-script-stage-view">
    <ToolBar :items="allTools" />
    <div class="script-header">
      <h1>{{ chapterTitle }}</h1>
    </div>
    <div class="script-content">
      <p v-for="(paragraph, index) in scriptContent" :key="index">{{ paragraph }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameScriptStageView',
  components: {
    ToolBar: () => import('@/components/ToolBar.vue')
  },
  data() {
    return {
      chapterTitle: '第一章：神秘的开端',
      scriptContent: [
        '这是一个风雨交加的夜晚，你收到了一封神秘的邀请函...',
        '邀请函上写着：欢迎来到玫瑰庄园，参加一场特别的聚会...',
        '当你踏入庄园大门时，管家微笑着迎接了你...'
      ],
      toolTypes: ['script', 'clue', 'character', 'note']
    }
  }
}
</script>

<style scoped>
.game-script-stage-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.script-header {
  text-align: center;
  margin-bottom: 30px;
}

.script-content {
  line-height: 1.8;
  font-size: 16px;
}

.script-content p {
  margin-bottom: 20px;
}
</style>