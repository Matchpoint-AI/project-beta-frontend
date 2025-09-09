/** @type {import('tailwindcss').Config} */
module.exports = {
  // important: true,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  darkMode: '', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(180deg, #F1FDFF 0%, #F1EAFF 56.5%, #F5D9FF 100%)',
      },
      colors: {
        'main-purple': '#5145cd',
      },
      screens: {
        '2xs': '400px',
        xs: '500px',
      },
    },
  },
  plugins: [
    //    require('flowbite/plugin'),
  ],
};
