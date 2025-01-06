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
          500: '#3b82f6',
          600: '#2563eb',
        },
        dark: {
          200: '#94a3b8',
          300: '#64748b',
          400: '#475569',
          500: '#334155',
          600: '#1e293b',
          700: '#0f172a',
          800: '#020617',
          900: '#080808',
        },
        accent: {
          blue: '#60a5fa',
          green: '#34d399',
          red: '#f87171',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 