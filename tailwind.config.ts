import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A1628',
          blue: '#0F2347',
          'blue-mid': '#1A3A6B',
          'blue-light': '#243F73',
          gold: '#C9A84C',
          'gold-light': '#E8C97A',
          'gold-dark': '#8B6914',
          'gold-pale': '#F5E6B8',
        },
        surface: {
          DEFAULT: '#0F2347',
          raised: '#1A3A6B',
          overlay: '#243F73',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A8B8D4',
          muted: '#6A7B9A',
          gold: '#C9A84C',
        },
        border: {
          DEFAULT: 'rgba(201, 168, 76, 0.15)',
          subtle: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(201, 168, 76, 0.4)',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0A1628 0%, #0F2347 50%, #1A3A6B 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)',
        'gradient-overlay': 'linear-gradient(to top, rgba(10, 22, 40, 0.98) 0%, rgba(10, 22, 40, 0.4) 60%, transparent 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'gradient-radial-gold': 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, transparent 70%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%)',
      },
      boxShadow: {
        gold: '0 0 40px rgba(201, 168, 76, 0.2)',
        'gold-sm': '0 0 20px rgba(201, 168, 76, 0.15)',
        'gold-lg': '0 0 80px rgba(201, 168, 76, 0.25)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.5)',
        glow: '0 0 80px rgba(201, 168, 76, 0.1)',
        'inner-gold': 'inset 0 1px 0 rgba(201, 168, 76, 0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        spin: 'spin 1s linear infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [],
}

export default config
