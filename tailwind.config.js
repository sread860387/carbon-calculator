/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-sea-green',
    'bg-sea-green-shadow',
    'bg-sea-bright-green',
    'bg-production-purple',
    'bg-production-purple-shadow',
    'bg-wheat',
    'bg-wheat-shadow',
    'text-sea-green',
    'text-sea-green-shadow',
    'text-sea-bright-green',
    'text-production-purple',
    'text-wheat',
    'border-sea-green',
    'hover:bg-sea-green',
    'hover:text-sea-bright-green',
  ],
  theme: {
    extend: {
      colors: {
        'sea-green': '#034334',
        'sea-green-shadow': '#042C23',
        'sea-bright-green': '#00FF55',
        'production-purple': '#2C0651',
        'production-purple-shadow': '#1E0437',
        'wheat': '#F2F2EF',
        'wheat-shadow': '#E8E8E4',
      },
      fontFamily: {
        'sans': ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
