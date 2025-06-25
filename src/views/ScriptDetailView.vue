<template>
  <div v-if="scriptDTO" class="script-detail-view">
    <div class="script-header">
      <!-- <img :src="script.cover" class="script-cover" /> -->
      <div class="header-info">
        <h1>{{ script.scriptName }}</h1>
        <div class="meta-row">
          <DifficultyTag :level="script.difficulty" />
        </div>
      </div>
    </div>
    
    <div class="script-content">
      <div class="section">
        <h3>剧本简介</h3>
        <p class="description">{{ script.scriptDescription }}</p>
      </div>
      
      <div class="section">
        <h3>标签</h3>
        <div class="tags">
          <span class="tag" v-for="(tag, index) in scriptDTO.tags" :key="index">{{ tag.tagName }}</span>
        </div>
      </div>
      
      <div class="section">
        <h3>角色介绍</h3>
        <div class="characters-scroll">
          <div 
            class="character-item" 
            v-for="(character, index) in scriptData.characters" 
            :key="index"
            @click="selectCharacter(index)"
            :class="{ active: selectedCharacterIndex === index }"
          >
            <div class="avatar-container">
              <img :src="character.url" class="character-avatar" />
              <span v-if="index === 0" class="player-tag">玩家</span>
            </div>
            <span class="character-name">{{ character.name }}</span>
          </div>
        </div>
        <div class="character-description">
          {{ currentCharacter.desc }}
        </div>
      </div>
      
      <button class="start-button" @click="startGame">开始游戏</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import DifficultyTag from '@/components/DifficultyTag.vue'
  import { fetchScriptDetails, fetchScriptDTODetails } from '@/api/script.js'
  import { useRoute, useRouter } from 'vue-router'
  import { useScriptDataStore } from '@/stores/scriptDataStore'
  import { useGameSessionStore } from '@/stores/gameSessionStore'

  const script = ref(null)
  const scriptDTO = ref(null)
  const selectedCharacterIndex = ref(0)
  const scriptData = ref(null)

  // 获取当前路由参数
  const route = useRoute()
  const router = useRouter()

  const scriptId = route.params.scriptId  // 从路由参数获取 scriptId
  const scriptDataStore = useScriptDataStore(); 
  const gameSessionStore = useGameSessionStore();
  gameSessionStore.$reset();

  if (scriptId) {
    fetchScriptDetails(scriptId)
      .then(data => {
        script.value = data 
        scriptData.value = JSON.parse(data.scriptData)
        scriptDataStore.setScriptData(scriptData.value)
      })
      .catch(error => {
        console.error("Error fetching script details:", error)
      })

    fetchScriptDTODetails(scriptId)
      .then(data => {
        scriptDTO.value = data
      })
      .catch(error => {
        console.error("Error fetching scriptDTO details:", error)
      })
  }

  const currentCharacter = computed(() => {
    if (scriptData.value && selectedCharacterIndex.value !== null) {
      return scriptData.value.characters[selectedCharacterIndex.value] || null
    }
    return null
  })

  // 开始游戏
  const startGame = () => {
    router.push({ name: 'game-script-stage', params: { chapterIndex: 0 } });
  }

  // 选择角色
  const selectCharacter = (index) => {
    selectedCharacterIndex.value = index
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