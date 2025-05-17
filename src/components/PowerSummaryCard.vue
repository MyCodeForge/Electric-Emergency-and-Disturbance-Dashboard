<template>
    <div class="power-summary-card">
      <h3>{{ title }}</h3>
      <div class="metrics-grid">
        <div class="metric">
          <img src="../assets/tower.png" alt="Minimum">
          <div class="metric-details">
            <span class="metric-label">Min</span>
            <p class="metric-value">{{ formatValue(metrics.min) }}</p>
          </div>
        </div>
        <div class="metric">
          <img src="../assets/tower.png" alt="Maximum">
          <div class="metric-details">
            <span class="metric-label">Max</span>
            <p class="metric-value">{{ formatValue(metrics.max) }}</p>
          </div>
        </div>
        <div class="metric">
          <img src="../assets/tower.png" alt="Average">
          <div class="metric-details">
            <span class="metric-label">Average</span>
            <p class="metric-value">{{ formatValue(metrics.average) }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { SummaryMetrics } from '../types/api';
  
  const props = defineProps<{
    title: string;
    metrics: SummaryMetrics;
    unit?: string;
  }>();
  
  const formatValue = (value: number | undefined): string => {
    if (value === undefined) return '0';
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(0);
  };
  </script>
  
  <style scoped>
  .power-summary-card {
    padding: var(--spacing-sm);
    text-align: center;
    background-color: var(--card-bg);
    border-radius: var(--border-radius-sm);
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: var(--spacing-sm);
    color: var(--text-color);
    font-weight: bold;
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
  }
  
  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-xs);
  }
  
  .metric img {
    width: 40px;
    height: 40px;
    margin-bottom: var(--spacing-xs);
  }
  
  .metric-details {
    text-align: center;
  }
  
  .metric-label {
    display: block;
    color: var(--text-color);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xs);
  }
  
  .metric-value {
    color: var(--primary-color);
    font-weight: bold;
    font-size: var(--font-size-lg);
    margin: 0;
  }
  </style>