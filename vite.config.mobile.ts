import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Mobile app build configuration - always uses relative paths
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // Mobile apps always use relative paths
  base: './'
})

