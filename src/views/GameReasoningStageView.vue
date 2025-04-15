<template>
  <div class="game-reasoning-stage-view">
    <ToolBar :toolTypes="toolTypes" />
    <StageHeader stageName="推理阶段" />
    
    <div class="dialogue-section">
      <div class="comm-device">
        <div class="device-header">
          <div class="status-bar">
            <span class="connection">已连接 - 特别调查局通讯网络</span>
            <span class="encryption">加密通讯中...</span>
          </div>
        </div>
        
        <div class="chat-box">
          <div v-for="(message, index) in chatHistory" 
               :key="index" 
               class="chat-message" 
               :class="message.type">
            <template v-if="message.type === 'ai'">
              <div class="avatar">
                <img src="/images/avatar-c.png" alt="C君">
                <span class="name">C君</span>
              </div>
              <div class="message-content">
                <p v-html="message.content"></p>
              </div>
            </template>
            <template v-else>
              <div class="message-content">
                <p v-html="message.content"></p>
              </div>
              <div class="avatar">
                <img src="/images/avatar-d.jpg" alt="D调查员">
                <span class="name">D调查员</span>
              </div>
            </template>
          </div>
        </div>

        <div class="player-response">
          <textarea v-model="playerAnswer" 
                    placeholder="输入调查报告内容..." 
                    @keyup.ctrl.enter="submitAnswer">
          </textarea>
          <button @click="submitAnswer">
            <i class="fas fa-paper-plane"></i>
            发送报告
          </button>
        </div>
      </div>

      <!-- 阶段转换按钮 -->
      <div class="phase-buttons">
        <button v-if="gamePhase === 'search'" 
                @click="startReasoning" 
                class="phase-btn">
          没什么疑问了，进行现阶段线索归档吧
        </button>
        <button v-if="gamePhase === 'reasoning'" 
                @click="backToSearch" 
                :disabled="remainingQuestions === 0"
                class="phase-btn">
          我还有一些疑惑，你帮我搜一下
        </button>
      </div>
    </div>

    <!-- 线索库 -->
    <div class="clue-library" v-if="clues.length">
      <h3>线索库</h3>
      <ul>
        <li v-for="(clue, index) in clues" :key="index">
          <strong>{{ clue }}</strong>
        </li>
      </ul>
    </div>

    <!-- 揭秘按钮 -->
    <button v-if="canProceedToReveal" 
            class="next-stage-btn" 
            @click="goToRevealStage">
      推理完成，开始揭秘
    </button>
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar.vue";
import StageHeader from "@/components/StageHeader.vue";

