import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy /static to backend, but Vite will serve files from public/static first
      '/static': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Don't proxy if file exists in public folder (Vite handles this automatically)
      }
    }
  }
})
