<template>
  <div class="game-preferences">
    <div class="header">
      <div class="back-button" @click="goBack">
        <span class="back-icon">←</span>
      </div>
      <h1>游戏偏好</h1>
    </div>

    <div class="preferences-container">
      <!-- 设置类别将在这里添加 -->
      
      <div class="reset-container">
        <button class="reset-button" @click="resetPreferences">恢复默认设置</button>
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
        // 偏好设置将在这里定义
      }
    };
  },
  created() {
    // 从本地存储加载设置
    const savedPreferences = localStorage.getItem('gamePreferences');
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
        // 默认设置将在这里定义
      };
      this.savePreferences();
    },
    savePreferences() {
      localStorage.setItem('gamePreferences', JSON.stringify(this.preferences));
    }
  },
  watch: {
    preferences: {
      handler() {
        this.savePreferences();
      },
      deep: true
    }
  }
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