export default {
  name: 'GameReasoningStageView',
  components: {
    ToolBar,
    StageHeader
  },
  data() {
    return {
      gamePhase: 'search',
      remainingQuestions: 5,
      currentReasoningIndex: 0,
      toolTypes: ['script', 'clue', 'character', 'note'],
      chatHistory: [],
      playerAnswer: '',
      clues: [],
      reasoningQuestions: [
        "作为警方调查员，你认为这个雪夜里谁最有可能进入死者的房间？为什么？",
        "李小姐声称整晚都在房间，但王管家说看见她在走廊徘徊。请分析两人的证词，并说明谁更可信。",
        "林医生发现死者遗体上有一些特殊痕迹，你觉得这些痕迹说明了什么？"
      ],
      scorePoints: {
        question0: ['足迹', '雪地', '时间', '行动'],
        question1: ['动机', '性格', '证词', '关系'],
        question2: ['痕迹', '工具', '现场', '证据']
      }
    }
  },
  
  computed: {
    canProceedToReveal() {
      return this.gamePhase === 'reasoning' && 
             this.currentReasoningIndex >= this.reasoningQuestions.length - 1;
    }
  },

  methods: {
    async submitAnswer() {
      if (!this.playerAnswer.trim()) return;

      // 添加玩家回答到对话历史
      this.chatHistory.push({ 
        type: 'player', 
        content: this.playerAnswer 
      });

      if (this.gamePhase === 'search') {
        await this.handleSearchPhase();
      } else {
        await this.handleReasoningPhase();
      }
      
      this.playerAnswer = '';
    },

    async handleSearchPhase() {
      if (this.remainingQuestions > 0) {
        const response = this.getSearchResponse(this.playerAnswer);
        this.chatHistory.push({
          type: 'ai',
          content: response
        });
        this.remainingQuestions--;
      }
    },

    async handleReasoningPhase() {
      const score = this.evaluateAnswer(this.playerAnswer);
      const feedback = this.generateFeedback(score);
      
      this.chatHistory.push({
        type: 'ai',
        content: feedback
      });

      if (score >= 75 && this.currentReasoningIndex < this.reasoningQuestions.length - 1) {
        this.currentReasoningIndex++;
        setTimeout(() => {
          this.chatHistory.push({
            type: 'ai',
            content: this.reasoningQuestions[this.currentReasoningIndex]
          });
        }, 1000);
      }
    },

    startReasoning() {
      this.gamePhase = 'reasoning';
      this.chatHistory.push({
        type: 'ai',
        content: this.reasoningQuestions[0]
      });
    },

    backToSearch() {
      if (this.remainingQuestions > 0) {
        this.gamePhase = 'search';
        this.chatHistory.push({
          type: 'ai',
          content: `还可以问${this.remainingQuestions}个问题，你想知道什么？`
        });
      }
    },

    getSearchResponse(question) {
      const responses = ['是', '否', '与此无关'];
      return responses[Math.floor(Math.random() * responses.length)];
    },

    evaluateAnswer(answer) {
      const currentKeywords = this.scorePoints[`question${this.currentReasoningIndex}`];
      const foundKeywords = currentKeywords.filter(keyword => answer.includes(keyword));
      return Math.min(foundKeywords.length * 25, 100);
    },

    generateFeedback(score) {
      if (score >= 75) {
        return `
          <div class="feedback">
            <p>分析很到位！你的推理非常有说服力。</p>
            <p class="score-hint">✓ 已达到进入下一题的要求</p>
          </div>
        `;
      }
      return `
        <div class="feedback">
          <p>推理还需要更多细节支持。</p>
          <p class="score-hint">✗ 请考虑更多关键要素</p>
        </div>
      `;
    },

    goToRevealStage() {
      this.$router.push({ name: 'game-reveal-stage' });
    }
  },

  mounted() {
    this.chatHistory.push({ 
      type: 'ai', 
      content: 'D sir，我给管档案的Adam上供了5瓶胡椒博士，他答应我们可以查5个问题，你有什么要搜的吗？' 
    });
  }
}
</script>

<style scoped>
.game-reasoning-stage-view {
  padding: 20px;
  padding-top: calc(20px + var(--stage-header-height));
  background-color: var(--bg-secondary);
  min-height: 100vh;
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.comm-device {
  background: linear-gradient(180deg, #1a1f35 0%, #2a2f45 100%);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 30px rgba(0, 150, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.device-header {
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  color: #00d0ff;
  font-size: 12px;
  font-family: 'Monaco', monospace;
}

.connection::before {
  content: "●";
  color: #00ff88;
  margin-right: 5px;
}

.encryption {
  animation: blink 1.5s infinite;
}

.chat-box {
  max-height: 400px;
  overflow-y: auto;
  padding: 15px;
  margin-bottom: 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 150, 255, 0.5) transparent;
}

.chat-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 12px;
}

.chat-message.player {
  flex-direction: row-reverse;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #00d0ff;
  box-shadow: 0 0 10px rgba(0, 208, 255, 0.3);
}

.avatar .name {
  font-size: 12px;
  color: #00d0ff;
  margin-top: 4px;
}

.message-content {
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 10px;
  padding: 12px;
  color: #fff;
  max-width: 70%;
}

.chat-message.player .message-content {
  background: rgba(0, 255, 150, 0.1);
  border-color: rgba(0, 255, 150, 0.2);
}

.player-response {
  background: rgba(0, 150, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
}

textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  color: #fff;
  border-radius: 8px;
  padding: 12px;
  resize: vertical;
  font-family: 'Monaco', monospace;
}

textarea:focus {
  outline: none;
  border-color: #00d0ff;
  box-shadow: 0 0 10px rgba(0, 208, 255, 0.2);
}

button {
  background: linear-gradient(90deg, #0066ff 0%, #00d0ff 100%);
  border: none;
  padding: 12px 24px;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
}

.phase-buttons {
  position: sticky;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  background: rgba(26, 31, 53, 0.8);
  backdrop-filter: blur(10px);
}

.next-stage-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.feedback {
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  line-height: 1.5;
}

.score-hint {
  margin-top: 8px;
  font-style: italic;
  color: #aaa;
}
</style>