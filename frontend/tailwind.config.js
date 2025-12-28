/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src//*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // 👈 Enables class-based dark mode
  theme: {
    extend: {},
  },
  plugins: ['tailwind-var-variants/plugin'],
}