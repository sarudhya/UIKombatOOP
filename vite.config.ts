import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @ts-ignore
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/select-mode': 'http://localhost:8080',
      '/minion': 'http://localhost:8080',
      '/config': 'http://localhost:8080',
      '/ws': {
        target: 'http://localhost:8080',
        ws: true,
      }
    }
  }
})
