import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Para GitHub Pages de proyecto, base = '/<nombre-del-repo>/'.
// Para dominio propio o user-page, usar '/'.
const BASE = process.env.EFIPER_BASE ?? '/efiper/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'EFIPER — Entrenador EFIP I',
        short_name: 'EFIPER',
        description: 'Entrenador personal para aprobar el EFIP I.',
        theme_color: '#005E50',
        background_color: '#F4F8F7',
        display: 'standalone',
        start_url: BASE,
        scope: BASE,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
      },
    }),
  ],
});
