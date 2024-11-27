<template>
  <div>
    <h1>Workers List</h1>
    <WorkerInput @worker-added="fetchWorkers" />
    <div>
      <h2>All Workers</h2>
      <ul v-if="workers && workers.length">
        <li v-for="worker in workers" :key="worker.employeeId">
          <strong>Name:</strong> {{ worker.name }} |
          <strong>Koormus:</strong> {{ worker.workLoad }} |
          <strong>24h Shift Last Day:</strong> {{ worker.lastMonthLastDayHours ? 'Yes' : 'No' }} |
          <strong>Vacation Days:</strong> {{ worker.vacationDays.join(', ') }} |
          <strong>Desired Vacation Days:</strong> {{ worker.desiredVacationDays.join(', ') }} |
          <strong>Desired Work Days:</strong> {{ worker.desiredWorkDays.map(w => `${w.day}:${w.duration}`).join(', ') }} |
          <strong>Sick Leave Days:</strong> {{ worker.sickLeaveDays.join(', ') }} |
          <strong>Training Days:</strong> {{ worker.trainingDays.join(', ') }}
        </li>
      </ul>
      <p v-else>No workers found. Add some using the form above.</p>
    </div>
  </div>
</template>

<script>
import WorkerInput from './components/WorkerInput.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    WorkerInput,
  },
  data() {
    return {
      workers: [],
    };
  },
  methods: {
    async fetchWorkers() {
      try {
        // Fetch workers from the API
        const response = await axios.get("http://localhost:3000/workers");

        // Check if response data matches the expected format
        if (response.data && Array.isArray(response.data)) {
          // Map the response data to ensure proper structure
          this.workers = response.data.map((worker) => ({
            ...worker,
            id: worker.id
          }));
        } else {
          console.error("Unexpected response format:", response.data);
          this.workers = [];
        }

        console.log("Fetched workers:", this.workers);
      } catch (error) {
        console.error("Error fetching workers:", error);
        this.workers = [];
      }
    },
  },
  mounted() {
    this.fetchWorkers();
  },
};
</script>

<style scoped>
h1 {
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  background: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
}
</style>
