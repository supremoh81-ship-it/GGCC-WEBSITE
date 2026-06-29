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
          navy: '#100B16',
          blue: '#1C1422',
          'blue-mid': '#2A1F33',
          'blue-light': '#372A42',
          gold: '#C9A84C',
          'gold-light': '#E8C97A',
          'gold-dark': '#8B6914',
          'gold-pale': '#F5E6B8',
          teal: '#1FA8A0',
          'teal-light': '#5FD9CF',
          'teal-dark': '#0E6862',
          'teal-pale': '#BFEFEA',
          magenta: '#C23A82',
          'magenta-light': '#E37FB8',
          'magenta-dark': '#7E1F58',
          'magenta-pale': '#F6D3E8',
        },
        surface: {
          DEFAULT: '#1C1422',
          raised: '#2A1F33',
          overlay: '#372A42',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#C7BDC8',
          muted: '#8C8090',
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
        flourish: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #100B16 0%, #1C1422 50%, #2A1F33 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)',
        'gradient-overlay': 'linear-gradient(to top, rgba(16, 11, 22, 0.98) 0%, rgba(16, 11, 22, 0.4) 60%, transparent 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'gradient-radial-gold': 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, transparent 70%)',
        'gradient-regal': 'linear-gradient(120deg, #1FA8A0 0%, #C9A84C 50%, #C23A82 100%)',
        'gradient-halo': 'conic-gradient(from 0deg, rgba(201,168,76,0.55), rgba(194,58,130,0.4), rgba(31,168,160,0.4), rgba(201,168,76,0.55))',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%)',
      },
      boxShadow: {
        gold: '0 0 40px rgba(201, 168, 76, 0.2)',
        'gold-sm': '0 0 20px rgba(201, 168, 76, 0.15)',
        'gold-lg': '0 0 80px rgba(201, 168, 76, 0.25)',
        teal: '0 0 40px rgba(31, 168, 160, 0.2)',
        magenta: '0 0 40px rgba(194, 58, 130, 0.2)',
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
        'halo-spin': 'halo-spin 24s linear infinite',
        'halo-spin-slow': 'halo-spin 40s linear infinite reverse',
        'dove-fly': 'dove-fly 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'halo-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'dove-fly': {
          '0%': { opacity: '0', transform: 'translate(-40px, 18px) scale(0.85) rotate(-6deg)' },
          '60%': { opacity: '1' },
          '100%': { opacity: '0.9', transform: 'translate(0, 0) scale(1) rotate(0deg)' },
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
