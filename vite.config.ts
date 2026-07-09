import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Para Cloudflare Pages/dominio propio, usar '/'.
// Para GitHub Pages de proyecto, setear EFIPER_BASE='/(nombre-del-repo)/'.
const BASE = process.env.EFIPER_BASE ?? '/';

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
        // Los MP3 (~15 MB) ya no se precachean en la instalación del SW: se cargan
        // on-demand y quedan en caché con CacheFirst la primera vez que suenan.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,json}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/efiper\.alola\.workers\.dev\/api\//,
            handler: 'NetworkOnly',
            method: 'GET',
          },
          {
            urlPattern: ({ request }) => request.destination === 'audio' || /\.mp3$/i.test(new URL(request.url).pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'efiper-audio',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
});
