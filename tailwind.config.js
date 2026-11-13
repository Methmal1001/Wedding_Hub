/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './data/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        // Primary – dusty rose (romantic, elegant)
        rosewood: {
          DEFAULT: '#B4637A',
          50: '#FDF4F6',
          100: '#F9E4EA',
          200: '#F0C9D4',
          700: '#93485F',
          800: '#6E3446',
          900: '#42202B'
        },
        // Secondary – soft blush pink
        blush: { DEFAULT: '#F7E1E3', light: '#FCF1F2', dark: '#EDC5CA' },
        // Accent – champagne gold
        gold: { DEFAULT: '#C9A86A', light: '#E6D3A8', dark: '#94763C' },
        ivory: '#FFFBF9',
        charcoal: { DEFAULT: '#33272C', soft: '#6F6067' }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Jost', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(110, 52, 70, 0.18)',
        lift: '0 24px 60px -18px rgba(110, 52, 70, 0.32)'
      },
      maxWidth: { site: '1320px' }
    }
  },
  plugins: []
}
