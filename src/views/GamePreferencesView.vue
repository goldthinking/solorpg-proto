<template>
  <div class="game-preferences">
    <div class="header">
      <div class="back-button" @click="goBack">
        <span class="back-icon">←</span>
      </div>
      <h1>游戏偏好</h1>
    </div>

    <div class="preferences-container">
      <!-- 界面设置 -->
      <div class="preference-section">
        <h2 class="section-title">界面设置</h2>

        <div class="preference-item">
          <div class="preference-info">
            <div class="preference-name">文字大小</div>
            <div class="preference-description">调整游戏中文字的显示大小</div>
          </div>
          <div class="preference-control">
            <select v-model="preferences.textSize" class="select-control">
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
              <option value="xlarge">超大</option>
            </select>
          </div>
        </div>
      </div>

      <div class="reset-container">
        <button class="reset-button" @click="resetPreferences">
          恢复默认设置
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GamePreferencesView",
  data() {
    return {
      preferences: {
        // 界面设置
        textSize: "medium",
        dialogStyle: "classic",
      },
    };
  },
  created() {
    // 从本地存储加载设置
    const savedPreferences = localStorage.getItem("gamePreferences");
    if (savedPreferences) {
      this.preferences = JSON.parse(savedPreferences);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    resetPreferences() {
      this.preferences = {
        textSize: "medium",
        dialogStyle: "classic",
      };
      this.savePreferences();
    },
    savePreferences() {
      localStorage.setItem("gamePreferences", JSON.stringify(this.preferences));
    },
  },
  watch: {
    preferences: {
      handler() {
        this.savePreferences();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.game-preferences {
  padding: 20px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.back-button {
  margin-right: 15px;
  cursor: pointer;
}

.back-icon {
  font-size: 24px;
}

.header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.preferences-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.preference-section {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 15px 0;
  font-size: 17px;
  font-weight: 600;
  color: var(--accent-light);
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-info {
  flex: 1;
}

.preference-name {
  font-size: 15px;
  margin-bottom: 4px;
}

.preference-description {
  font-size: 12px;
  color: var(--text-secondary);
}

.preference-control {
  min-width: 100px;
  display: flex;
  justify-content: flex-end;
}

.select-control {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
}

.reset-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 30px;
}

.reset-button {
  padding: 10px 20px;
  background-color: transparent;
  border: 1px solid var(--accent-light);
  border-radius: 20px;
  color: var(--accent-light);
  font-size: 14px;
  cursor: pointer;
}
</style>
