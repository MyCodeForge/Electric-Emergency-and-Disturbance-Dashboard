import type { App } from 'vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// Import ECharts modules
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  HeatmapChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  TitleComponent
} from 'echarts/components'

// Register ECharts modules
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  TitleComponent
])

export function setupECharts(app: App) {
  app.component('v-chart', ECharts)
} 