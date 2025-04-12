<template>
  <div class="final-reveal">
    <header class="header">
      <h1>终章揭晓</h1>
    </header>
    <section class="content">
      <p v-if="!revealed">
        你是否已经准备好迈入故事的下一幕？点击下方按钮，发现隐藏在情节背后的真相！
      </p>
      <p v-else>
        答案：每个故事都有它独特的结局。<br />
        真相总在不经意间揭晓。
      </p>
      <button class="reveal-btn" @click="toggleReveal">
        {{ revealed ? '重新隐藏' : '点击揭晓' }}
      </button>
    </section>
    <footer class="footer">
      <p>每个故事的终章，都等待着你的发现。</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const revealed = ref(false)
const toggleReveal = () => {
  revealed.value = !revealed.value
}
</script>

<style scoped>
.final-reveal {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Arial', sans-serif;
}

.header h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
}

.content p {
  font-size: 18px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 20px;
}

.reveal-btn {
  background-color: #4a90e2;
  color: #fff;
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reveal-btn:hover {
  background-color: #357ABD;
}

.footer p {
  margin-top: 30px;
  font-size: 14px;
  color: #777;
}
</style>
