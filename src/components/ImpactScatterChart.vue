<!-- A scatter plot showing relationship between demand loss and customers affected -->
<template>
  <div class="impact-scatter">
    <h2>Event Impact Analysis</h2>
    <v-chart class="chart" :option="chartOption" autoresize />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DisturbanceEvent } from '../types/api';

const props = defineProps<{
  events: DisturbanceEvent[];
  title: string;
}>();

const chartOption = computed(() => {
  // Calculate data ranges
  const demandLossValues = props.events
    .map(event => parseFloat(event.demand_loss_in_mw || '0'))
    .filter(val => !isNaN(val) && isFinite(val));
  const customerValues = props.events
    .map(event => event.customers_affected || 0)
    .filter(val => isFinite(val));
  
  const maxDemandLoss = Math.ceil(Math.max(...demandLossValues));
  const maxCustomers = Math.ceil(Math.max(...customerValues));

  // Get computed styles for colors
  const style = getComputedStyle(document.documentElement);
  const primaryColor = style.getPropertyValue('--primary-color').trim();
  const secondaryColor = style.getPropertyValue('--secondary-color').trim();
  const tertiaryColor = style.getPropertyValue('--tertiary-color').trim();
  const shadowColor = style.getPropertyValue('--shadow-color').trim();

  return {
    title: {
      text: props.title,
      left: 'center',
      top: 0,
      textStyle: {
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--font-size-lg)'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params: any) {
        return `Event Type: ${params.data[2]}<br/>
                Demand Loss: ${params.data[0]} MW<br/>
                Customers Affected: ${params.data[1]}<br/>
                Region: ${params.data[3]}`;
      },
      textStyle: {
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--font-size-base)'
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      },
      right: 10
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'empty',
        borderColor: secondaryColor,
        fillerColor: primaryColor,
        handleStyle: {
          color: primaryColor,
          borderColor: secondaryColor
        },
        selectedDataBackground: {
          lineStyle: {
            color: primaryColor
          },
          areaStyle: {
            color: secondaryColor
          }
        }
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'empty',
        borderColor: secondaryColor,
        fillerColor: primaryColor,
        handleStyle: {
          color: primaryColor,
          borderColor: secondaryColor
        },
        selectedDataBackground: {
          lineStyle: {
            color: primaryColor
          },
          areaStyle: {
            color: secondaryColor
          }
        }
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'empty'
      }
    ],
    legend: {
      top: '10%'
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'Demand Loss (MW)',
      nameLocation: 'middle',
      nameGap: 25,
      max: maxDemandLoss,
      axisLabel: {
        formatter: '{value} MW',
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--font-size-base)'
      },
      nameTextStyle: {
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--font-size-base)',
        padding: [10, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      name: 'Customers Affected',
      nameLocation: 'middle',
      nameGap: 80,
      max: maxCustomers,
      axisLabel: {
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--font-size-base)'
      },
      nameTextStyle: {
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--font-size-base)',
        padding: [0, 0, 10, 0]
      }
    },
    series: [{
      type: 'scatter',
      name: 'Events',
      data: props.events.map(event => [
        parseFloat(event.demand_loss_in_mw || '0'),
        event.customers_affected || 0,
        event.event_type || 'Unknown',
        event.nerc_region || 'Unknown'
      ]),
      symbolSize: 10,
      itemStyle: {
        color: primaryColor,
        borderColor: secondaryColor,
        borderWidth: 1
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          color: tertiaryColor,
          shadowBlur: 10,
          shadowColor: shadowColor
        }
      }
    }]
  };
});
</script>

<style scoped>
.impact-scatter {
  background-color: var(--card-bg);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  margin: var(--spacing-sm) 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.chart {
  flex: 1;
  min-height: 400px;
  width: 100%;
}

h2 {
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
  text-align: center;
}
</style> 