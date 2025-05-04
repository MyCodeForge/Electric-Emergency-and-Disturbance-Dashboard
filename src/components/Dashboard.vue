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
          <div class="widget filter-section">
            <label for="year-filter">Filter by: </label>
            <select id="month-filter" v-model="selectedMonth" @change="filterEventsByMonth">
              <option value="">All Months</option>
              <option :value="month" v-for="month in availableMonths" :key="month">{{ month }}</option>
            </select>
            |
            <select id="year-filter" v-model="selectedYear" @change="filterEventsByYear">
              <option value="">All Years</option>
              <option :value="year" v-for="year in availableYears" :key="year">{{ year }}</option>
            </select>
            |
            <select id="region-filter" v-model="selectedRegion" @change="filterEventsByRegion">
              <option value="">All Regions</option>
              <option :value="region" v-for="region in availableRegions" :key="region">{{ region }}</option>
            </select>
            |
            <select id="event-filter" v-model="selectedEventType" @change="filterEventsByEventType">
              <option value="">All Event Types</option>
              <option :value="eventtype" v-for="eventtype in availableEventTypes" :key="eventtype">{{ eventtype }}</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="mascot col">
            <img src="../assets/mascot-looking.jpeg" alt="Mascot">
          </div>
          
          <div class="widgets col">
            <div class="widget">
              <div class="power-summary-section">
                <PowerSummaryCard title="Average Demand Loss" :value="totalEvents" />
              </div>
            </div>
            <div class="widget">
              <div class="chart-section">
                <RingChart :chartData="eventTypeData" :options="eventTypeOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard">
        <div class="row">
          <div class="col">
            
            <div class="chart-section">
              <EventChart :events="filteredEvents" />
            </div>
          </div>

          <div class="col">
            <div class="summary-section">
              <SummaryCard title="Total Events" :value="totalEvents" />
              <SummaryCard title="Average Demand Loss" :value="averageDemandLoss" />
            </div>
            <div class="summary-section">
              <SummaryCard title="Total Events" :value="totalEvents" />
              <SummaryCard title="Average Demand Loss" :value="averageDemandLoss" />
            </div>
            <div class="summary-section">
              <SummaryCard title="Total Events" :value="totalEvents" />
              <SummaryCard title="Average Demand Loss" :value="averageDemandLoss" />
            </div>
          </div>
        </div>
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
  import { apiService } from '../services/api.service';
  import { DisturbanceEvent } from '../types/api';
  
  const allEvents = ref<DisturbanceEvent[]>([]);
  const filteredEvents = ref<DisturbanceEvent[]>([]);
  const totalEvents = ref<number>(0);
  const averageDemandLoss = ref<number>(0);
  const availableYears = ref<number[]>([]);
  const availableMonths = ref<string[]>([]);
  const availableRegions = ref<string[]>([]);
  const availableEventTypes = ref<string[]>([]);
  const selectedYear = ref<string>('');
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

      // count total events and calculate averageDemandLoss
      if (data) {
        totalEvents.value = data.length || 0;
        let totalDemandLoss = data.reduce((sum, event) => {
          let demand_loss_in_mw = event.demand_loss_in_mw
          if ( typeof demand_loss_in_mw !== 'number')
            demand_loss_in_mw = 0;
          
          return sum + demand_loss_in_mw;
        }, 0);

        averageDemandLoss.value = totalEvents.value > 0 ? totalDemandLoss / totalEvents.value : 0;
        averageDemandLoss.value = Number(averageDemandLoss.value).toFixed(2);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error (e.g., display an error message)
    }
  });
  
  const filterEventsByYear = () => {
    if (selectedYear.value === '') {
      filteredEvents.value = [...allEvents.value];
    } else {
      filteredEvents.value = allEvents.value.filter(event => String(event.year) === selectedYear.value);
    }
  };
  
  const eventTypeData = ref({
    labels: ['Transmission Line Outage', 'Substation Failure', 'Severe Weather', 'Equipment Malfunction'],
    datasets: [
      {
        data: [150, 80, 200, 39],
        backgroundColor: ['#f2b16f', '#f9c492', '#65aba9', '#71bcb7'],
        borderWidth: 1,
        borderColor: '#fff',
        cutout: '50%', // You can also set the cutout here if you prefer
      },
    ],
  });

  const eventTypeOptions = ref({
    plugins: {
      legend: {
        position: 'right',
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
  </style>