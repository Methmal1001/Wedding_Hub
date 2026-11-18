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
      // Brand palette (from the logo, CMYK -> RGB):
      //   Blue  C100 M70 K5 = #0049F2  (primary)
      //   Cyan  C100 M5     = #00F2FF  (accent)
      //   Green C70 Y100    = #4DFF00  (highlight)
      // Token names (rosewood / blush / gold) are kept from the original theme
      // so existing class names keep working; only the values changed.
      colors: {
        // Primary – brand blue
        rosewood: {
          DEFAULT: '#0049F2',
          50: '#EEF4FF',
          100: '#DBE7FF',
          200: '#B3CBFF',
          700: '#0039C2',
          800: '#002A8F',
          900: '#001A57'
        },
        // Secondary – soft sky tint (backgrounds)
        blush: { DEFAULT: '#E3F6FF', light: '#F2FBFF', dark: '#BDE9FA' },
        // Accent – brand cyan (light = exact brand cyan, dark = readable on white)
        gold: { DEFAULT: '#00D2E6', light: '#00F2FF', dark: '#007A8A' },
        // Highlight – brand green
        leaf: { DEFAULT: '#4DFF00', light: '#B6FF8F', dark: '#2E9900' },
        ivory: '#F8FBFF',
        charcoal: { DEFAULT: '#0F1B33', soft: '#55607A' }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Jost', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(0, 42, 143, 0.18)',
        lift: '0 24px 60px -18px rgba(0, 42, 143, 0.32)'
      },
      maxWidth: { site: '1320px' }
    }
  },
  plugins: []
}
