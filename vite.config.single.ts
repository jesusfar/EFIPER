import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Genera UN solo index.html autónomo (abrible por doble clic, sin servidor ni terminal).
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-single',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
