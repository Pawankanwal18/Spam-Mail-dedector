/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        midnight: {
          50: '#f0f4fd',
          100: '#dce5fb',
          200: '#bed0f7',
          300: '#91b1f2',
          400: '#5e8bec',
          500: '#3b66e3',
          600: '#2747d6',
          700: '#2036c0',
          800: '#1e2ea0',
          900: '#0e1738',
          950: '#070b1e',
        },
        cyber: {
          blue: '#2563eb',
          cyan: '#06b6d4',
          indigo: '#4f46e5',
          purple: '#7c3aed',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -4px rgba(6, 182, 212, 0.35)',
        'glow-indigo': '0 0 20px -4px rgba(99, 102, 241, 0.35)',
        'glow-emerald': '0 0 20px -4px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 20px -4px rgba(244, 63, 94, 0.35)',
      }
    },
  },
  plugins: [],
}