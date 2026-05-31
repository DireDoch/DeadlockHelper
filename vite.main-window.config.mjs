import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss({ config: './tailwind.config.ts' }),
  ],
  build: {
    rollupOptions: {
      input: './index.html',
    },
    outDir: '.vite/renderer/main_window',
    emptyOutDir: true,
  },
});
