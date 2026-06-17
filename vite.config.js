import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { existsSync } from 'fs'

// When ../design-system/ exists locally, alias the package to source so edits
// hot-reload immediately without npm install. No-op in CI (directory absent).
const localDS = path.resolve(__dirname, '../design-system')
const hasLocal = existsSync(localDS)

export default defineConfig({
  base: process.env.BASE_URL ?? '/',
  plugins: [react()],
  resolve: {
    ...(hasLocal && { alias: { '@archera/design-system': localDS } }),
    dedupe: ['react', 'react-dom', '@mui/material', '@mui/system', '@mui/private-theming', '@emotion/react', '@emotion/styled'],
  },
  optimizeDeps: { exclude: ['@archera/design-system'] },
  server: { fs: { allow: ['..'] } },
})
