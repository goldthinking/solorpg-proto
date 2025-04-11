<template>
  <div class="game-reasoning-stage-view">
    <h1>游戏-推理阶段</h1>
    <div class="dialogue-section">
      <!-- 对话框 -->
      <div class="chat-box">
        <!-- 显示对话历史 -->
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
  </div>
</template>

<script>
export default {
  name: 'GameReasoningStageView',
  data() {
    return {
      questions: [
        "你觉得角色A为什么会做出这样的决定？",
        "角色B的行为是否符合他的性格？",
        "你能预测接下来的剧情发展吗？"
      ],
      currentQuestionIndex: 0,
      playerAnswer: '',
      chatHistory: [],
      clues: [],
      isChapterComplete: false
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    }
  },
  mounted() {
    // 初始显示第一个问题
    this.chatHistory.push({ type: 'ai', content: this.currentQuestion });
  },
  methods: {
    async submitAnswer() {
      if (!this.playerAnswer.trim()) {
        alert("回答不能为空！");
        return;
      }

      // 添加玩家回答到对话历史
      this.chatHistory.push({ type: 'player', content: this.playerAnswer });

      // 获取 AI 反馈
      const feedback = await this.getAiFeedback(this.playerAnswer);

      // 添加 AI 反馈到对话历史
      this.chatHistory.push({ type: 'ai', content: feedback.comment });

      // 提取线索并加入线索库
      if (feedback.clues && feedback.clues.length > 0) {
        feedback.clues.forEach((clue) => {
          if (!this.clues.includes(clue)) {
            this.clues.push(clue);
          }
        });
      }

      // 准备下一个问题
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.chatHistory.push({ type: 'ai', content: this.currentQuestion });
        this.playerAnswer = '';
      } else {
        this.chatHistory.push({ type: 'ai', content: "推理阶段完成！可以进入搜查阶段了。" });
        this.isChapterComplete = true; // 显示下一阶段按钮
        this.playerAnswer = '';
      }
    },

    getAiFeedback(answer) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const clues = this.extractClues(answer);
          const score = Math.floor(Math.random() * 100);
          
          let analysis = "";
          if (score >= 80) {
            analysis = "你的推理非常准确，抓住了关键点。";
          } else if (score >= 60) {
            analysis = "推理基本合理，但还可以更深入。";
          } else {
            analysis = "推理方向需要调整，建议重新思考。";
          }

          resolve({
            score: score,
            comment: `
              <div class="feedback">
                <p>评分：<strong>${score}</strong></p>
                <p>${analysis}</p>
                <p>发现的线索：<strong>${clues.join('、')}</strong></p>
              </div>
            `,
            clues: clues
          });
        }, 1000);
      });
    },

    extractClues(answer) {
      const keywords = ['角色A', '角色B', '动机', '行为', '剧情'];
      return keywords.filter((keyword) => answer.includes(keyword));
    },

    goToSearchStage() {
      this.$router.push('/game-search-stage');
    }
  }
};
</script>

<style scoped>
.game-reasoning-stage-view {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
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
  padding: 10px;
  border-radius: 4px;
  margin-top: 5px;
}
</style>