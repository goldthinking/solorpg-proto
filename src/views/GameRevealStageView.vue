<template>
  <div class="game-reveal-stage-view">
    <StageHeader stageName="揭秘阶段" />
    
    <section class="reveal-section">
      <h3 class="section-title">真相揭秘</h3>
      <!-- 真相内容插槽 -->
      <div class="reveal-content">
        <div class="truth-card">
          <div class="truth-sections">
            <div v-for="(section, index) in truthSections" :key="index" class="truth-section">
              <h4 class="truth-title">{{ section.title }}</h4>
              <p class="truth-text">{{ section.content }}</p>
            </div>
          </div>
        </div>
        <slot name="truth-content"></slot>
      </div>
    </section>

    <section class="scoring-section">
      <div class="score-header">
        <h3 class="section-title">推理评分</h3>
        <span class="grade-badge">{{ scoreGrade }}</span>
      </div>

      <div class="metrics-grid">
        <div class="metric-item">
          <label>平均答题次数</label>
          <span class="metric-value">{{ averageAttempts }}</span>
        </div>
        <div class="metric-item">
          <label>总用时排名</label>
          <span class="metric-value">{{ timeRank }}</span>
        </div>
        <div class="metric-item">
          <label>问答精准度</label>
          <span class="metric-value">{{ accuracy }}/5</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import StageHeader from "@/components/StageHeader.vue";
export default {
  name: 'GameRevealStageView',
  components: {
    StageHeader
  },
  data() {
    return {
      scoreGrade: 'S',
      averageAttempts: 2.8,
      timeRank: 'TOP 10%',
      accuracy: 4.2,
      truthSections: [
        {
          icon: '🔍',
          title: '案件背景',
          content: '2023年7月15日凌晨，著名企业家王先生被发现死于自家书房。现场呈现密室状态，监控显示最后进入者为李小姐。死者留有疑似遗书，但笔迹鉴定存在疑点。'
        },
        {
          icon: '🕵️',
          title: '关键线索',
          content: '1. 书房暗门指纹匹配李小姐\n2. 定时装置残留纤维与李小姐外套一致\n3. 伪造遗书的墨水生产日期在案发后'
        },
        {
          icon: '✅',
          title: '最终结论',
          content: '李小姐利用职务之便设置延时机关，通过伪造遗书制造自杀假象。关键证据链完整，包含指纹、纤维物证及墨水鉴定结果。'
        }
      ]
    }
  }
}
</script>

<style scoped>
.game-reveal-stage-view {
  padding: 20px;
  padding-top: calc(20px + var(--stage-header-height));
}

.section-title {
  color: var(--text-primary);
  font-size: 1.4em;
  -webkit-background-clip: text;
  background-clip: text;
  text-fill-color: transparent;
  display: inline-block;
  padding-right: 12px;
  margin: 24px 0 16px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.truth-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.truth-sections {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.truth-section {
  border-left: 3px solid var(--accent-primary);
}

.truth-title {
  color: var(--text-primary);
  margin-top: 6px;
  margin-bottom: 2px;
}

.truth-text {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95em;
}

.truth-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.truth-title {
  color: var(--text-primary);
  margin-bottom: 12px;
}

.truth-text {
  color: var(--text-secondary);
  line-height: 1.6;
}

.grade-display {
  text-align: center;
  margin: 20px 0;
}

.grade-badge {
  font-size: 36px;
  font-weight: 800;
  margin-top: 10px;
  padding: 8px 24px;
  border-radius: 24px;
  background-image: linear-gradient(135deg, #cf7726,#92380c);
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  position: relative;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-item {
  background: var(--bg-secondary);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.metric-item label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9em;
  margin-bottom: 8px;
}
</style>