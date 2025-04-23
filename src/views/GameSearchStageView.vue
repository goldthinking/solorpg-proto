<template>
  <div class="game-search-stage-view">
    <ToolBar :toolTypes="toolTypes" />
    <StageHeader stageName="搜查阶段" />
    <div class="map-container" ref="mapContainer">
      <div class="map-content" ref="mapContent">
        <img 
          src="@/assets/map_test.png" 
          class="map-image" 
          draggable="false"
        />
        <div 
          class="clue-button" 
          v-for="(button, index) in clueButtons" 
          :key="'button-' + index"
          :style="{ left: button.left, top: button.top }"
          @click="showClueDialog(button, index)"
        >
          {{ button.text }}
          <div class="badge-count" :class="{ hidden: button.remaining === 0 }">
            {{ button.remaining }}
          </div>
        </div>
      </div>
      <div class="avatar-list">
        <div 
          class="avatar-item" 
          v-for="(character, index) in characters" 
          :key="index"
          @click="showCharacterDialog(character)"
        >
          <div class="avatar-container">
            <img :src="character.avatar" class="avatar-image" />
            <div class="badge-count" :class="{ hidden: character.unreadCount === 0 }">
              {{ character.unreadCount }}
            </div>
          </div>
          <div class="character-name">{{ character.name }}</div>
        </div>
      </div>
      
      <div class="character-dialog" v-if="showDialog && currentCharacter">
        <div class="dialog-content">
          <img :src="currentCharacter.avatar" class="dialog-avatar" />
          <div class="dialog-name">{{ currentCharacter.name }}</div>
          <div class="dialog-message">
            <p>你可以向 {{ currentCharacter.name }} 提问</p>
            <p>TA的回答中可能会有不真实的信息，但是<b>加粗</b>的内容一定是正确的</p>
          </div>
          <textarea class="dialog-input" placeholder="输入你的问题..."></textarea>
          <button class="dialog-confirm" @click="closeDialog">确认</button>
          <button class="dialog-close" @click="closeDialog">X</button>
        </div>
      </div>
      
      <div class="character-dialog" v-if="showDialog && currentClueButton">
        <div class="dialog-content">
          <img :src="currentClueButton.clues[currentClueIndex].image" class="dialog-avatar" />
          <div class="dialog-message">
            <p>{{ currentClueButton.clues[currentClueIndex].description }}</p>
          </div>
          <button class="dialog-confirm" @click="showNextClue">
            {{ currentClueIndex > 0 ? '下一条线索' : '关闭' }}
          </button>
          <button class="dialog-close" @click="closeDialog">X</button>
        </div>
      </div>
      <img 
        src="@/assets/map_test.png" 
        class="map-image" 
        ref="mapImage"
        draggable="false"
      />
      <div class="edge-indicator left" v-if="showLeftEdge">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="currentColor"/>
        </svg>
      </div>
      <div class="edge-indicator right" v-if="showRightEdge">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
        </svg>
      </div>
    </div>
    <button class="next-stage-btn" @click="goToReasoningStage">搜证完成，开始推理</button>
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar.vue";
import StageHeader from "@/components/StageHeader.vue";
export default {
  name: 'GameSearchStageView',
  components: {
    ToolBar,
    StageHeader
  },
  data() {
    return {
      toolTypes: ['script', 'clue', 'note'],
      isDragging: false,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      showLeftEdge: false,
      showRightEdge: false,
      characters: [
        { name: '李小姐', avatar: "", unreadCount: 3 },
        { name: '王管家', avatar: "", unreadCount: 0 },
        { name: '林医生', avatar: "", unreadCount: 1 }
      ],
      showDialog: false,
      currentCharacter: null,
      clueButtons: [
        { 
          text: '李小姐的房间', 
          left: '15%', 
          top: '60%', 
          clues: [
            { image: 'src/assets/watchtest.png', description: '断裂的怀表（时间停在11:05）' },
            { image: 'src/assets/watchtest.png', description: '书桌上的血迹' }
          ],
          remaining: 2
        },
        { 
          text: '王管家的房间', 
          left: '22%', 
          top: '26%', 
          clues: [
            { image: 'src/assets/watchtest.png', description: '床下的药瓶' },
            { image: 'src/assets/watchtest.png', description: '衣柜里的衣服' }
          ],
          remaining: 2
        },
        { 
          text: '林医生的房间', 
          left: '72%', 
          top: '64%', 
          clues: [
            { image: 'src/assets/watchtest.png', description: '茶几上的指纹' },
            { image: 'src/assets/watchtest.png', description: '地毯上的脚印' }
          ],
          remaining: 2
        },
        { 
          text: '厨房', 
          left: '79%', 
          top: '30%', 
          clues: [
            { image: 'src/assets/watchtest.png', description: '砧板上的刀' },
            { image: 'src/assets/watchtest.png', description: '垃圾桶里的药袋' }
          ],
          remaining: 2
        },
        { 
          text: '吴总的房间', 
          left: '53%', 
          top: '26%', 
          clues: [
            { image: 'src/assets/watchtest.png', description: '折断的树枝' },
            { image: 'src/assets/watchtest.png', description: '泥土中的脚印' }
          ],
          remaining: 2
        },
        { 
          text: '杂物间', 
          left: '40.5%', 
          top: '64%', 
          clues: [
            { image: 'src/assets/watchtest.png', description: '车钥匙' },
            { image: 'src/assets/watchtest.png', description: '后备箱的行李' }
          ],
          remaining: 2
        }
      ],
      currentClueButton: null,
      currentClueIndex: 0
    }
  },
  mounted() {
    const mapContainer = this.$refs.mapContainer
    const mapImage = this.$refs.mapImage
    
    mapContainer.addEventListener('touchstart', this.startDrag, { passive: false })
    mapContainer.addEventListener('touchmove', this.drag, { passive: false })
    mapContainer.addEventListener('touchend', this.endDrag)
    mapContainer.addEventListener('touchcancel', this.endDrag)
  },
  methods: {
    startDrag(e) {
      this.isDragging = true
      const touch = e.touches ? e.touches[0] : e
      this.startPos = {
        x: touch.clientX - (this.currentPos.x || 0),
        y: touch.clientY - (this.currentPos.y || 0)
      }
      this.$refs.mapContainer.style.cursor = 'grabbing'
    },
    drag(e) {
      if (!this.isDragging) return
      
      const touch = e.touches ? e.touches[0] : e
      const newX = touch.clientX - (this.startPos.x || 0)

      // console.log({
      //   clientX: touch.clientX,
      //   startPosX: this.startPos.x,
      //   newX: newX,
      //   maxLeft: this.$refs.mapContainer.offsetWidth - this.$refs.mapImage.offsetWidth,
      //   maxRight: 0
      // })
      
      // 边界检测
      const containerWidth = this.$refs.mapContainer.offsetWidth
      const imageWidth = this.$refs.mapContent.offsetWidth
      const maxLeft = 0
      const maxRight = containerWidth - imageWidth
      
      // 限制横向移动
      let clampedX = newX
      if (newX > maxLeft) {
        clampedX = maxLeft
        this.showLeftEdge = false
      } else {
        this.showLeftEdge = true
      }
      
      if (newX < maxRight) {
        clampedX = maxRight
        this.showRightEdge = false
      } else {
        this.showRightEdge = true
      }
      
      // 确保在边界内
      clampedX = Math.max(maxRight, Math.min(maxLeft, newX))
      
      this.currentPos = {
        x: clampedX,
        y: 0
      }
      
      this.$refs.mapContent.style.transform = `translateX(${this.currentPos.x}px)`
      e.preventDefault()
    },
    endDrag() {
      this.isDragging = false
    },
    showCharacterDialog(character) {
      this.currentCharacter = character
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    },
    goToReasoningStage() {
      this.$router.push('/game-reasoning-stage');
    },
    showClueDialog(button, index) {
      this.currentClueButton = button
      this.currentClueIndex = button.clues.length - 1
      this.showDialog = true
    },
    showNextClue() {
      if (this.currentClueButton && this.currentClueIndex > 0) {
        this.currentClueIndex--
        this.currentClueButton.remaining--
      } else {
        this.showDialog = false
      }
    }
  }
}
</script>

