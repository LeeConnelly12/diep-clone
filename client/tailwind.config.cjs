const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
