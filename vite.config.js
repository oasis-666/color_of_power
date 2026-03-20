import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 🌟 告诉 Vite：凡是遇到 /api 开头的请求，统统帮我转给真实的后端
      '/api': {
        target: 'http://server.hairuosky.cn:1111',
        changeOrigin: true
      }
    }
  }
})