<style scoped>
.avatar-container {
  position: relative;
}

.badge-count {
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  background: var(--accent-dark);
  color: var(--text-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.badge-count.hidden {
  display: none;
}
.game-search-stage-view {
  display: flex;
  flex-direction: column;
  padding-top: var(--stage-header-height);
  position: relative;
  height: 100%;
  overflow: hidden;
}

.map-container {
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
}

.map-content {
  width: fit-content;
  height: 100%;
  will-change: transform;
  touch-action: none;
  white-space: nowrap;
}

.map-image {
  width: auto;
  height: 100%;
}

.edge-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.3);
  z-index: 1000;
}

.edge-indicator.left {
  left: 0;
}

.edge-indicator.right {
  right: 0;
}

.avatar-list {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.avatar-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.character-name {
  margin-top: 5px;
  font-size: 12px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.character-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.clue-button {
  position: absolute;
  background-color: var(--accent-light);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 80px;
}

.dialog-content {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  text-align: center;
  color: var(--text-primary);
  position: relative;
}

.dialog-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 15px;
  object-fit: cover;
}

.dialog-name {
  font-size: 18px;
  margin-bottom: 15px;
}

.dialog-message {
  margin-bottom: 20px;
  font-size: 16px;
}

.dialog-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-light);
  cursor: pointer;
}

.dialog-input {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  margin: 15px 0;
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-primary);
  resize: vertical;
}

.dialog-confirm {
  padding: 10px 20px;
  margin-top: 10px;
  background-color: var(--accent-dark);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.next-stage-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background-color: var(--accent-dark);
  color: var(--text-light);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>