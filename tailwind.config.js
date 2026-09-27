/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        polar: {
          950: '#040810',
          900: '#070d18',
          850: '#0b1322',
          800: '#0f1a2e',
          750: '#14223b',
          700: '#192b49',
          600: '#23395d',
          500: '#33507d',
          400: '#4c71a8',
          300: '#7398cf',
          200: '#a5c2eb',
          100: '#dbe7fb',
          50: '#f0f5fd',
        },
        arctic: {
          cyan: '#06d6a0',
          ice: '#38bdf8',
          glow: '#00f2fe',
          frost: '#e2f3ff',
        },
        telemetry: {
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          cyan: '#06b6d4',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.4)',
        'glow-blue': '0 0 15px -3px rgba(56, 189, 248, 0.4)',
        'glow-red': '0 0 20px -2px rgba(239, 68, 68, 0.5)',
        'glow-amber': '0 0 15px -3px rgba(245, 158, 11, 0.4)',
        'glow-green': '0 0 15px -3px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
