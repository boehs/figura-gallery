const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    enabled: true,
    mode: 'all',
    preserveHtmlElements: false,
    content: [
      './views/**/*.ejs'
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      blue: colors.lightBlue,
      green: colors.green,
      lime: colors.lime,
      gray: colors.blueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      pink: colors.pink,
      purple: colors.purple,
    },
    maxWidth: {
      '10r': '10rem',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
