<template>
  <div class="game-reasoning-stage-view">
    <ToolBar :toolTypes="toolTypes" />
    <StageHeader stageName="推理阶段" />

    <div class="dialogue-section">
      <div class="comm-device">
        <!-- 保持设备头部不变 -->
        <div class="device-header">
          <div class="status-bar">
            <span class="connection">已连接 - 特别调查局通讯网络</span>
            <span class="encryption">加密通讯中...</span>
          </div>
        </div>

        <div class="chat-box">
          <div
            v-for="(message, index) in chatHistory"
            :key="index"
            class="message"
            :class="message.type"
          >
            <!-- AI消息模板 -->
            <template v-if="message.type === 'ai'">
              <div class="avatar">
                <img src="/images/avatar-c.png" alt="C君" />
                <span class="name">助手</span>
              </div>
              <div class="message-content">
                <p v-html="message.content"></p>
              </div>
            </template>
            <!-- 玩家消息模板 -->
            <template v-else>
              <div class="message-content player-message">
                <p v-html="message.content"></p>
              </div>
              <div class="avatar player-avatar">
                <img src="/images/avatar-d.jpg" alt="D调查员" />
                <span class="name">调查员D</span>
              </div>
            </template>
          </div>

          <!-- 流式输出的AI回答 -->
          <div class="message ai" v-if="loadingAnswer">
            <div class="avatar">
              <img src="/images/avatar-c.png" alt="C君" />
              <span class="name">助手</span>
            </div>
            <div class="message-content">
              <p>{{ streamingAnswer }}</p>
              <!-- 实时更新的流式内容 -->
            </div>
          </div>
        </div>

        <!-- 初始选择按钮 -->
        <div v-if="!gameStarted" class="initial-buttons">
          <button @click="startInitialReasoning" class="phase-btn">
            开始线索归档
          </button>
          <button @click="startInitialSearch" class="phase-btn">
            案件疑问探查
          </button>
        </div>

        <!-- 游戏开始后的输入区域 -->
        <div v-else>
          <div class="player-response">
            <textarea
              v-model="playerAnswer"
              placeholder="输入调查报告内容..."
              @keyup.ctrl.enter="submitAnswer"
            >
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
    <div v-if="gameStarted && !allvisted" class="phase-buttons">
      <button
        v-if="gamePhase === 'search'"
        @click="startReasoning"
        class="phase-btn"
      >
        没什么疑问了，进行现阶段线索归档吧
      </button>
      <button
        v-if="gamePhase === 'reasoning' && !hasQuestion"
        @click="startInitialSearch"
        :disabled="remainingQuestions === 0"
        class="phase-btn"
      >
        我还有一些疑惑，你帮我搜一下
      </button>
    </div>

    <!-- 查看完整案情按钮 -->
    <button v-if="allvisted" class="next-stage-btn" @click="goToNextStage">
      进入下一阶段
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useScriptDataStore } from "@/stores/scriptDataStore"; // 引入Pinia Store
import { useGameSessionStore } from "@/stores/gameSessionStore";
import ToolBar from "@/components/ToolBar.vue";
import StageHeader from "@/components/StageHeader.vue";
import { fetchStreamingAnswer } from "@/api/question"; // 导入流式请求的函数

// 获取 Pinia store 中的 scriptData
const scriptDataStore = useScriptDataStore();
const scriptData = scriptDataStore.scriptData; // 获取完整的 scriptData
const totalChapters = computed(() => scriptData?.chapters?.length || 0);

// 获取当前路由参数
const route = useRoute();
const router = useRouter();
const visitedPhases = ref({
  search: false,
  reasoning: false,
});

const allvisted = ref(false);

// 获取章节ID（从路由参数获取 chapterId）
const chapterId = parseInt(route.params.chapterIndex);

// 通过章节ID从 scriptData 中解析出对应的章节数据
const scriptChapter = computed(() => {
  return scriptData?.chapters[chapterId] || {};
});

// 获取该章节的 questions
const questions = computed(() => scriptChapter.value?.questions || []);

// 当前角色，AI助手的角色信息
const currentCharacter = ref({
  name: "助手",
  avatar: "/images/avatar-c.png",
});

