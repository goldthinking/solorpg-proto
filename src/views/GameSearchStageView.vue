<template>
  <div class="game-search-stage-view">
    <ToolBar :toolTypes="toolTypes" />
    <StageHeader stageName="搜查阶段" />
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar.vue";
import StageHeader from "@/components/StageHeader.vue";
export default {
  name: 'GameSearchStageView',
  components: {
    ToolBar,
    StageHeader
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