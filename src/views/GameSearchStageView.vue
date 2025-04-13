<template>
  <div class="game-search-stage-view">
    <ToolBar :toolTypes="toolTypes" />
    <h1>游戏-搜查阶段</h1>
  </div>
</template>

<script>
export default {
  name: 'GameSearchStageView',
  components: {
    ToolBar: () => import('@/components/ToolBar.vue')
  },
  data() {
    return {
      toolTypes: ['script', 'clue', 'character', 'note']
    }
  }
}
</script>

<style scoped>
.game-search-stage-view {
  padding: 20px;
}
</style>