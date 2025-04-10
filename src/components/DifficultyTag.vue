<template>
  <span class="difficulty-tag" :class="difficultyClass">
    {{ difficultyText }}
  </span>
</template>

<script>
export default {
  name: 'DifficultyTag',
  props: {
    level: {
      type: String,
      required: true,
      validator: (value) => ['beginner', 'easy', 'medium', 'hard', 'expert'].includes(value)
    }
  },
  computed: {
    difficultyText() {
      const texts = {
        beginner: '入门',
        easy: '简单',
        medium: '中等',
        hard: '困难',
        expert: '专家'
      }
      return texts[this.level]
    },
    difficultyClass() {
      return `difficulty-${this.level}`
    }
  }
}
</script>

<style scoped>
.difficulty-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.difficulty-beginner {
  background-color: #4CAF50;
}

.difficulty-easy {
  background-color: #8BC34A;
}

.difficulty-medium {
  background-color: #FFC107;
}

.difficulty-hard {
  background-color: #FF9800;
}

.difficulty-expert {
  background-color: #F44336;
}
</style>