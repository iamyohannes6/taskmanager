/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#EAEAEA',
          100: '#BEBEBF',
          200: '#929293',
          300: '#666667',
          400: '#3D3D3E',
          500: '#141415',
          600: '#121212',
          700: '#0E0E0F',
          800: '#0B0B0C',
          900: '#080808',
        },
        primary: {
          DEFAULT: '#4C6FFF',
          50: '#EEF1FF',
          100: '#E0E7FF',
          200: '#C7D1FF',
          300: '#9EAFFF',
          400: '#7A8FFF',
          500: '#4C6FFF',
          600: '#1C47FF',
          700: '#0031EB',
          800: '#0027B8',
          900: '#001C85',
        },
        accent: {
          purple: '#8B5CF6',
          blue: '#4C6FFF',
          green: '#22C55E',
          pink: '#EC4899',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))',
        'glass-gradient-dark': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))',
      },
      boxShadow: {
        'task': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

