/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Mark UI Brand Colors
        primary: {
          DEFAULT: '#FF6A00',
          50: '#FFF1E6',
          100: '#FFE0C2',
          200: '#FFC185',
          300: '#FFA348',
          400: '#FF8520',
          500: '#FF6A00',
          600: '#CC5500',
          700: '#994000',
          800: '#662B00',
          900: '#331500',
        },
        // Light theme (public site)
        background: '#FFFFFF',
        surface: '#F7F7F7',
        'surface-2': '#EFEFEF',
        'surface-3': '#E8E8E8',
        text: {
          DEFAULT: '#0D0D0D',
          muted: '#555555',
          subtle: '#999999',
        },
        border: '#E5E5E5',
        // Dark surface for nav/footer/CTA islands
        'dark-bg': '#0D0D0D',
        'dark-surface': '#1A1A1A',
        'dark-border': '#2E2E2E',
        // ShadCN compatibility
        ring: '#FF6A00',
        input: '#E5E5E5',
        card: {
          DEFAULT: '#F7F7F7',
          foreground: '#0D0D0D',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0D0D0D',
        },
        muted: {
          DEFAULT: '#EFEFEF',
          foreground: '#555555',
        },
        accent: {
          DEFAULT: '#FF6A00',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F0F0F0',
          foreground: '#0D0D0D',
        },
        foreground: '#0D0D0D',
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '6px',
        xl: '16px',
        '2xl': '24px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cal)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'counter': 'counter 2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #FF6A00 0%, #FF8500 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
        'noise': "url('/noise.svg')",
      },
      boxShadow: {
        'brand': '0 0 40px rgba(255, 106, 0, 0.15)',
        'brand-lg': '0 0 80px rgba(255, 106, 0, 0.25)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 48px rgba(0, 0, 0, 0.14)',
        'soft': '0 2px 16px rgba(0, 0, 0, 0.06)',
        'orange-glow': '0 8px 32px rgba(255, 106, 0, 0.2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
