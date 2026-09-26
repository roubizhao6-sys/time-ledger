import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/time-ledger/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '时光存折',
        short_name: '时光存折',
        description: '每月存一点，年底得到一本只属于你的回忆册。',
        theme_color: '#1f5a45',
        background_color: '#f7f0df',
        display: 'standalone',
        start_url: '/time-ledger/',
        icons: [
          {
            src: '/time-ledger/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    css: true
  }
})
