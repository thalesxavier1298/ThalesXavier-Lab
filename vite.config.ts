import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Absolute base: nested routes like /projects/assignment-hub must load /assets/... from the root.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // The single-file preview (VITE_ROUTER=memory) embeds every asset; the real build keeps files.
    assetsInlineLimit: process.env.VITE_ROUTER === 'memory' ? 50_000_000 : 4096,
  },
})
