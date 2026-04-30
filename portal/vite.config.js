import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/getfacil/portal/',
  build: {
    outDir: '../dist/portal',
    emptyOutDir: true,
  },
})
