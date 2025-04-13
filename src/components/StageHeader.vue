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
  background-color: var(--bg-secondary);
  padding: 12px 16px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.stage-header h1 {
  font-size: 18px;
  color: var(--text-primary);
  margin: 0;
  padding: 8px 0;
}
</style>