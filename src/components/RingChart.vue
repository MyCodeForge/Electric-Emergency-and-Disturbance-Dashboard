<template>
  <div>
    <canvas ref="ringChartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, ArcElement, DoughnutController, ChartOptions, ChartData } from 'chart.js';

// Register the necessary controllers and elements
Chart.register(ArcElement, DoughnutController);

const ringChartCanvas = ref<HTMLCanvasElement | null>(null);
let ringChartInstance: Chart | null = null;

interface RingChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth?: number;
    borderColor?: string[];
    cutout?: string | number;
    circumference?: number;
    rotation?: number;
  }[];
}

interface RingChartOptions extends ChartOptions<'doughnut'> {}

const props = defineProps<{
  chartData: RingChartData;
  options?: RingChartOptions;
}>();

onMounted(() => {
  if (ringChartCanvas.value) {
    renderChart();
  }
});

const renderChart = () => {
  if (ringChartInstance) {
    ringChartInstance.destroy(); // Destroy existing chart if any
  }

  const defaultOptions: RingChartOptions = {
    cutout: '50%', // This creates the 'ring' effect. Adjust the percentage as needed.
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.formattedValue || '';
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? Math.round((parseFloat(value) / total) * 100) + '%' : '0%';
            return `${label}: ${value} (${percentage})`;
          },
        },
      },
    },
  };

  const chartOptions = { ...defaultOptions, ...props.options };

  ringChartInstance = new Chart(ringChartCanvas.value.getContext('2d')!, {
    type: 'doughnut',
    data: props.chartData,
    options: chartOptions,
  });
};
</script>

<style scoped>
canvas {
  max-height: 300px; /* Adjust as needed */
}
</style>