import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // 将 API 请求转发到后端的 8848 端口
      '/api': {
        target: 'http://0.0.0.0:8848', // 后端服务器地址
        changeOrigin: true,
        secure: false, // 如果是 https，设置为 true
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉路径中的 /api 部分
      },
    },
  }
})
