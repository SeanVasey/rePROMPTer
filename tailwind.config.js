/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: '#1A1A1E',
          secondary: '#2A2A2E',
          tertiary: '#323238',
          border: '#3A3A3E',
        },
        accent: {
          DEFAULT: '#E63946',
          dark: '#8B0000',
          light: '#FF4D5A',
        },
        muted: '#9A9AAA',
        'muted-dark': '#5A5A5E',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