// 初始化游戏的状态
const gameStarted = ref(false);
const gamePhase = ref("init");
const remainingQuestions = ref(5);
const currentReasoningIndex = ref(0);
const toolTypes = ref(["script", "clue", "note"]);
const chatHistory = ref([]);
const playerAnswer = ref("");
const showChDialog = ref(false);

// 用户输入的问题
const playerQuestion = ref("");

// AI 流式输出
const streamingAnswer = ref("");
const loadingAnswer = ref(false);
const hasQuestion = ref(true);

const gameSessionStore = useGameSessionStore();

// 启动初始推理
const startInitialReasoning = () => {
  gameStarted.value = true;
  gamePhase.value = "reasoning";
  visitedPhases.value.reasoning = true;
  if (visitedPhases.value.search === true) {
    allvisted.value = true;
  }
  startReasoning();
};

// 启动初始案件疑问探查
const startInitialSearch = () => {
  gameStarted.value = true;
  gamePhase.value = "search";
  visitedPhases.value.search = true;
  if (visitedPhases.value.reasoning === true) {
    allvisted.value = true;
  }
  chatHistory.value.push({
    type: "ai",
    content:
      "D sir，我给管档案的Adam上供了5瓶胡椒博士，他松口说我们可以查5个问题，你有什么要搜的吗？",
  });
};

const submitAnswer = async () => {
  if (!playerAnswer.value.trim()) return;

  // 1. 推送用户的消息到聊天记录
  chatHistory.value.push({
    type: "player",
    content: playerAnswer.value,
  });

  // 2. 根据当前游戏阶段决定不同的逻辑
  let promptPayload = {};

  if (gamePhase.value === "reasoning") {
    // 推理阶段：将玩家的回答封装到 `prompt` 中，发送给大模型
    promptPayload = {
      prompt: 3, // 推理阶段的prompt
      scripts: JSON.stringify(scriptData?.chapters[chapterId] || []),
      truth: scriptData?.chapters[chapterId].truth || "",
      question:
        scriptData?.chapters[chapterId]?.questions[currentReasoningIndex.value]
          ?.question, // 获取当前问题
      referenceAnswer:
        scriptData?.chapters[chapterId]?.questions[currentReasoningIndex.value]
          ?.referenceAnswer, // 获取参考答案
      answer: playerAnswer.value, // 玩家输入的答案
    };
  } else if (gamePhase.value === "search") {
    if (remainingQuestions.value <= 0) {
      chatHistory.value.push({
        type: "ai",
        content: "不行不行，Adam黑脸了，我先溜了^^",
      });
      return;
    }
    // 搜索阶段：将用户提出的问题发送给大模型
    promptPayload = {
      prompt: 2, // 搜索阶段的prompt
      truth: scriptData.reveal.content || "",
      question: playerAnswer.value, // 用户提出的问题
    };
    remainingQuestions.value--;
  }

  streamingAnswer.value = "";
  loadingAnswer.value = true;

  try {
    // 3. 调用流式API，将 `prompt` 和其他数据发送给大模型
    const score = ref(0);
    await fetchStreamingAnswer(
      promptPayload,
      (chunk) => {
        streamingAnswer.value += chunk;
      },
      (finalResult) => {
        // 4. AI 返回的完整回答，推送到聊天记录
        chatHistory.value.push({ type: "ai", content: finalResult });
        if (gamePhase.value === "reasoning"){
          const scoreMatch = finalResult.match(/\d+/);
          score.value = parseInt(scoreMatch[0], 10); // 获取分数
        } else {
          gameSessionStore.incrementQuestionAskCount();
          if (finalResult.includes("正确")) {
            // 如果包含 "正确"，增加正确提问次数
            gameSessionStore.incrementQuestionCorrectAskCount();
          }
        }
      }
    );

    // 5. 如果当前是推理阶段，则检查是否有下一个问题，若有则提问
    if (gamePhase.value === "reasoning") {
      gameSessionStore.incrementPlayerAnswerCount(scriptData?.chapters[chapterId]?.questions[currentReasoningIndex.value]?.question, score.value);
      console.log(gameSessionStore);
      if (score.value >= 7) {
        // 如果分数 >= 7，进入下一个问题
        setTimeout(() => {
          if (currentReasoningIndex.value < questions.value.length - 1) {
            currentReasoningIndex.value++; // 更新索引，指向下一个问题
            askQuestion(); // 提问下一个问题
          } else {
            hasQuestion.value = false;
          }
        }, 1000); // 延迟 1 秒后提问下一个问题
      } else {
        // 如果分数 < 7，不提问下一个问题
        chatHistory.value.push({
          type: "ai",
          content: "请再仔细思考一下~", // AI 提示玩家重新思考
        });
      }
    }
  } catch (err) {
    console.error("流式AI出错:", err);
  } finally {
    loadingAnswer.value = false;
    playerAnswer.value = ""; // 清空玩家输入框
    nextTick(() => {
      const chatBox = document.querySelector(".chat-box");
      chatBox.scrollTop = chatBox.scrollHeight; // 自动滚动到底部
    });
  }
};

