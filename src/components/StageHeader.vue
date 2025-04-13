<template>
  <div class="stage-header">
    <h1>{{ stageName }}</h1>
  </div>
</template>

<script>
export default {
  name: 'StageHeader',
  props: {
    stageName: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.stage-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: var(--stage-header-height);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-secondary);
  padding: 10px 0;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.stage-header h1 {
  font-size: 18px;
  color: var(--text-primary);
  margin: 0;
}
</style>