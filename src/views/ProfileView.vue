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
    };
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
</style>
