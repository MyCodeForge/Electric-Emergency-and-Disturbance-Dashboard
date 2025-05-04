<template>
    <div class="event-table">
      <h2>Event Details</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Date Event Began</th>
            <th>Time Event Began</th>
            <th>Area Affected</th>
            <th>NERC Region</th>
            <th>Event Type</th>
            <th>Customers Affected</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="event in topEvents" :key="event.id">
            <td>{{ event.month }}</td>
            <td>{{ event.date_event_began }}</td>
            <td>{{ event.time_event_began }}</td>
            <td>{{ event.area_affected }}</td>
            <td>{{ event.nerc_region }}</td>
            <td>{{ event.event_type }}</td>
            <td>{{ event.customers_affected }}</td>
            </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
    import { DisturbanceEvent } from '../types/api';
    import { computed } from "vue";
    
    const props = defineProps({
        events: {
        type: Array<DisturbanceEvent>,
        required: true,
        },
    });
    const topEvents = computed(() => {
        return props.events.slice(0, 5);
    });
  </script>
  
  <style scoped>
  .event-table {
    width: 100%;
    overflow-x: auto; /* Enable horizontal scrolling on smaller screens */
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    padding: 8px;
    border: 1px solid #ccc;
    text-align: left;
  }
  
  th {
    color: var(--primary-color);
    font-weight: bolder;
  }
  </style>