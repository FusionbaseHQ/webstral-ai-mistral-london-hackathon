/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryLight: '#4c1d95',
        primary: '#86198f',
        primaryHover: '#581c87',
        secondary: '#115e59',
        secondaryHover: '#134e4a',
        body: '#FFFFFF',
        bodyDark: colors.black,
        text: colors.gray[900],
        subtext: colors.gray[500],
        textDark: colors.slate[100],
        subtextDark: colors.slate[400],
        muted: colors.gray[200],
        mutedDark: colors.slate[800]
      },
      transitionProperty: {
        'width': 'width'
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.2xl'), fontWeight: theme('fontWeight.bold') },
        'h2': { fontSize: theme('fontSize.xl'), fontWeight: theme('fontWeight.semiBold') },
        'h3': { fontSize: theme('fontSize.lg'), fontWeight: theme('fontWeight.medium') },
        'h4': { fontSize: theme('fontSize.md'), fontWeight: theme('fontWeight.medium') },
      })
    })
  ]
}