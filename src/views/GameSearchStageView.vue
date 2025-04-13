<template>
  <div class="game-search-stage-view">
    <ToolBar :toolTypes="toolTypes" />
    <StageHeader stageName="搜查阶段" />
    <div class="map-container" ref="mapContainer">
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
      toolTypes: ['script', 'clue', 'character', 'note'],
      isDragging: false,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      showLeftEdge: false,
      showRightEdge: false
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
      const imageWidth = this.$refs.mapImage.offsetWidth
      const maxLeft = 0
      const maxRight = containerWidth - imageWidth
      
      // 限制横向移动
      let clampedX = newX
      if (newX > maxLeft) {
        clampedX = maxLeft
        this.showLeftEdge = true
      } else {
        this.showLeftEdge = false
      }
      
      if (newX < maxRight) {
        clampedX = maxRight
        this.showRightEdge = true
      } else {
        this.showRightEdge = false
      }
      
      // 确保在边界内
      clampedX = Math.max(maxRight, Math.min(maxLeft, newX))
      
      this.currentPos = {
        x: clampedX,
        y: 0
      }
      
      this.$refs.mapImage.style.transform = `translate(${this.currentPos.x}px, 0)`
      e.preventDefault()
    },
    endDrag() {
      this.isDragging = false
    }
  }
}
</script>

<style scoped>
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
  width: 100%;
  flex: 1;
  overflow: hidden;
}

.map-image {
  position: absolute;
  height: 100%;
  user-select: none;
  will-change: transform;
  touch-action: none;
}

.edge-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.3);
  border-radius: 50%;
  z-index: 10;
}

.edge-indicator.left {
  left: 10px;
}

.edge-indicator.right {
  right: 10px;
}
</style>