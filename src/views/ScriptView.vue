<template>
  <div class="script-view">
    <div class="search-bar">
      <input type="text" placeholder="搜索剧本..." />
    </div>
    
    <div class="button-row">
      <button class="rank-button">
        <span>排行榜</span>
      </button>
      <button class="category-button">
        <span>分类</span>
      </button>
    </div>
    
    <div class="script-list">
      <div class="script-item" v-for="(script, index) in scripts" :key="index">
        <img :src="script.cover" class="script-cover" />
        <div class="script-info">
          <h3>{{ script.name }}</h3>
          <div class="script-meta">
            <DifficultyTag :level="script.difficulty" />
            <span class="rating">{{ script.rating }}分</span>
            <span class="players">{{ script.players }}人玩过</span>
          </div>
          <div class="tags">
            <span class="tag" v-for="(tag, tagIndex) in script.tags" :key="tagIndex">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TabBar />
</template>

<script>
import TabBar from '@/components/TabBar.vue'
import DifficultyTag from '@/components/DifficultyTag.vue'

export default {
  name: 'ScriptView',
  components: { TabBar, DifficultyTag },
  data() {
    return {
      scripts: [
        {
          name: '剧本1',
          cover: '',
          difficulty: 'beginner',
          rating: 4.5,
          players: 1200,
          tags: ['悬疑', '推理']
        },
        {
          name: '剧本2',
          cover: '',
          difficulty: 'medium',
          rating: 4.2,
          players: 850,
          tags: ['情感', '沉浸']
        }
      ]
    }
  }
}
</script>

<style scoped>
.script-view {
  padding: 20px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.button-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.button-row button {
  flex: 0 0 48%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.rank-button {
  background-color: var(--accent-dark);
}

.category-button {
  background-color: var(--accent-light);
}

.script-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.script-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--bg-secondary);
}

.script-cover {
  width: 80px;
  height: 120px;
  background-color: #2d2d2d;
  object-fit: cover;
}

.script-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.script-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.rating {
  color: var(--warning);
}

.players {
  color: var(--text-secondary);
}

.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
}
</style>