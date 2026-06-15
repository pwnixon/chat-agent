import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.BASE_URL ?? '/',
  plugins: [react()],
  // The design system lives in ../_template with its OWN node_modules. Without
  // dedupe, the production build resolves ../_template's @mui/@emotion/react to
  // that sibling copy — a second MUI instance whose ThemeContext the prototype's
  // ThemeProvider never populates, so shared components (AppShell/AppHeader) fall
  // back to the default theme (h3 → 3rem, no colors). Force a single instance.
  resolve: {
    dedupe: ['react', 'react-dom', '@mui/material', '@mui/system', '@mui/private-theming', '@emotion/react', '@emotion/styled'],
  },
})
