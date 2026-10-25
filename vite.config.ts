import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three-vendor'
          }
          if (id.includes('react/') || id.includes('react-dom/')) {
            return 'react-vendor'
          }
        },
      },
    },
  },
})
