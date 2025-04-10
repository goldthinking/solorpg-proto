<template>
  <div class="script-view">
    <h1>剧本页面</h1>
  </div>
  <TabBar />
</template>

<script>
import TabBar from '@/components/TabBar.vue'

export default {
  name: 'ScriptView',
  components: { TabBar }
}
</script>

<style scoped>
.script-view {
  padding: 20px;
}
</style>