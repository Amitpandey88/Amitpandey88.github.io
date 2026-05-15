/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        card: '#111a2e',
        accent: '#00d4ff',
        success: '#34d399',
        warning: '#fbbf24',
        danger: '#f87171'
      }
    }
  },
  plugins: []
}
