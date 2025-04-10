<template>
  <div class="profile-view">
    <h1>我的</h1>
  </div>
  <TabBar />
</template>

<script>
import TabBar from '@/components/TabBar.vue'

export default {
  name: 'ProfileView',
  components: { TabBar }
}
</script>

<style scoped>
.profile-view {
  padding: 20px;
}
</style>