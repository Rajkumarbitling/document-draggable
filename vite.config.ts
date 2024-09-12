import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    cors: true,
    proxy: {
      '/api/proxy-image': {
        target: 'https://loremflickr.com', // Replace with the image's base URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy-image/, ''),
      },
    },
  },
})
