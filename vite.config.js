import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1/api': {
        target: 'https://english-center-website.onrender.com',
        changeOrigin: true,
        secure: true,
        headers: {
          'Origin': 'https://english-center-website.onrender.com'
        }
      }
    }
  }
})
