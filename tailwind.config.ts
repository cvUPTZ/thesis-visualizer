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
          bg: '#F8F9FA',
          'bg-accent': '#F1F0FB',
          border: '#E9ECEF',
          hover: '#F1F3F5',
          active: '#E9ECEF',
          text: '#495057',
          placeholder: '#ADB5BD',
          accent: '#9b87f5',
          'accent-hover': '#8B5CF6',
          shadow: 'rgba(0, 0, 0, 0.05)',
          section: {
            bg: '#FFFFFF',
            border: '#E2E8F0',
            hover: '#F7FAFC'
          }
        },
      },
      backgroundImage: {
        'editor-gradient': 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)',
        'section-gradient': 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
