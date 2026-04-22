/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#004ac6',
        'primary-container': '#2563eb',
        'on-primary': '#ffffff',
        secondary: '#515f74',
        background: '#faf8ff',
        surface: '#faf8ff',
        'on-surface': '#191b23',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
