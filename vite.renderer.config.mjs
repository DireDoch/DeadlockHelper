import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    tailwindcss({
      // Explicitly load the config file
      config: './tailwind.config.ts',
    }),
  ],
});
