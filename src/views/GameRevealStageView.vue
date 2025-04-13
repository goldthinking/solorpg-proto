<template>
  <div class="game-reveal-stage-view">
    <StageHeader stageName="揭秘阶段" />
  </div>
</template>

<script>
import StageHeader from "@/components/StageHeader.vue";
export default {
  name: 'GameRevealStageView',
  components: {
    StageHeader
  }
}
</script>

<style scoped>
.game-reveal-stage-view {
  padding: 20px;
  padding-top: calc(20px + var(--stage-header-height));
}
</style>