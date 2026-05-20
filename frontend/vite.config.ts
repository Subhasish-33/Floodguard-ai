import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@simulation': path.resolve(__dirname, '../simulation/index.ts'),
    },
  },

  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },

  // ─── Worker Configuration ────────────────────────────────────────────────
  worker: {
    format: 'es',
  },

  // ─── Performance Optimization ────────────────────────────────────────────
  build: {
    chunkSizeWarningLimit: 900,
    target: 'esnext',
    sourcemap: false,

    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal loading
        manualChunks(id: string) {
          if (id.includes('three') || id.includes('@react-three')) return 'vendor-three'
          if (id.includes('framer-motion')) return 'vendor-framer'
          if (id.includes('zustand')) return 'vendor-zustand'
          if (id.includes('node_modules/react')) return 'vendor-react'
          if (id.includes('/simulation/')) return 'simulation-engine'
          return undefined
        },
      },
    },
  },

  // ─── Optimization Hints ──────────────────────────────────────────────────
  optimizeDeps: {
    include: ['three', 'zustand', 'framer-motion'],
    exclude: ['@simulation'],
  },
})
