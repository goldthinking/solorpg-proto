// src/stores/gameSessionStore.js
import { defineStore } from 'pinia';

export const useGameSessionStore = defineStore('gameSession', {
  state: () => ({
    questionAnswersCount: {}, // 记录每个问题的回答次数
    questionAskCount: 0, // 总提问次数
    questionCorrectAskCount: 0, // 总提问正确次数
  }),
  actions: {
    // 增加玩家在某个问题的回答次数
    incrementPlayerAnswerCount(question, score = 0) {
      const questionKey = question.trim();  // 使用问题的文本作为键
      if (!this.questionAnswersCount[questionKey]) {
        this.questionAnswersCount[questionKey] = { count: 0, score: 0 };
      }
      this.questionAnswersCount[questionKey].count += 1;  // 增加回答次数
      this.questionAnswersCount[questionKey].score = score;  // 增加分数

      console.log('Updated game session store:', this.questionAnswersCount);
    },

    // 增加提问次数
    incrementQuestionAskCount() {
      this.questionAskCount += 1;
      console.log('Updated question ask count:', this.questionAskCount);
    },

    // 增加正确回答的次数
    incrementQuestionCorrectAskCount() {
      this.questionCorrectAskCount += 1;
      console.log('Updated correct question ask count:', this.questionCorrectAskCount);
    },

    // 获取某个问题的玩家回答次数
    getPlayerAnswerCount(question) {
      const questionKey = question.trim();  // 使用问题的文本作为键
      return this.questionAnswersCount[questionKey] || 0;
    },

    // 获取总的提问次数
    getQuestionAskCount() {
      return this.questionAskCount;
    },

    // 获取总的正确回答次数
    getQuestionCorrectAskCount() {
      return this.questionCorrectAskCount;
    },

    // 设置某个问题的回答次数
    setPlayerAnswerCount(question, count) {
      const questionKey = question.trim();
      this.questionAnswersCount[questionKey] = count;
    },

    // 设置总的提问次数
    setQuestionAskCount(count) {
      this.questionAskCount = count;
    },

    // 设置总的正确回答次数
    setQuestionCorrectAskCount(count) {
      this.questionCorrectAskCount = count;
    },
  },
});
