<template>
  <div class="script-detail-view">
    <div class="script-header">
      <img :src="script.cover" class="script-cover" />
      <div class="header-info">
        <h1>{{ script.name }}</h1>
        <div class="meta-row">
          <span class="rating">{{ script.rating }}分</span>
          <DifficultyTag :level="script.difficulty" />
        </div>
      </div>
    </div>
    
    <div class="script-content">
      <div class="section">
        <h3>剧本简介</h3>
        <p class="description">{{ script.description }}</p>
      </div>
      
      <div class="section">
        <h3>标签</h3>
        <div class="tags">
          <span class="tag" v-for="(tag, index) in script.tags" :key="index">{{ tag }}</span>
        </div>
      </div>
      
      <div class="section">
        <h3>角色介绍</h3>
        <div class="characters-scroll">
          <div 
            class="character-item" 
            v-for="(character, index) in script.characters" 
            :key="index"
            @click="selectCharacter(index)"
            :class="{ active: selectedCharacterIndex === index }"
          >
            <div class="avatar-container">
              <img :src="character.avatar" class="character-avatar" />
              <span v-if="index === 0" class="player-tag">玩家</span>
            </div>
            <span class="character-name">{{ character.name }}</span>
          </div>
        </div>
        <div class="character-description">
          {{ currentCharacter.description }}
        </div>
      </div>
      
      <button class="start-button" @click="startGame">开始游戏</button>
    </div>
  </div>
</template>

<script>
import DifficultyTag from '@/components/DifficultyTag.vue'

export default {
  name: 'ScriptDetailView',
  components: { DifficultyTag },
  data() {
    return {
      script: {
        id: 1,
        name: '血色山庄',
        cover: 'https://example.com/cover1.jpg',
        rating: 4.5,
        difficulty: 'beginner',
        description: '一座被雪覆盖的山庄，一场离奇的命案，每个人都有自己的秘密...',
        tags: ['悬疑', '推理'],
        players: 1200,
        characters: [
          {
            name: '林医生',
            avatar: 'https://example.com/avatar1.jpg',
            description: '山庄的家庭医生，表面温和，实际有着不可告人的秘密。'
          },
          {
            name: '王管家',
            avatar: 'https://example.com/avatar2.jpg',
            description: '山庄的老管家，对主人忠心耿耿，但似乎知道太多事情。'
          },
          {
            name: '李小姐',
            avatar: 'https://example.com/avatar3.jpg',
            description: '山庄主人的女儿，性格孤僻，很少与人交流。'
          }
        ]
      },
      selectedCharacterIndex: 0
    }
  },
  methods: {
    startGame() {
      this.$router.push('/game')
    },
    selectCharacter(index) {
      this.selectedCharacterIndex = index
    }
  },
  computed: {
    currentCharacter() {
      return this.script.characters[this.selectedCharacterIndex]
    }
  }
}
</script>

<style scoped>
.script-detail-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.script-header {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.script-cover {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

.header-info {
  flex: 1;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.rating {
  font-size: 16px;
  color: #ff9500;
  margin-right: 6px;
}

.script-content {
  margin-top: 30px;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  margin-bottom: 15px;
  font-size: 18px;
}

.description {
  line-height: 1.6;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 4px 12px;
  background-color: transparent;
  border: 1px solid var(--text-dark);
  border-radius: 999px;
  font-size: 14px;
  color: var(--text-dark);
}

.characters-scroll {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 15px;
}

.character-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  cursor: pointer;
}

.character-item.active {
  color: var(--accent-dark);
}

.avatar-container {
  position: relative;
}

.character-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
  border: 2px solid transparent;
}

.player-tag {
  position: absolute;
  right: -5px;
  bottom: 5px;
  background: var(--accent-dark);
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 8px;
}

.character-item.active .character-avatar {
  border-color: var(--accent-dark);
}

.character-name {
  font-size: 14px;
  text-align: center;
}

.character-description {
  line-height: 1.6;
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.start-button {
  display: block;
  width: 100%;
  padding: 15px;
  background: var(--accent-dark);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;
  cursor: pointer;
}
</style>