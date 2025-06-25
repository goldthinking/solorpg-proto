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
          <label>答题平均分</label>
          <span class="metric-value">{{ averageMaxScore }}</span>
        </div>
        <div class="metric-item">
          <label>问答精准度</label>
          <span class="metric-value">{{ accuracy*100 }}%</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from 'vue';
import { useScriptDataStore } from '@/stores/scriptDataStore'; // 引入Pinia store
import StageHeader from "@/components/StageHeader.vue";
import { useGameSessionStore } from "@/stores/gameSessionStore";

const scriptDataStore = useScriptDataStore();
const scriptData = scriptDataStore.scriptData; // 获取完整的 scriptData

// 使用ref替代data中的变量
const scoreGrade = ref('');
const timeRank = ref('TOP 10%');
const truthSections = ref([]);

truthSections.value[0] = scriptData.reveal;

const gameSessionStore = useGameSessionStore();

// 计算 questionAnswersCount 的平均次数
const averageAttempts = computed(() => {
  const totalQuestions = Object.keys(gameSessionStore.questionAnswersCount).length; // 获取问题总数
  const totalAnswers = Object.values(gameSessionStore.questionAnswersCount).reduce((sum, questionData) => sum + questionData.count, 0); // 获取总回答次数
  console.log(totalAnswers)
  
  // 计算平均值
  return totalQuestions > 0 ? totalAnswers / totalQuestions : 0;
});

const accuracy = computed(() => {
  return gameSessionStore.questionCorrectAskCount / gameSessionStore.questionAskCount;
})

const averageMaxScore = computed(() => {
  const totalQuestions = Object.keys(gameSessionStore.questionAnswersCount).length; // 获取问题总数
  const totalMaxScores = Object.values(gameSessionStore.questionAnswersCount).reduce(
    (sum, questionData) => sum + questionData.score,
    0
  );

  // 计算平均分数
  return totalQuestions > 0 ? totalMaxScores / totalQuestions : 0;
});

scoreGrade.value = getInferenceScoreGrade(averageAttempts.value, averageMaxScore.value, accuracy.value);

console.log(averageMaxScore.value);
console.log(averageAttempts.value);
console.log(accuracy.value);

function getInferenceScoreGrade(averageAttempts, averageMaxScore, accuracy) {
  let score = 0;

  // 评分标准
  // 答题平均分：最高分数越高，表现越好
  if (averageMaxScore >= 8) {
    score += 30;
  } else if (averageMaxScore >= 6) {
    score += 20;
  } else {
    score += 10;
  }

  // 问答精准度：越高，分数越高
  if (accuracy >= 0.9) {
    score += 30;
  } else if (accuracy >= 0.8) {
    score += 20;
  } else {
    score += 10;
  }

  // 平均答题次数：合理的答题次数加分
  if (averageAttempts <= 3) {
    score += 20;  // 答题次数适中，表现较好
  } else if (averageAttempts <= 5) {
    score += 10;  // 答题次数偏多，表现一般
  } else {
    score += 5;   // 答题次数过多，表现较差
  }

  // 综合评定等级
  if (score >= 75) {
    return 'S'; // 优秀
  } else if (score >= 60) {
    return 'A'; // 良好
  } else if (score >= 45) {
    return 'B'; // 中等
  } else if (score >= 30) {
    return 'C'; // 及格
  } else if (score >= 15) {
    return 'D'; // 差
  } else {
    return 'E'; // 不及格
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