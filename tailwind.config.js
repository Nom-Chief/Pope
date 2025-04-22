/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy': {
          50: '#F5F7F9',
          100: '#E6EBF0',
          200: '#D0D9E2',
          300: '#A3B3C4',
          400: '#6C8CA6',
          500: '#1A2A3A', // Main navy
          600: '#152230',
          700: '#101A26',
          800: '#0B121C',
          900: '#060A12',
        },
        'burgundy': {
          50: '#F9F0F1',
          100: '#F2D8DA',
          200: '#E5B1B6',
          300: '#D88A92',
          400: '#CB636D',
          500: '#8C2D36', // Main burgundy
          600: '#6E242B',
          700: '#501B20',
          800: '#321215',
          900: '#14090A',
        },
        'gray': {
          50: '#FFFFFF',
          100: '#F5F5F5',
          200: '#E6E6E6', // Main light gray
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Work Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
    },
  },
  plugins: [],
};