import { defineConfig } from 'vite';
import path from 'node:path';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    // Forge globals — injected here for standalone electron-builder builds
    MAIN_WINDOW_VITE_DEV_SERVER_URL: JSON.stringify(''),
    MAIN_WINDOW_VITE_NAME: JSON.stringify('main_window'),
    OVERLAY_WINDOW_VITE_DEV_SERVER_URL: JSON.stringify(''),
    OVERLAY_WINDOW_VITE_NAME: JSON.stringify('overlay_window'),
    // __dirname is not available in ESM; import.meta.dirname is Node 22+ (Electron 28+)
    __dirname: 'import.meta.dirname',
    __filename: 'import.meta.filename',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main/main.ts'),
      // ESM output so electron-store v10 (ESM-only) is imported correctly at runtime.
      // Electron 28+ supports .mjs entry points natively.
      formats: ['es'],
      fileName: () => 'main.mjs',
    },
    rollupOptions: {
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    },
    target: 'node22',
    outDir: '.vite/build',
    emptyOutDir: false,
  },
});
