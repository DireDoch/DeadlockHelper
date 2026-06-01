import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss({ config: './tailwind.config.ts' }),
  ],
  base: './',
  build: {
    rollupOptions: {
      input: './overlay.html',
    },
    outDir: '.vite/renderer/overlay_window',
    emptyOutDir: true,
  },
});
