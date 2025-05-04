<template>
    <div class="summary-card">
      <h3>{{ title }}</h3>
      <p>{{ value }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .summary-card {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
    width: 200px;
  }
  
  h3 {
    margin-top: 0;
    font-weight: bold;
  }
  p {
    color: var(--primary-color);
    font-weight: bolder;
    font-size: 4em;
  }
  </style>