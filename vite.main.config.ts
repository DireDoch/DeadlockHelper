import { defineConfig } from 'vite';
import path from 'node:path';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    MAIN_WINDOW_VITE_DEV_SERVER_URL: JSON.stringify(''),
    MAIN_WINDOW_VITE_NAME: JSON.stringify('main_window'),
    OVERLAY_WINDOW_VITE_DEV_SERVER_URL: JSON.stringify(''),
    OVERLAY_WINDOW_VITE_NAME: JSON.stringify('overlay_window'),
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main/main.ts'),
      formats: ['cjs'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      // Externalize all node_modules and Node built-ins — electron-builder bundles them separately
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    },
    target: 'node20',
    outDir: '.vite/build',
    emptyOutDir: false,
  },
});
