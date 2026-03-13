/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#020408',
        surface: '#0a0f1a',
        panel: '#0d1525',
        border: '#1a2540',
        accent: '#00d4ff',
        accent2: '#7b61ff',
        glow: '#00ffcc',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
