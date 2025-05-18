import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { setupECharts } from './plugins/echarts'
import vuetify from './plugins/vuetify'

const app = createApp(App)
setupECharts(app)
app.use(vuetify)
app.mount('#app')
