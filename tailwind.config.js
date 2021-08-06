module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          850: '#212121',
          750: '#313131'
        },
        purple: {
          550: '#892CDC'
        }
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled']
    },
  },
  plugins: [],
}
