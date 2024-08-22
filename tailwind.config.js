/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'gray-dfdfef': '#DFDFEF',
        'blue-8': '#5468b3',
        'navy-1': '#2e3652',
        'navy-2': '#364061',
        'navy-3': '#3d486c',
        'navy-4': '#445175',
        'ocean-blue': '#60a5fa',
        'navy-5': '#4b5a81',
        'ssecondary': '#6c757d',
      },
      textShadow: {
        'default': '2px 2px 4px rgba(0, 0, 0, 0.1)',
        'md': '3px 3px 6px rgba(0, 0, 0, 0.2)',
        'lg': '4px 4px 8px rgba(0, 0, 0, 0.3)',
        'xl': '5px 5px 10px rgba(0, 0, 0, 0.4)',
        'dark-lg': '4px 4px 8px rgba(255, 255, 255, 0.3)',
        'dark-xl': '5px 5px 10px rgba(255, 255, 255, 0.4)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),

    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-md': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-xl': {
          textShadow: '5px 5px 10px rgba(0, 0, 0, 0.4)',
        },
        '.text-shadow-dark-lg': {
          textShadow: '4px 4px 8px rgba(255, 255, 255, 0.3)',
        },
        '.text-shadow-dark-xl': {
          textShadow: '5px 5px 10px rgba(255, 255, 255, 0.4)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover', 'dark']);
    },
  ],
};