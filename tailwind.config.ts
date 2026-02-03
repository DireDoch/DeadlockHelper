import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  // Note: With Tailwind v4, colors are defined in CSS using @theme
  // This config file is kept for content paths and other settings
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
