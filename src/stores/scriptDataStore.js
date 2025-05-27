import { defineStore } from 'pinia';

export const useScriptDataStore = defineStore('scriptData', {
  state: () => ({
    scriptData: null,
  }),
  actions: {
    setScriptData(data) {
      this.scriptData = data;
    },
  },
  persist: true,  // 启用持久化
});
