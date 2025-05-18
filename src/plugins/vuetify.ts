import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#f09e54',    // Your primary color
          secondary: '#65aba9',  // Your secondary color
          background: '#ffffff', // Background color
          surface: '#f8f9fa',   // Surface color for cards
        },
      },
    },
  },
}) 