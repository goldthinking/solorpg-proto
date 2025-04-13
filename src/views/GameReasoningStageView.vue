<template>
  <div class="game-reasoning-stage-view">
    <h1>游戏-推理阶段</h1>
    
    <!-- 提示灯泡 -->
    <div class="hint-button" @click="showHint">
      <i class="fas fa-lightbulb"></i>
      <div class="hint-popup" v-show="showHintPopup">
        <div class="hint-content">
          <h3>提示</h3>
          <p>{{ currentHint }}</p>
          <button @click="closeHint">关闭</button>
        </div>
      </div>
    </div>

    <div class="dialogue-section">
      <!-- 对话框 -->
      <div class="chat-box">
        <div v-for="(message, index) in chatHistory" :key="index" class="chat-message" :class="message.type">
          <p v-html="message.content"></p>
        </div>
      </div>

      <!-- 玩家回答区域 -->
      <div class="player-response">
        <textarea v-model="playerAnswer" placeholder="请输入你的回答..."></textarea>
        <button @click="submitAnswer">发送</button>
      </div>
    </div>

    <!-- 线索库 -->
    <div class="clue-library" v-if="clues.length">
      <h3>线索库</h3>
      <ul>
        <li v-for="(clue, index) in clues" :key="index"><strong>{{ clue }}</strong></li>
      </ul>
    </div>

    <!-- 添加导航按钮 -->
    <div class="navigation-buttons" v-if="isChapterComplete">
      <button class="next-stage-btn" @click="goToSearchStage">
        进入搜查阶段
      </button>
    </div>
    <ToolBar />
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar.vue";
export default {
  name: 'GameReasoningStageView',
  components: {ToolBar},
  data() {
    return {
      questions: [
        "作为警方调查员，你认为这个雪夜里谁最有可能进入死者的房间？为什么？",
        "李小姐声称整晚都在房间，但王管家说看见她在走廊徘徊。请分析两人的证词，并说明谁更可信。",
        "林医生发现死者遗体上有一些特殊痕迹，你觉得这些痕迹说明了什么？"
      ],
      currentQuestionIndex: 0,
      playerAnswer: '',
      chatHistory: [],
      showHintPopup: false,
      isChapterComplete: false,
      answerAttempts: 0, // 记录当前问题的回答次数
      clues: [],
      hints: [
        "【答题要点】\n1. 分析雪地上的足迹情况\n2. 考虑各个嫌疑人的行动轨迹\n3. 提到雪夜和进出房间的时间线",
        "【答题要点】\n1. 分析李小姐和王管家的动机\n2. 结合两人的性格特点\n3. 提供支持你判断的具体理由",
        "【答题要点】\n1. 根据林医生的描述分析痕迹特征\n2. 推测可能的致伤工具\n3. 联系案发现场的其他线索"
      ]
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    },
    currentHint() {
      return this.hints[this.currentQuestionIndex] || "暂无提示";
    }
  },
  mounted() {
    // 初始显示第一个问题
    this.chatHistory.push({ type: 'ai', content: this.currentQuestion });
  },
  methods: {
    closeHint() {
      this.showHintPopup = false;
    },
    
    async submitAnswer() {
      if (!this.playerAnswer.trim()) {
        alert("回答不能为空！");
        return;
      }

      // 添加玩家回答到对话历史
      this.chatHistory.push({ type: 'player', content: this.playerAnswer });

      // 获取 AI 反馈
      const feedback = await this.getAiFeedback(this.playerAnswer);
      this.chatHistory.push({ type: 'ai', content: feedback.comment });

      // 提取线索并加入线索库
      if (feedback.clues && feedback.clues.length > 0) {
        feedback.clues.forEach((clue) => {
          if (!this.clues.includes(clue)) {
            this.clues.push(clue);
          }
        });
      }

      // 根据评分决定是否进入下一题
      if (feedback.score >= 70 || this.answerAttempts >= 2) {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.answerAttempts = 0;
          this.chatHistory.push({ type: 'ai', content: this.questions[this.currentQuestionIndex] });
        } else {
          this.isChapterComplete = true;
          this.chatHistory.push({ type: 'ai', content: "恭喜你完成了推理阶段！让我们继续下一步。" });
        }
      } else {
        this.answerAttempts++;
        this.chatHistory.push({ 
          type: 'ai', 
          content: "让我们再深入思考一下。你可以考虑：" + this.hints[this.currentQuestionIndex] 
        });
      }
      
      this.playerAnswer = '';
    },

    getAiFeedback(answer) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const score = this.evaluateAnswer(answer);
          let feedback = this.generateFeedback(score, answer);
          
          resolve({
            score: score,
            comment: feedback
          });
        }, 1000);
      });
    },

    evaluateAnswer(answer) {
      const scorePoints = {
        question0: ['足迹', '雪地', '时间', '行动'],
        question1: ['动机', '性格', '证词', '关系'],
        question2: ['痕迹', '工具', '现场', '证据']
      };
      
      const currentKeywords = scorePoints[`question${this.currentQuestionIndex}`];
      const foundKeywords = currentKeywords.filter(keyword => answer.includes(keyword));
      
      // 需要至少包含3个关键词才能通过
      return Math.min(foundKeywords.length * 25, 100);
    },

    generateFeedback(score, answer) {
      const keywords = this.extractKeywords(answer);
      let feedback = '<div class="feedback">';
      
      if (score >= 75) {
        feedback += `<p>分析很到位！你提到了<strong>${keywords.join('</strong>、<strong>')}</strong>这些重要线索。</p>
                    <p class="score-hint">✓ 已达到进入下一题的要求</p>`;
      } else {
        feedback += `<p>推理中提到了<strong>${keywords.join('</strong>、<strong>')}</strong>，但还需要：</p>
                    <p class="score-hint">✗ 至少需要提到3个关键要素才能进入下一题：${this.hints[this.currentQuestionIndex]}</p>`;
      }

      return feedback + '</div>';
    },

    extractKeywords(answer) {
      const keywords = ['动机', '性格', '行为', '关系', '证据'];
      return keywords.filter(keyword => answer.includes(keyword));
    },

    goToSearchStage() {
      this.$router.push('/game-search-stage');
    },
    showHint() {
      this.showHintPopup = !this.showHintPopup;
    }
  }
};
</script>

