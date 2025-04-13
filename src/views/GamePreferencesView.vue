<template>
  <div class="game-preferences">
    <div class="header">
      <div class="back-button" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24">
          <path
            d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
          />
        </svg>
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

        <div class="preference-item">
          <div class="preference-info">
            <div class="preference-name">对话框样式</div>
            <div class="preference-description">选择对话框的显示风格</div>
          </div>
          <div class="preference-control">
            <select v-model="preferences.dialogStyle" class="select-control">
              <option value="classic">经典</option>
              <option value="modern">现代</option>
              <option value="minimal">简约</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 音效设置 -->
      <div class="preference-section">
        <h2 class="section-title">音效设置</h2>

        <div class="preference-item">
          <div class="preference-info">
            <div class="preference-name">背景音乐</div>
            <div class="preference-description">游戏背景音乐音量</div>
          </div>
          <div class="preference-control">
            <div class="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                v-model="preferences.bgmVolume"
                class="slider"
              />
              <div class="slider-labels">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="preference-item">
          <div class="preference-info">
            <div class="preference-name">音效</div>
            <div class="preference-description">游戏音效音量</div>
          </div>
          <div class="preference-control">
            <div class="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                v-model="preferences.sfxVolume"
                class="slider"
              />
              <div class="slider-labels">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏体验（待完善） -->
      <div class="preference-section">
        <h2 class="section-title">游戏体验</h2>
        <div class="coming-soon">
          <div class="coming-soon-icon">🚧</div>
          <div class="coming-soon-text">功能开发中，敬请期待</div>
        </div>
      </div>

      <!-- 辅助功能（待完善） -->
      <div class="preference-section">
        <h2 class="section-title">辅助功能</h2>
        <div class="coming-soon">
          <div class="coming-soon-icon">🚧</div>
          <div class="coming-soon-text">功能开发中，敬请期待</div>
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

        // 音效设置
        bgmVolume: 70,
        sfxVolume: 80,
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
      //   this.$router.go(-1);
      // 直接导航到profile路由
      this.$router.push("/profile");
    },
    resetPreferences() {
      this.preferences = {
        textSize: "medium",
        dialogStyle: "classic",
        bgmVolume: 70,
        sfxVolume: 80,
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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.back-icon {
  width: 24px;
  height: 24px;
  fill: var(--accent-light);
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

.slider-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-light);
  cursor: pointer;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 5px;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  color: var(--text-secondary);
}

.coming-soon-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.coming-soon-text {
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
