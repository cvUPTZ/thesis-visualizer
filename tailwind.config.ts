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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#2C3E50',
          light: '#34495E',
          foreground: '#FFFFFF',
        },
        editor: {
          bg: '#FFFFFF',
          'bg-accent': '#F8FAFC',
          border: '#E2E8F0',
          hover: '#F1F3F5',
          active: '#E9ECEF',
          text: '#1E293B',
          placeholder: '#94A3B8',
          accent: '#6366F1',
          'accent-hover': '#4F46E5',
          shadow: 'rgba(0, 0, 0, 0.05)',
          section: {
            bg: '#FFFFFF',
            border: '#E2E8F0',
            hover: '#F7FAFC'
          }
        },
      },
      backgroundImage: {
        'editor-gradient': 'linear-gradient(to right, #E2E8F0, #F8FAFC)',
        'section-gradient': 'linear-gradient(to bottom, #FFFFFF, #F8FAFC)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};