/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        'frosted-mint': {
          300: '#b0dc38',
          400: '#cfea86',
        },
        'charcoal': {
          100: '#121212',
          200: '#252525',
          300: '#373737',
        },
      },
    },
  },
  plugins: [],
};
