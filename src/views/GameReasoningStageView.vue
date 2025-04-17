<template>
  <div class="game-reasoning-stage-view">
    <ToolBar :toolTypes="toolTypes" />
    <StageHeader stageName="推理阶段" />
    
    <div class="dialogue-section">
      <div class="comm-device">
        <!-- 对话内容始终显示 -->
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
            <!-- AI消息模板 -->
            <template v-if="message.type === 'ai'">
              <div class="avatar ai-avatar">
                <img src="/images/avatar-c.png" alt="C君">
                <span class="name">助手</span>
              </div>
              <div class="message-content ai-message">
                <p v-html="message.content"></p>
              </div>
            </template>
            <!-- 玩家消息模板 -->
            <template v-else>
              <div class="message-content player-message">
                <p v-html="message.content"></p>
              </div>
              <div class="avatar player-avatar">
                <img src="/images/avatar-d.jpg" alt="D调查员">
                <span class="name">调查员D</span>
              </div>
            </template>
          </div>
        </div>

        <!-- 初始选择按钮只在开始时显示 -->
        <div v-if="!gameStarted" class="initial-buttons">
          <button @click="startInitialReasoning" class="phase-btn">
            开始线索归档
          </button>
          <button @click="startInitialSearch" class="phase-btn">
            案件疑问探查
          </button>
        </div>

        <!-- 其他部分只在游戏开始后显示 -->
        <div v-else>
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
      </div>
    </div>

    <!-- 阶段转换按钮 -->
    <div v-if="gameStarted" class="phase-buttons">
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
    <div class="reveal-button-container" v-if="canProceedToReveal">
      <button class="next-stage-btn" @click="goToRevealStage">
        查看完整案情
      </button>
    </div>
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
      gameStarted: false,
      gamePhase: 'init',
      remainingQuestions: 5,
      currentReasoningIndex: 0,
      toolTypes: ['script', 'clue', 'character', 'note'],
      chatHistory: [],
      playerAnswer: '',
      clues: [],
      dialogueFlow: {
        initial: {
          content: "对这个案件有头绪了吗，那我们进行线索归档吧！如果还有任何疑惑，我可以偷偷贿赂Adam查一查哦？"
        },
        searchPhase: {
          opening: "D sir，我给管档案的Adam上供了5瓶胡椒博士，他松口说我们可以查5个问题，你有什么要搜的吗？",
          outOfQuestions: "不行不行，Adam黑脸了，我先溜了^^",
          responses: {
            isOut: "是！完全被你看穿了！",
            notSuicide: "否。D sir再仔细想想吧！",
            irrelevant: "欸？好像与此无关吧……"
          },
          // 添加示例对话
          examples: [
            {
              question: "李小姐昨天夜里不在房间里吧？",
              answer: "是！完全被你看穿了！",
              type: "isOut"
            },
            {
              question: "助手喜欢喝胡椒博士吗？",
              answer: "欸？好像与此无关吧……",
              type: "irrelevant"
            },
            {
              question: "死者是自杀吗？",
              answer: "否。D sir再仔细想想吧！",
              type: "notSuicide"
            }
          ]
        },
        reasoningPhase: {
          opening: "让我们开始线索归档吧！我会根据你的分析记录重要线索。",
          examples: [
            {
              question: "这个雪夜里谁最有可能进入死者的房间？为什么？",
              wrongAnswer: "李小姐吧。她说谎了，明明在晚上出过门。",
              correctAnswer: "分析足迹和时间线，应该是管家。雪地上有新鲜足迹通向死者房间，而且根据时间线管家是最后见到死者的人。",
              response: "这个推理很有道理！【记录中.jpg】根据足迹和时间线确实能得出这个结论。",
              keywords: ['足迹', '雪地', '时间', '行动']
            },
            {
              question: "李小姐和王管家的证词冲突，谁更可信？",
              playerAnswer: "王管家的说法更可信。因为李小姐与死者有经济纠纷且性格冲动，而王管家是老员工，性格稳重没有作案动机。",
              response: "没错！分析人物关系和动机很重要。",
              keywords: ['动机', '性格', '证词', '关系']
            },
            {
              question: "法医发现的痕迹说明了什么？",
              playerAnswer: "死者遗体上的勒痕和现场工具痕迹显示是用细绳作案，而且在死者脖子上还发现了特殊纤维残留。",
              response: "完全正确！看来D sir已经完全理清了案情。准备好查看完整案情了吗？",
              keywords: ['痕迹', '工具', '现场', '证据']
            }
          ],
          completion: "这种难度的案子对D sir简直是信手拈来嘛，线索都归档完毕了，我们来看看完整案情吧~"
        }
      }
    }
  },
  
  computed: {
    canProceedToReveal() {
      return this.gamePhase === 'reasoning' && 
             this.currentReasoningIndex >= this.dialogueFlow.reasoningPhase.examples.length;
    }
  },

  methods: {
    startInitialReasoning() {
      this.gameStarted = true;
      this.gamePhase = 'reasoning';
      this.startReasoning();
    },

    startInitialSearch() {
      this.gameStarted = true;
      this.gamePhase = 'search';
      
      // 显示开场白
      this.chatHistory.push({
        type: 'ai',
        content: this.dialogueFlow.searchPhase.opening
      });
      
      // 添加一个短暂延迟后显示示例对话
      setTimeout(() => {
        // 为每个示例创建一问一答的对话
        this.dialogueFlow.searchPhase.examples.forEach((example, index) => {
          setTimeout(() => {
            // 添加问题
            this.chatHistory.push({
              type: 'player',
              content: example.question
            });
            
            // 添加回答
            setTimeout(() => {
              this.chatHistory.push({
                type: 'ai',
                content: example.answer
              });
            }, 500);
          }, index * 1500); // 每组对话间隔1.5秒
        });
      }, 1000);
    },

    async submitAnswer() {
      if (!this.playerAnswer.trim()) return;

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
      
      // 自动滚动到底部
      this.$nextTick(() => {
        const chatBox = document.querySelector('.chat-box');
        chatBox.scrollTop = chatBox.scrollHeight;
      });
    },

    async handleSearchPhase() {
      if (this.remainingQuestions > 0) {
        const response = this.getSearchResponse(this.playerAnswer);
        this.chatHistory.push({
          type: 'ai',
          content: response
        });
        this.remainingQuestions--;
      } else {
        this.chatHistory.push({
          type: 'ai',
          content: this.dialogueFlow.searchPhase.outOfQuestions
        });
      }
    },

    async handleReasoningPhase() {
      const currentQuestion = this.dialogueFlow.reasoningPhase.examples[this.currentReasoningIndex];
      
      // 如果是第一题的错误答案
      if (this.currentReasoningIndex === 0 && 
          this.playerAnswer.includes("李小姐")) {
        this.chatHistory.push({
          type: 'ai',
          content: currentQuestion.wrongAnswer
        });
        return;
      }
      
      const score = this.evaluateAnswer(this.playerAnswer, currentQuestion.keywords);
      if (score >= 75) {
        this.chatHistory.push({
          type: 'ai',
          content: currentQuestion.response
        });
        
        if (this.currentReasoningIndex < 2) {
          this.currentReasoningIndex++;
          setTimeout(() => {
            this.chatHistory.push({
              type: 'ai',
              content: this.dialogueFlow.reasoningPhase.examples[this.currentReasoningIndex].question
            });
          }, 1000);
        } else {
          this.chatHistory.push({
            type: 'ai',
            content: this.dialogueFlow.reasoningPhase.completion
          });
        }
      } else {
        this.chatHistory.push({
          type: 'ai',
          content: "请再仔细思考一下~"
        });
      }
    },

    startReasoning() {
      this.gamePhase = 'reasoning';
      this.chatHistory.push({
        type: 'ai',
        content: this.dialogueFlow.reasoningPhase.opening
      });
      
      // 添加示例对话
      setTimeout(() => {
        this.dialogueFlow.reasoningPhase.examples.forEach((example, index) => {
          setTimeout(() => {
            // 显示问题
            this.chatHistory.push({
              type: 'ai',
              content: example.question
            });
            
            // 显示玩家示例回答
            setTimeout(() => {
              this.chatHistory.push({
                type: 'player',
                content: example.playerAnswer || example.correctAnswer
              });
              
              // 显示助手回应
              setTimeout(() => {
                this.chatHistory.push({
                  type: 'ai',
                  content: example.response
                });
              }, 800);
            }, 800);
          }, index * 2500); // 每组对话间隔2.5秒
        });
        
        // 最后显示完成提示并更新索引
        setTimeout(() => {
          this.chatHistory.push({
            type: 'ai',
            content: this.dialogueFlow.reasoningPhase.completion
          });
          this.currentReasoningIndex = this.dialogueFlow.reasoningPhase.examples.length;
        }, this.dialogueFlow.reasoningPhase.examples.length * 2500);
      }, 1000);
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
      if (question.includes("李小姐") && question.includes("房间")) {
        return this.dialogueFlow.searchPhase.responses.isOut;
      }
      if (question.includes("自杀")) {
        return this.dialogueFlow.searchPhase.responses.notSuicide;
      }
      return this.dialogueFlow.searchPhase.responses.irrelevant;
    },

    evaluateAnswer(answer, keywords) {
      const foundKeywords = keywords.filter(keyword => answer.includes(keyword));
      return Math.min(foundKeywords.length * 25, 100);
    },

    goToRevealStage() {
      this.$router.push({ name: 'game-reveal-stage' });
    }
  },

  mounted() {
    // 初始化时只显示开场白
    this.chatHistory.push({ 
      type: 'ai', 
      content: this.dialogueFlow.initial.content
    });
    
    // 其他状态保持为初始值
    this.gameStarted = false;
    this.gamePhase = 'init';
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

/* 聊天框基础样式 */
.chat-box {
  max-height: 400px;
  overflow-y: auto;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

/* 消息容器样式 */
.chat-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 12px;
  max-width: 80%;  /* 控制消息最大宽度 */
}

/* 玩家消息样式 */
.chat-message.player {
  flex-direction: row;  /* 改回正向布局 */
  justify-content: flex-end;  /* 靠右对齐 */
  margin-left: auto;    /* 让整体靠右 */
  width: 85%;          /* 控制整体宽度 */
}

/* AI消息样式 */
.chat-message.ai {
  padding-right: 20%;
  width: 85%;                /* 控制整体宽度 */
  align-self: flex-start;  /* 靠左对齐 */
}

/* 头像样式 */
.avatar {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;  /* 固定头像容器宽度 */
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #00d0ff;
  box-shadow: 0 0 10px rgba(0, 208, 255, 0.3);
  object-fit: cover;
}

.avatar .name {
  font-size: 12px;
  color: #00d0ff;
  margin-top: 4px;
}

/* 消息气泡样式 */
.message-content {
  padding: 12px;
  border-radius: 10px;
  color: #fff;
  max-width: calc(100% - 80px);  /* 减去头像和间距的宽度 */
  word-break: break-word;
}

/* AI消息气泡 */
.ai-message {
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 0 10px 10px 10px;
  margin-left: 12px;
}

/* 玩家消息气泡 */
.player-message {
  background: rgba(0, 255, 150, 0.1);
  border: 1px solid rgba(0, 255, 150, 0.2);
  border-radius: 10px 0 10px 10px;
  margin-right: 0;  /* 移除右侧间距 */
  order: 1;        /* 确保消息在左边 */
}

/* 玩家头像样式 */
.chat-message.player .avatar {
  order: 2;        /* 确保头像在右边 */
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
  position: relative;  /* 改为相对定位 */
  display: block;     /* 块级元素 */
  margin: 30px auto;  /* 上下间距30px，左右自动居中 */
  background: linear-gradient(90deg, #00ff88 0%, #00d0ff 100%);
  border: none;
  padding: 15px 40px;    /* 增加左右内边距 */
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;     /* 加粗文字 */
  animation: fadeIn 0.5s ease-in-out;
  box-shadow: 0 4px 15px rgba(0, 208, 255, 0.3);
  min-width: 200px;      /* 设置最小宽度 */
  text-align: center;    /* 文字居中 */
}

.next-stage-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 208, 255, 0.4);
  background: linear-gradient(90deg, #00ff99 0%, #00e5ff 100%); /* 微调悬浮时的渐变色 */
}

/* 添加一个新的容器来包裹按钮 */
.reveal-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  margin-top: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.initial-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  padding: 20px;
  background: rgba(0, 150, 255, 0.05);
  border-radius: 10px;
}

