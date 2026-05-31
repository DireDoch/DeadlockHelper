import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://diredoch.github.io',
  base: '/DeadlockHelper',
  integrations: [tailwind()],
});
