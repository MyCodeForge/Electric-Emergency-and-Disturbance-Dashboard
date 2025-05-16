import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { setupECharts } from './plugins/echarts'

const app = createApp(App)
setupECharts(app)
app.mount('#app')
