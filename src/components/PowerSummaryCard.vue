<template>
    <div class="power-summary-card">
      <h3>{{ title }}</h3>
      <div class="row">
        <div class="col">
            <img src="../assets/tower.png" alt="{{ value }} KwH">
            <p>{{ value }}</p>
        </div>
        <div class="col">
            <img src="../assets/tower.png" alt="{{ value }} KwH">
            <p>{{ value }}</p>
        </div>
        <div class="col">
            <img src="../assets/tower.png" alt="{{ value }} KwH">
            <p>{{ value }}</p>
        </div>
        <div class="col tower">
            <img src="../assets/tower.png" alt="{{ value }} KwH">
            <p>{{ value }}</p>
        </div>
      </div>
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
  .power-summary-card {
    padding: 10px;
    text-align: center;
  }
  
  h3 {
    margin-top: 0;
    font-weight: bold;
  }
  p {
    color: var(--primary-color);
    font-weight: bolder;
    font-size: 1.5em;
  }
  .tower {

  }
  </style>