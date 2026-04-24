/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dust: {
          excellent: '#28A33E',
          warning: '#FBAA22',
          over: '#F92424',
          offline: '#2C2C2C',
        },
        background: {
          DEFAULT: '#0a0f1a',
          dark: '#0a0f1a',
          panel: 'rgba(0, 20, 40, 0.8)',
        },
        foreground: {
          DEFAULT: '#e6f7ff',
        },
        primary: {
          DEFAULT: '#00d4ff',
          foreground: '#0a0f1a',
        },
        secondary: {
          DEFAULT: 'rgba(0, 40, 80, 0.8)',
          foreground: '#e6f7ff',
        },
        muted: {
          DEFAULT: 'rgba(0, 40, 80, 0.8)',
          foreground: '#8899aa',
        },
        accent: {
          DEFAULT: '#0080a0',
          foreground: '#e6f7ff',
        },
        destructive: {
          DEFAULT: '#F92424',
          foreground: '#ffffff',
        },
        border: {
          DEFAULT: 'rgba(0, 212, 255, 0.3)',
          glow: '#00d4ff',
        },
        input: {
          DEFAULT: 'rgba(0, 40, 80, 0.8)',
        },
        ring: {
          DEFAULT: '#00d4ff',
        },
        card: {
          DEFAULT: 'rgba(0, 20, 40, 0.8)',
          foreground: '#e6f7ff',
        },
        popover: {
          DEFAULT: 'rgba(0, 20, 40, 0.95)',
          foreground: '#e6f7ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
