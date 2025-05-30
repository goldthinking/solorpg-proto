<template>
  <div class="script-view">
    <!-- 搜索框 -->
    <div class="search-bar">
      <input
        type="text"
        placeholder="搜索剧本..."
        v-model="searchQuery"
        @keyup.enter="fetchScripts"
      />
      <button @click="fetchScripts">查询</button> <!-- 查询按钮 -->
    </div>

    <!-- 按钮行 -->
    <!-- <div class="button-row">
      <button class="rank-button">
        <span>排行榜</span>
      </button>
      <button class="category-button">
        <span>分类</span>
      </button>
    </div> -->

    <!-- 剧本列表 -->
    <div class="script-list">
      <div
        class="script-item"
        v-for="(script, index) in scripts"
        :key="index"
        @click="goToScriptDetail(script)"
      >
        <img :src="script.cover" class="script-cover" />
        <div class="script-info">
          <div class="title-row">
            <h3>{{ script.scriptName }}</h3>
            <div class="title-meta">
              <DifficultyTag :level="script.difficulty" />
            </div>
          </div>
          <p class="description">{{ script.scriptDescription }}</p>
          <div class="bottom-row">
            <div class="tags">
              <span class="tag" v-for="(tag, tagIndex) in script.tags" :key="tagIndex">
                {{ tag.tagName }}
              </span>
            </div>
            <span class="players">{{ script.playTimes }}人玩过</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分页按钮 -->
    <div class="pagination">
      <button @click="changePage(page - 1)" :disabled="page <= 1" style="margin-right: 20px;">上一页</button>
      <span>第 {{ page }} 页</span>
      <button @click="changePage(page + 1)" :disabled="page >= totalPages" style="margin-left: 20px;">下一页</button>
    </div>
  </div>
  <TabBar />
</template>

<script>
import TabBar from '@/components/TabBar.vue'
import DifficultyTag from '@/components/DifficultyTag.vue'
import router from '@/router'
import { fetchScripts } from '@/api/script' 

export default {
  name: 'ScriptView',
  components: { TabBar, DifficultyTag },
  data() {
    return {
      scripts: [], // 存储从后端获取到的剧本数据
      searchQuery: '', // 存储搜索框的输入
      page: 1, // 当前页数
      size: 5, // 每页显示的剧本数量
      totalPages: 2, // 总页数
      totalRecords: 0, // 总记录数
      difficulty: null, // 难度等级
      difficultyMap: {
        '入门': 'beginner',
        '简单': 'easy',
        '中等': 'medium',
        '困难': 'hard',
        '专家': 'expert'
      }
    }
  },
  mounted() {
    this.fetchScripts()
  },
  methods: {
    fetchScripts() {
      // 判断是否是有效的难度
      const difficultyParam = this.difficultyMap[this.searchQuery] || null;
      let searchText = '';

      // 如果难度匹配到了，搜索框清空
      if (difficultyParam) {
        this.searchQuery = '';  // 清空搜索框内容
        searchText = '';  // 不使用搜索词
      } else {
        searchText = this.searchQuery;  // 否则使用搜索框的内容
      }

      // 请求后端获取剧本数据
      fetchScripts(this.page, this.size, null, difficultyParam, searchText)
        .then(data => {
          this.scripts = data.data; // 更新剧本数据
          this.totalRecords = data.total; // 获取总记录数
          this.totalPages = Math.ceil(this.totalRecords / this.size); // 计算总页数
        })
        .catch(error => {
          console.error('获取剧本数据失败:', error);
        });
    },

    // 点击剧本跳转到详情页
    goToScriptDetail(script) {
      router.push({ name: 'script-detail', params: { scriptId: script.scriptId } });
    },

    // 改变当前页数
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchScripts(); // 获取新的剧本数据
      }
    }
  }
}
</script>

<style scoped>
.script-view {
  padding: 20px;
  padding-bottom: 70px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.search-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-bottom: 20px;
  background-color: var(--bg-primary);
  padding: 10px 0;
  display: flex;
  gap: 10px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.search-bar button {
  padding: 10px 20px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
}

.button-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.button-row button {
  flex: 0 0 48%;
  padding: 12px 12px 12px 40px;
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 16px;
  position: relative;
}

.rank-button {
  background: linear-gradient(135deg, #d6a65f, #9e7211);
}

.rank-button::before {
  content: '🏆';
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
}

.category-button {
  background: linear-gradient(135deg, #8262ec, #521ca8);
}

.category-button::before {
  content: '🏷️';
  position: absolute;
  left: 18px;
  font-size: 24px;
  top: 50%;
  transform: translateY(-50%);
}

.button-row button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.script-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.script-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--bg-secondary);
}

.script-cover {
  width: 80px;
  height: 120px;
  background-color: #2d2d2d;
  object-fit: cover;
}

.script-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 5px 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.title-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.rating {
  color: var(--warning);
}

.players {
  color: var(--text-secondary);
  font-size: 12px;
}

.bottom-row {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 8px;
  background-color: transparent;
  border: 1px solid var(--text-dark);
  border-radius: 999px;
  font-size: 12px;
  color: var(--text-dark);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid var(--border);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
