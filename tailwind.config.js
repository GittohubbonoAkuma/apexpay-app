/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          blue: '#002970',
          cyan: '#00baf2',
          navy: '#0f172a',
          emerald: '#00b386',
          bg: '#f3f6fa'
        }
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 0.6s ease-in-out 2'
      }
    },
  },
  plugins: [],
}
