/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sea': {
          'green': '#034334',
          'green-shadow': '#042C23',
          'bright-green': '#00FF55',
        },
        'production': {
          'purple': '#2C0651',
          'purple-shadow': '#1E0437',
        },
        'wheat': {
          DEFAULT: '#F2F2EF',
          'shadow': '#E8E8E4',
        },
      },
      fontFamily: {
        'sans': ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
