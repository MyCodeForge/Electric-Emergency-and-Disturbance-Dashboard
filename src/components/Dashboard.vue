<template>
    <div class="content">
      <header class="row">
        <div class="logo col">
          <img src="../assets/logo.png" alt="Logo">
        </div>
        <div class="title">
          <h1>
            U.S. Electric Disturbance Events
          </h1>
        </div>
        <nav>
          <ul>
            <li>About This Project</li>
            <li><a href="https://github.com/MyCodeForge">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/patrickshawnhimes/">LinkedIn</a></li>
          </ul>
        </nav>
      </header>
  
      <div class="highlight-dash">
        <div class="row">
          <div class="filter-section col">
            <v-card class="filter-card">
              <v-card-text>
                <div class="filter-container">
                  <v-select
                    v-model="selectedMonth"
                    :items="availableMonths"
                    label="Filter by Month"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="filterEvents"
                    prepend-icon="mdi-calendar-month"
                  ></v-select>

                  <v-select
                    v-model="selectedYear"
                    :items="availableYears"
                    label="Filter by Year"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="filterEvents"
                    prepend-icon="mdi-calendar"
                  ></v-select>

                  <v-select
                    v-model="selectedRegion"
                    :items="availableRegions"
                    label="Filter by Region"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="filterEvents"
                    prepend-icon="mdi-map-marker"
                  ></v-select>

                  <v-select
                    v-model="selectedEventType"
                    :items="availableEventTypes"
                    label="Filter by Event Type"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="filterEvents"
                    prepend-icon="mdi-flash"
                  ></v-select>
                </div>
              </v-card-text>
            </v-card>
          </div>
          <div class="mascot col">
            <img src="../assets/mascot-looking.jpeg" alt="Mascot">
          </div>
        </div>

        <div class="row">
          <div class="widgets col">
            <div class="widget">
              <div class="power-summary-section">
                <PowerSummaryCard 
                  title="Demand Loss (MW)" 
                  :metrics="demandLossMetrics" 
                  unit="MW" 
                />
              </div>
            </div>
            <div class="widget">
              <div class="power-summary-section">
                <PowerSummaryCard 
                  title="Customers Affected" 
                  :metrics="customersAffectedMetrics" 
                />
              </div>
            </div>
          </div>
          <div class="col">
            <div class="widget">
              <div class="chart-section">
                <RingChart :chartData="eventTypeData" :options="eventTypeOptions" />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="widgets col">
            <div class="widget">
              <div class="chart-section">
                <EventChart :events="filteredEvents" />
              </div>
            </div>
          </div>

          <div class="widgets col">
            <div class="widget">
              <div class="map-section">
                <h3>NERC Regions Map</h3>
                <img src="../assets/nerc-regions.svg" alt="NERC Regions Map" class="nerc-map">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="chart-section col widgets">
            <ImpactScatterChart title="Demand Loss vs Customers Affected" :events="filteredEvents" />
          </div>
        </div>
      </div>
      
      <div class="dashboard">
        <div class="row">
          <div class="table-section col">
            <EventTable :events="filteredEvents" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import EventChart from './EventChart.vue';
  import EventTable from './EventTable.vue';
  import SummaryCard from './SummaryCard.vue';
  import PowerSummaryCard from './PowerSummaryCard.vue';
  import RingChart from './RingChart.vue';
  import ImpactScatterChart from './ImpactScatterChart.vue';
  import { apiService } from '../services/api.service';
  import { statisticsService } from '../services/statistics.service';
  import type { DisturbanceEvent, SummaryMetrics } from '../types/api';
  
  const allEvents = ref<DisturbanceEvent[]>([]);
  const filteredEvents = ref<DisturbanceEvent[]>([]);
  const totalEvents = ref<number>(0);
  const demandLossMetrics = ref<SummaryMetrics>({ min: 0, max: 0, average: 0 });
  const customersAffectedMetrics = ref<SummaryMetrics>({ min: 0, max: 0, average: 0 });
  const availableYears = ref<number[]>([]);
  const availableMonths = ref<string[]>([]);
  const availableRegions = ref<string[]>([]);
  const availableEventTypes = ref<string[]>([]);
  const selectedYear = ref<string>('');
  const selectedMonth = ref<string>('');
  const selectedRegion = ref<string>('');
  const selectedEventType = ref<string>('');
  
  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  onMounted(async () => {
    try {
      const data = await apiService.getDisturbanceEvents({}); // Fetch all events initially
      // Extract year and add it to each event
      allEvents.value = data.map(event => ({
        ...event,
        year: event.date_event_began ? new Date(event.date_event_began).getFullYear() : undefined,
      }));
      filteredEvents.value = [...allEvents.value]; // Initialize filtered events
  
      // Get unique months for the filter
      availableMonths.value = [...new Set(allEvents.value.map(event => event.month).filter(month => month !== undefined))]
        .sort((a, b) => {
          const indexA = monthOrder.indexOf(a);
          const indexB = monthOrder.indexOf(b);
          return indexA - indexB;
        });

      // Get unique years for the filter
      availableYears.value = [...new Set(allEvents.value.map(event => event.year).filter(year => year !== undefined) as number[])].sort((a, b) => a - b);
      
      // Get unique Regions for the filter
      availableRegions.value = [...new Set(allEvents.value.map(event => event.nerc_region).filter(nerc_region => nerc_region !== undefined))].sort();
      
      // Get unique Event Types for the filter
      availableEventTypes.value = [...new Set(allEvents.value.map(event => event.event_type).filter(event_type => event_type !== undefined))].sort();

      // Update metrics
      updateMetrics(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

  const updateMetrics = (events: DisturbanceEvent[]) => {
    if (events) {
      totalEvents.value = events.length;
      const metrics = statisticsService.calculateAllMetrics(events);
      demandLossMetrics.value = metrics.demand_loss_in_mw;
      customersAffectedMetrics.value = metrics.customers_affected;
    }
  };

  const filterEvents = () => {
    filteredEvents.value = allEvents.value.filter(event => {
      // Check year filter
      if (selectedYear.value && String(event.year) !== selectedYear.value) {
        return false;
      }
      
      // Check month filter
      if (selectedMonth.value && event.month !== selectedMonth.value) {
        return false;
      }
      
      // Check region filter
      if (selectedRegion.value && event.nerc_region !== selectedRegion.value) {
        return false;
      }
      
      // Check event type filter
      if (selectedEventType.value && event.event_type !== selectedEventType.value) {
        return false;
      }
      
      return true;
    });

    // Update metrics based on filtered events
    updateMetrics(filteredEvents.value);
  };
  
  const eventTypeData = ref({
    labels: ['Transmission Line Outage', 'Substation Failure', 'Severe Weather', 'Equipment Malfunction'],
    datasets: [
      {
        data: [150, 80, 200, 39],
        backgroundColor: ['#f2b16f', '#f9c492', '#65aba9', '#71bcb7'],
        borderWidth: 1,
        borderColor: ['#fff', '#fff', '#fff', '#fff'],
        cutout: '50%',
      },
    ],
  });

  const eventTypeOptions = ref({
    plugins: {
      legend: {
        position: 'right' as 'right',
      },
      title: {
        display: true,
        text: 'Distribution of Event Types',
      },
    },
  });
  </script>
  
  <style scoped>
  .dashboard {
    font-family: sans-serif;
    padding: 20px;
  }
  
  .summary-section {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  
  .chart-section,
  .table-section {
    margin-bottom: 20px;
  }

  .map-section {
    padding: var(--spacing-sm);
    text-align: center;
  }

  .map-section h3 {
    margin-bottom: var(--spacing-sm);
    color: var(--text-color);
  }

  .nerc-map {
    width: 100%;
    height: auto;
    max-width: 800px;
    border-radius: var(--border-radius-sm);
  }

  .filter-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .filter-card {
    background-color: var(--card-bg) !important;
    border-radius: var(--border-radius-sm) !important;
  }

  :deep(.v-field) {
    border-radius: var(--border-radius-sm) !important;
  }

  :deep(.v-select) {
    margin-bottom: var(--spacing-xs);
  }
  </style>