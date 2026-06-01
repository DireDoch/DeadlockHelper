import { defineConfig } from 'vite';
import path from 'node:path';
import { config as loadDotenv } from 'dotenv';

// Load .env so credentials are available as process.env.* at build time.
// In CI, these are passed as environment variables from GitHub Secrets instead.
loadDotenv();

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
    // Bake credentials into the bundle at build time — dotenv is not available in packaged builds.
    'process.env.SPOTIFY_CLIENT_ID': JSON.stringify(process.env.SPOTIFY_CLIENT_ID ?? ''),
    'process.env.SPOTIFY_CLIENT_SECRET': JSON.stringify(process.env.SPOTIFY_CLIENT_SECRET ?? ''),
    'process.env.SPOTIFY_REDIRECT_URI': JSON.stringify(process.env.SPOTIFY_REDIRECT_URI ?? 'http://127.0.0.1:30765/callback'),
    'process.env.STEAM_API_KEY': JSON.stringify(process.env.STEAM_API_KEY ?? ''),
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
