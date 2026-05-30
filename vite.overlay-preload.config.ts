import { defineConfig } from 'vite';
import path from 'node:path';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/preload/overlay-preload.ts'),
      formats: ['cjs'],
      fileName: () => 'overlay-preload.js',
    },
    outDir: '.vite/build',
    emptyOutDir: false,
  },
});
