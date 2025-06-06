/*📁 tailwind.config.js */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // ← Activa el modo oscuro por clase
  theme: {
    extend: {
      colors: {
        jade: '#00796B',
        coral: '#FF7043',
        verdePastel: '#C8E6C9',
        rosadoSuave: '#FBE9E7',
        beige: '#FFF3E0',
        madera: '#4E342E',
      },
      keyframes: {
        fondo: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fondo: 'fondo 15s ease infinite',
        fade: 'fadeIn 0.5s ease-out',
      },
    },
  },
  plugins: [],
};

  

