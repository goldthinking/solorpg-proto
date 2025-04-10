<template>
  <div class="tab-bar">
    <div 
      class="tab-item" 
      v-for="(tab, index) in tabs" 
      :key="index"
      :class="{ 'active': isActive(tab.path) }"
      @click="navigateTo(tab.path)"
    >
      <div class="tab-icon">{{ tab.icon }}</div>
      <div class="tab-label">{{ tab.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    activePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabs: [
        { label: '剧本', path: '/', icon: '📖' },
        { label: '我的', path: '/profile', icon: '👤' }
      ]
    }
  },
  methods: {
    isActive(path) {
      return this.$route.path === path
    },
    navigateTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  background-color: white;
  border-top: 1px solid #eee;
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
}

.tab-item.active {
  color: #42b983;
}

.tab-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.tab-label {
  font-size: 12px;
}
</style>