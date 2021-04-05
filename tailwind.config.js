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