<style scoped>
/* 修改背景色为统一风格 */
.game-reasoning-stage-view {
  padding: 20px;
  background-color: var(--bg-secondary);
  min-height: 100vh;
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

/* 添加提示灯泡样式 */
.hint-button {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 100;
}

.hint-button i {
  font-size: 24px;
  color: #ffd700;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  transition: all 0.3s ease;
}

.hint-button:hover i {
  color: #ffed4a;
  transform: scale(1.1);
}

.hint-popup {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  width: 250px;
  z-index: 101;
}

.hint-content {
  text-align: left;
}

.hint-content h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 10px;
}

.hint-content p {
  margin: 10px 0;
  color: #666;
  line-height: 1.5;
}

.hint-content button {
  background-color: #ddd;
  color: #333;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.hint-content button:hover {
  background-color: #ccc;
}

.dialogue-section {
  margin-top: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.chat-box {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  background-color: #ffffff;
  margin-bottom: 20px;
}

.chat-message {
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}

.chat-message.player {
  background-color: #95ec69;
  color: #000000;
  margin-left: auto;
}

.chat-message.ai {
  background-color: #ffffff;
  color: #000000;
  margin-right: auto;
  border: 1px solid #e5e5e5;
}

.player-response {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  background-color: #ffffff;
}

button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.clue-library {
  max-width: 800px;
  margin: 20px auto;
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.clue-library h3 {
  margin-top: 0;
  color: #333;
}

.clue-library ul {
  list-style: none;
  padding: 0;
}

.clue-library li {
  margin-bottom: 8px;
  color: #495057;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.navigation-buttons {
  margin-top: 20px;
  text-align: center;
}

.next-stage-btn {
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.next-stage-btn:hover {
  background-color: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.feedback {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 5px;
  line-height: 1.5;
}

.feedback strong {
  color: #007bff;
  font-weight: 600;
}

.score-hint {
  margin-top: 10px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #666;
}

.score-hint strong {
  color: #28a745;
}
</style>