/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./frontend/src/**/*.{html,ts}', './libs/**/src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0da6f2',
        'primary-dark': '#0b84c7',
        'background-light': '#f5f7f8',
        'background-dark': '#101c22',
        'slate-dark': '#0f172a',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['2.25rem', { lineHeight: '2.5rem', fontWeight: '900' }],
        h2: ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        h3: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
      },
      borderRadius: {
        input: '0.5rem',
        button: '0.75rem',
      },
      spacing: {
        input: '0.75rem',
        button: '0.625rem',
      },
    },
  },
  plugins: [],
};
