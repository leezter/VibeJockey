/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0f1a',
        surface: '#121826',
        accent: '#6d7cff',
        glow: '#98a2ff',
      },
      boxShadow: {
        glow: '0 0 30px rgba(109, 124, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
