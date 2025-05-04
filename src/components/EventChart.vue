<template>
    <div class="event-chart">
      <h2>Events by Month</h2>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'; // Import watch
  import { Chart, registerables } from 'chart.js';
  import { DisturbanceEvent } from '../types/api';
  import { PropType } from 'vue'; // Keep the PropType import
  
  Chart.register(...registerables);
  
  const chartCanvas = ref<HTMLCanvasElement | null>(null);
  let myChart: Chart | null = null;
  
  const props = defineProps({ // Keep defineProps as is
    events: {
      type: Array as PropType<DisturbanceEvent[]>,
      required: true,
    },
  });
  
  onMounted(() => {
    createChart();
  });
  
  const createChart = () => {
    if (!chartCanvas.value) return;
  
    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) return;
  
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const eventCounts = months.map((month) =>
      props.events.filter((event) => event.month === month).length
    );
  
    if (myChart) {
      myChart.destroy(); // Destroy existing chart if it exists
    }
  
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Number of Events',
            data: eventCounts,
            backgroundColor: 'rgba(240, 158, 84, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Events',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };
  
  watch(() => props.events, () => { // Access events directly
    createChart();
  });
  </script>
  
  <style scoped>
  .event-chart {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  
  canvas {
    max-height: 300px;
  }
  </style>