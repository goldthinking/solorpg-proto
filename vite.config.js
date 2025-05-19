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
      '/api': {
        target: 'http://0.0.0.0:8848/api', // 后端API代理地址
        changeOrigin: true,  // 是否允许跨域
        secure: false,  // 如果是 https 请求，设置为 true
        rewrite: (path) => path.replace(/^\/api/, '') // 将请求的 '/api' 部分去掉
      }
    },
  }
})
