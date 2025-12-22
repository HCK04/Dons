/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#10b981',
        dark: '#0f172a',
      },
    },
  },
  plugins: [],
};

