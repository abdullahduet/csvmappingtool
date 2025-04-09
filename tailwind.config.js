/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2c5282',
          50: '#f0f5fa',
          100: '#dae5f3',
          200: '#b8d0e8',
          300: '#8bb3d9',
          400: '#5d8fc6',
          500: '#3e71b3',
          600: '#2c5282', // Primary
          700: '#234069',
          800: '#1c3354',
          900: '#162941',
          950: '#0f1b29',
        },
        secondary: {
          DEFAULT: '#4299e1',
          50: '#f0f7fe',
          100: '#e0eefb',
          200: '#bddcf7',
          300: '#8cc3f1',
          400: '#59a7e9',
          500: '#4299e1', // Secondary
          600: '#2174b8',
          700: '#1b5c96',
          800: '#194c7c',
          900: '#184169',
          950: '#112942',
        },
        accent: {
          DEFAULT: '#ebf8ff',
          50: '#f0faff',
          100: '#ebf8ff', // Accent
          200: '#d0ecfe',
          300: '#a8dafc',
          400: '#76c0f9',
          500: '#4aa0f4',
          600: '#2979e8',
          700: '#1c61d4',
          800: '#1c50ab',
          900: '#1c4587',
          950: '#152a51',
        },
        text: {
          DEFAULT: '#2d3748',
          50: '#f7f8f9',
          100: '#eef0f2',
          200: '#d5dae0',
          300: '#b3bcc7',
          400: '#8997a9',
          500: '#69798d',
          600: '#516176',
          700: '#424f61',
          800: '#384151',
          900: '#2d3748', // Text
          950: '#1a202c',
        },
        border: {
          DEFAULT: '#cbd5e0',
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#cbd5e0', // Border
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#0d1116',
        },
        success: {
          DEFAULT: '#48bb78',
          50: '#f0fdf5',
          100: '#dcfce8',
          200: '#bbf7d1',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#48bb78', // Success
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        error: {
          DEFAULT: '#f56565',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#f56565', // Error
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        heading: ['Inter', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      backgroundColor: {
        app: '#f8fafc',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'card': '0.75rem',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text.DEFAULT'),
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            h1: {
              color: theme('colors.text.900'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.text.900'),
              fontWeight: '600',
            },
            h3: {
              color: theme('colors.text.900'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.text.900'),
              fontWeight: '600',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Add this plugin for better typography
    require('@tailwindcss/forms'),      // Add this plugin for better form elements
  ],
}