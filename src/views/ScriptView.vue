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
          <div class="title-row">
            <h3>{{ script.name }}</h3>
            <div class="title-meta">
              <span class="rating">{{ script.rating }}分</span>
              <DifficultyTag :level="script.difficulty" />
            </div>
          </div>
          <p class="description">{{ script.description }}</p>
          <div class="bottom-row">
            <div class="tags">
              <span class="tag" v-for="(tag, tagIndex) in script.tags" :key="tagIndex">{{ tag }}</span>
            </div>
            <span class="players">{{ script.players }}人玩过</span>
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
          name: '血色山庄',
          cover: '',
          difficulty: 'beginner',
          rating: 4.5,
          players: 1200,
          tags: ['悬疑', '推理'],
          description: '一座被雪覆盖的山庄，一场离奇的命案，每个人都有自己的秘密...'
        },
        {
          name: '时光邮局',
          cover: '',
          difficulty: 'medium',
          rating: 4.2,
          players: 850,
          tags: ['情感', '沉浸'],
          description: '一封来自过去的信，改变了所有人的命运...'
        },
        {
          name: '镜中世界',
          cover: '',
          difficulty: 'hard',
          rating: 4.8,
          players: 500,
          tags: ['烧脑', '反转'],
          description: '镜子里的世界是真实的吗？谁才是真正的你？'
        },
        {
          name: '古堡迷踪',
          cover: '',
          difficulty: 'medium',
          rating: 4.3,
          players: 700,
          tags: ['恐怖', '解谜'],
          description: '百年古堡中的诡异事件，真相隐藏在黑暗之中...'
        },
        {
          name: '深海迷城',
          cover: '',
          difficulty: 'expert',
          rating: 4.7,
          players: 600,
          tags: ['科幻', '悬疑'],
          description: '海底城市的神秘失踪事件，探索未知的深海世界...'
        },
        {
          name: '校园怪谈',
          cover: '',
          difficulty: 'beginner',
          rating: 4.0,
          players: 950,
          tags: ['恐怖', '校园'],
          description: '午夜校园里的诡异传说，揭开不为人知的秘密...'
        },
        {
          name: '皇家赌局',
          cover: '',
          difficulty: 'medium',
          rating: 4.4,
          players: 800,
          tags: ['谍战', '推理'],
          description: '一场关乎国家命运的赌局，谁是真正的幕后黑手？'
        },
        {
          name: '未来都市',
          cover: '',
          difficulty: 'hard',
          rating: 4.9,
          players: 550,
          tags: ['科幻', '赛博朋克'],
          description: '高科技低生活的未来世界，人类与AI的终极对决...'
        },
        {
          name: '乡村往事',
          cover: '',
          difficulty: 'beginner',
          rating: 4.1,
          players: 900,
          tags: ['情感', '乡村'],
          description: '一个偏远村庄的温情故事，回忆那些被遗忘的时光...'
        }
      ]
    }
  }
}
</script>

<style scoped>
.script-view {
  padding: 20px;
  padding-bottom: 70px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.search-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-bottom: 20px;
  background-color: var(--bg-primary);
  padding: 10px 0;
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
  padding: 12px 12px 12px 40px;
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 16px;
  position: relative;
}

.rank-button {
  background: linear-gradient(135deg, #d6a65f, #9e7211);
}

.rank-button::before {
  content: '🏆';
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
}

.category-button {
  background: linear-gradient(135deg, #8262ec, #521ca8);
}

.category-button::before {
  content: '🏷️';
  position: absolute;
  left: 18px;
  font-size: 24px;
  top: 50%;
  transform: translateY(-50%);
}

.button-row button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 5px 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.title-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.rating {
  color: var(--warning);
}

.players {
  color: var(--text-secondary);
  font-size: 12px;
}

.bottom-row {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 8px;
  background-color: transparent;
  border: 1px solid #888;
  border-radius: 999px;
  font-size: 12px;
  color: #ccc;
}
</style>