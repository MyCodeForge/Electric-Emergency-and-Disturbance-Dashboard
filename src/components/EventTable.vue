<template>
  <div class="event-table">
    <v-card>
      <v-card-title>
        Event Details
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="comfortable"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="events"
        :search="search"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.date_event_began="{ item }">
          {{ formatDate(item.date_event_began) }}
        </template>
        <template v-slot:item.time_event_began="{ item }">
          {{ formatTime(item.time_event_began) }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DisturbanceEvent } from '../types/api';

const props = defineProps<{
  events: DisturbanceEvent[];
}>();

const search = ref('');

const headers = [
  { title: 'Month', key: 'month' },
  { title: 'Date', key: 'date_event_began' },
  { title: 'Time', key: 'time_event_began' },
  { title: 'Area Affected', key: 'area_affected' },
  { title: 'NERC Region', key: 'nerc_region' },
  { title: 'Event Type', key: 'event_type' },
  { title: 'Customers Affected', key: 'customers_affected' },
];

const formatDate = (date: string | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

const formatTime = (time: string | undefined) => {
  if (!time) return '';
  return time;
};
</script>

<style scoped>
.event-table {
  margin: var(--spacing-md) 0;
}

:deep(.v-data-table) {
  background-color: var(--card-bg) !important;
}

:deep(.v-card-title) {
  font-family: var(--font-family-primary);
  color: var(--text-color);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

:deep(.v-text-field) {
  max-width: 300px;
}
</style>