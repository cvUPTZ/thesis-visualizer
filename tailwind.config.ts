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
        '2xl': '1450px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
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
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        },
        admin: {
          bg: '#1A1F2C',
          card: '#2A2F3C',
          accent: {
            primary: '#1A1F2C',
            secondary: '#2A2F3C',
            tertiary: '#7E69AB',
          }
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
          },
          manager: {
            figure: {
              bg: '#EEF2FF',
              border: '#C7D2FE',
              icon: '#6366F1'
            },
            table: {
              bg: '#F0FDF4',
              border: '#BBF7D0',
              icon: '#22C55E'
            },
            citation: {
              bg: '#FEF2F2',
              border: '#FECACA',
              icon: '#EF4444'
            },
            reference: {
              bg: '#FFF7ED',
              border: '#FDBA74',
              icon: '#F97316'
            }
          }
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        dark: {
          bg: '#1A1F2C',
          card: '#2A2F3C',
          text: '#E2E8F0',
          'text-muted': '#94A3B8',
          border: '#2D3748',
          accent: '#6366F1',
          'accent-hover': '#4F46E5',
        },
      },
      backgroundImage: {
        'editor-gradient': 'linear-gradient(to right, #E2E8F0, #F8FAFC)',
        'section-gradient': 'linear-gradient(to bottom, #FFFFFF, #F8FAFC)',
        'title-gradient': 'linear-gradient(to bottom, #FFFFFF, #F8FAFC)',
        'admin-gradient': 'linear-gradient(to right, #1A1F2C, #2A2F3C)',
        'hero-gradient': 'linear-gradient(to bottom right, #1A1F2C, #2A2F3C)',
        'card-hover': 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        'soft-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