.phase-btn,
.initial-buttons .phase-btn {
  background: linear-gradient(90deg, #0066ff 0%, #00d0ff 100%);
  border: none;
  padding: 15px 30px;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  min-width: 200px;
  text-align: center;
  display: inline-block;
  transition: all 0.3s ease;
}

.phase-btn:hover,
.initial-buttons .phase-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 208, 255, 0.3);
}

.phase-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-box::-webkit-scrollbar {
  width: 6px;
}

.chat-box::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.chat-box::-webkit-scrollbar-thumb {
  background: rgba(0, 150, 255, 0.5);
  border-radius: 3px;
}

.message-content {
  max-width: 70%;
  word-break: break-word;
}

.chat-message {
  margin-bottom: 20px;
  gap: 12px;
}

/* 消息容器样式 */
.chat-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 12px;
  width: 100%;
}

/* 玩家消息样式 */
.chat-message.player {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-left: auto;
  gap: 12px;
  width: 85%;                 /* 控制整体宽度 */
}

/* AI消息样式 */
.chat-message.ai {
  padding-right: 20%;
  width: 85%;                /* 控制整体宽度 */
}

/* 头像样式 */
.avatar {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
}

/* 消息内容样式 */
.message-content {
  padding: 12px;
  border-radius: 10px;
  color: #fff;
  max-width: 70%;
  word-break: break-word;
}

/* 玩家消息气泡样式 */
.chat-message.player .message-content {
  background: rgba(0, 255, 150, 0.1);
  border: 1px solid rgba(0, 255, 150, 0.2);
  border-radius: 10px 0 10px 10px;
  margin-right: 0;  /* 移除右侧间距 */
  order: 1;        /* 确保消息在左边 */
}

/* AI消息气泡样式 */
.chat-message.ai .message-content {
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 0 10px 10px 10px;
  margin-left: 12px;  /* 添加左侧间距 */
}

.phase-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 208, 255, 0.3);
}
</style>