/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#134156', //색상 지정해놓으면 tailwind에서 해당 색상 사용가능
      },
    },
  },
  plugins: [],
};
