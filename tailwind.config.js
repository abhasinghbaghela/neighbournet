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
        // CivicQuest Primary Signature Colors (Pine Teal as seen in screenshots)
        pine: {
          950: '#02211d',
          900: '#04342e',
          850: '#06433b',
          800: '#09544c', // Primary prototype dark teal button & active item
          750: '#0b5f56',
          700: '#0d6b60',
          600: '#0f766e',
          500: '#14b8a6',
          400: '#2dd4bf',
          300: '#5eead4',
          200: '#99f6e4',
          100: '#ccfbf1',
          50: '#f0fdfa',
        },
        civic: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          muted: '#64748b',
          text: '#0f172a',
          darkBg: '#090d13',
          darkCard: '#111722',
          darkBorder: '#1e293b'
        },
        charcoal: {
          950: '#0E1015',
          900: '#141720',
          850: '#181C26',
          800: '#1E2230',
          750: '#252A3B',
          700: '#2E344A',
          600: '#3F4765',
          500: '#5A648A',
        },
        violet: {
          950: '#2e1065',
          900: '#4c1d95',
          800: '#5b21b6',
          700: '#6d28d9',
          600: '#7c3aed',
          500: '#8b5cf6',
          400: '#a78bfa',
          300: '#c4b5fd',
          200: '#ddd6fe',
          100: '#ede9fe',
          50: '#f5f3ff',
        },
        lavender: {
          50: '#FAF8FF',
          100: '#F5F0FF',
          200: '#EBE2FF',
          300: '#DDD6FE',
          400: '#C4B5FD',
          500: '#A78BFA',
          600: '#8B5CF6',
        }
      },
      boxShadow: {
        'civic-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'civic-card': '0 2px 8px -1px rgba(0, 0, 0, 0.06), 0 1px 3px -1px rgba(0, 0, 0, 0.04)',
        'pine-glow': '0 0 20px -3px rgba(9, 84, 76, 0.3)',
        'pine-sm': '0 2px 8px -2px rgba(9, 84, 76, 0.25)',
        'violet-glow': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'violet-sm': '0 0 15px -3px rgba(124, 58, 237, 0.25)',
        'charcoal-card': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
