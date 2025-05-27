// src/stores/clueStore.js
import { defineStore } from 'pinia';

// src/stores/clueStore.js
export const useClueStore = defineStore('clueStore', {
  state: () => ({
    clues: [] // 存储线索数组
  }),
  actions: {
    addClues(newClues) {
      // 如果 newClues 是单个线索对象，转为数组
      const cluesToAdd = Array.isArray(newClues) ? newClues : [newClues];
      this.clues.push(...cluesToAdd);
    },
    clearClues() {
      this.clues = [];
    },
    // 新增：检查线索是否已存在
    hasClue(clue) {
      return this.clues.some(c => c.url === clue.url); // 假设用 url 作为唯一标识
    }
  }
});
