import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const clientDir = path.dirname(fileURLToPath(import.meta.url))

/** Dev proxy: `client/.env` → `API_PROXY_TARGET` (must match your API `PORT`). */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, clientDir, '')
  const target = env.API_PROXY_TARGET || 'http://localhost:5000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          rewrite: p => p.replace(/^\/api/, '') || '/'
        }
      }
    }
  }
})
