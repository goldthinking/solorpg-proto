<template>
  <div class="profile-view">
    <!-- 用户信息区 -->
    <div class="user-info-section">
      <div class="avatar-container">
        <img :src="userInfo.avatar" class="user-avatar" />
      </div>
      <div class="user-details">
        <h2 class="username">神秘玩家</h2>
        <p class="user-id">ID: 777</p>
      </div>
      <div class="edit-profile">
        <button class="edit-button">编辑资料</button>
      </div>
    </div>
    <!-- 我的剧本 -->
    <div class="section">
      <div class="section-header">
        <h3>我的剧本</h3>
        <span class="view-all">查看全部 ></span>
      </div>
      <div class="my-scripts">
        <div
          class="script-card"
          v-for="(script, index) in myScripts"
          :key="index"
        >
          <img :src="script.cover" class="script-cover" />
          <div class="script-info">
            <h4>{{ script.name }}</h4>
            <div class="script-meta">
              <span class="script-tag">{{ script.tags[0] }}</span>
              <span class="script-difficulty">{{
                getDifficultyText(script.difficulty)
              }}</span>
            </div>
          </div>
        </div>
        <div class="empty-placeholder" v-if="myScripts.length === 0">
          <p>还没有收藏的剧本</p>
          <button class="explore-button">去发现</button>
        </div>
      </div>
    </div>
    <!-- 其他部分将在后续添加 -->
  </div>
  <TabBar />
</template>

<script>
import TabBar from "@/components/TabBar.vue";

export default {
  name: "ProfileView",
  components: { TabBar },
  data() {
    return {
      userInfo: {
        name: "神秘玩家",
        id: "10086",
        avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=777",
      },
      myScripts: [
        {
          name: "血色山庄",
          cover: "",
          difficulty: "beginner",
          tags: ["悬疑"],
        },
        {
          name: "镜中世界",
          cover: "",
          difficulty: "hard",
          tags: ["烧脑"],
        },
      ],
    };
  },
  methods: {
    getDifficultyText(level) {
      const map = {
        beginner: "入门",
        medium: "进阶",
        hard: "困难",
        expert: "专家",
      };
      return map[level] || "未知";
    },
  },
};
</script>

<style scoped>
.profile-view {
  padding: 20px;
  padding-bottom: 70px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.user-info-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  margin-right: 15px;
}

.user-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-light);
}

.user-details {
  flex: 1;
}

.username {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.user-id {
  margin: 5px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.edit-button {
  padding: 8px 15px;
  background-color: transparent;
  border: 1px solid var(--accent-light);
  border-radius: 20px;
  color: var(--accent-light);
  font-size: 14px;
  cursor: pointer;
}
.section {
  margin-bottom: 25px;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}

.view-all {
  font-size: 14px;
  color: var(--accent-light);
}

.my-scripts {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding-bottom: 10px;
}

.my-scripts::-webkit-scrollbar {
  height: 4px;
}

.my-scripts::-webkit-scrollbar-thumb {
  background-color: var(--border);
  border-radius: 2px;
}

.script-card {
  min-width: 120px;
  width: 120px;
}

.script-cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #606060;
  margin-bottom: 8px;
}

.script-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.script-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

.empty-placeholder {
  width: 100%;
  text-align: center;
  padding: 30px 0;
}

.empty-placeholder p {
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.explore-button {
  padding: 8px 20px;
  background-color: var(--accent-light);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}
</style>
