/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-bg': '#0a0a0a',
        'terminal-green': '#00ff00',
        'terminal-yellow': '#ffff00',
        'terminal-red': '#ff0000',
        'terminal-blue': '#0080ff',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