// 提问下一个问题
const askQuestion = () => {
  const currentQuestion = questions.value[currentReasoningIndex.value];
  chatHistory.value.push({
    type: "ai",
    content: currentQuestion.question,
  });
};

// 处理搜索阶段
const handleSearchPhase = async () => {
  if (remainingQuestions.value > 0) {
    const response = getSearchResponse(playerAnswer.value);
    chatHistory.value.push({ type: "ai", content: response });
    remainingQuestions.value--;
  } else {
    chatHistory.value.push({ type: "ai", content: "没有更多问题可以提问了。" });
  }
};

// 获取搜索回答
const getSearchResponse = (question) => {
  return "AI助手给出搜索阶段的答案。";
};

// 跳转到显示完整案情阶段
const goToRevealStage = () => {
  router.push("/game-reveal-stage");
};

const goToNextStage = () => {
  // 检查是否已经是最后一章
  if (chapterId >= totalChapters.value - 1) {
    goToRevealStage(); // 跳转到真相揭示页面
  } else {
    router.push("/game-search-stage/" + (chapterId + 1)); // 跳转到下一章
  }
};
// 定义 startReasoning 方法
const startReasoning = () => {
  gamePhase.value = "reasoning";
  if (visitedPhases.value.search === true) {
    allvisted.value = true;
  }
  chatHistory.value.push({
    type: "ai",
    content: "开始推理阶段，现在请回答以下问题：",
  });

  // 提问第一个问题
  setTimeout(() => {
    askQuestion();
  }, 10);
};

// 初始化
onMounted(() => {
  chatHistory.value.push({
    type: "ai",
    content: "案件初始化中，准备进行调查。",
  });
  gameStarted.value = false;
  gamePhase.value = "init";
});
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
  font-family: "Monaco", monospace;
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
  padding: 6px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

/* 消息容器样式 */
.message {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  align-items: flex-start;
  gap: 12px;
}

/* AI消息保持左对齐 */
.message.ai {
  justify-content: flex-start;
}

/* 玩家消息右对齐 */
.message.player {
  justify-content: flex-end;
}

/* 玩家消息样式 */
.chat-message.player {
  flex-direction: row-reverse;
  justify-content: flex-end; /* 靠右对齐 */
}

/* 头像样式 */
.avatar {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48px; /* 固定头像容器宽度 */
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
  max-width: calc(100% - 80px); /* 减去头像和间距的宽度 */
  word-break: break-word;
}

/* AI消息气泡 */
.ai .message-content {
  background: rgba(0, 150, 255, 0.9);
  border: 1px solid rgba(0, 150, 255, 0.2);
}

/* 玩家消息气泡 */
.player .message-content {
  background: rgba(0, 255, 150, 0.9);
  border: 1px solid rgba(0, 255, 150, 0.2);
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
  font-family: "Monaco", monospace;
}

textarea:focus {
  outline: none;
  border-color: #00d0ff;
  box-shadow: 0 0 10px rgba(0, 208, 255, 0.2);
}

.dialogue-section button {
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
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
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
</style>
