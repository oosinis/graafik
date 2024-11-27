<template>
  <div class="worker-input-container">
    <h1>{{ msg }}</h1>
    <div class="form-container">
      <div class="input-group">
        <input type="text" v-model="name" placeholder="Name" class="input-field"/>
      </div>

      <div class="input-group">
        <input type="number" v-model="koormus" placeholder="Workload (e.g. 1 for full-time)" class="input-field"/>
      </div>

      <div class="input-group">
        <input type="number" v-model="lastmonthbalance" placeholder="Last Month Balance" class="input-field"/>
      </div>

      <div class="input-group">
        <label class="radio-label">24h shift on the last day of last month</label>
        <div class="radio-group">
          <input
              type="radio"
              id="shift-true"
              v-model="lastDay24Shift"
              :value="true"
              class="radio-input"
          />
          <label for="shift-true">Yes</label>

          <input
              type="radio"
              id="shift-false"
              v-model="lastDay24Shift"
              :value="false"
              class="radio-input"
          />
          <label for="shift-false">No</label>
        </div>
      </div>

      <div class="input-group">
        <input type="text" v-model="vacationDays" placeholder="Vacation Days (comma separated)" class="input-field"/>
      </div>

      <div class="input-group">
        <input type="text" v-model="desiredVacationDays" placeholder="Desired Vacation Days (comma separated)" class="input-field"/>
      </div>

      <div class="input-group">
        <input type="text" v-model="desiredWorkDays" placeholder="Desired Work Days (comma separated days with durations, eg 5:24, 6:8)" class="input-field"/>
      </div>

      <div class="input-group">
        <input type="text" v-model="sickLeaveDays" placeholder="Sick Leave Days (comma separated)" class="input-field"/>
      </div>

      <div class="input-group">
        <input type="text" v-model="trainingDays" placeholder="Training Days (comma separated)" class="input-field"/>
      </div>

      <div class="submit-button-container">
        <button v-on:click="workerInput" type="submit" class="submit-button">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WorkerInput',
  data() {
    return {
      name: "",
      koormus: "",
      lastmonthbalance: "",
      lastDay24Shift: false,
      vacationDays: "",
      desiredVacationDays: "",
      desiredWorkDays: "",
      sickLeaveDays: "",
      trainingDays: "",
    }
  },

  methods: {
    async workerInput() {
      // Validate workload and last month balance
      if (isNaN(parseFloat(this.koormus)) || parseFloat(this.koormus) <= 0) {
        alert("Please enter a valid workload (e.g., 1 for full-time, 0.75 for part-time).");
        return;
      }
      if (isNaN(parseInt(this.lastmonthbalance))) {
        alert("Please enter a valid last month balance.");
        return;
      }

      // Process input values to convert to required format
      const vacationDaysArray = this.vacationDays
          ? this.vacationDays.split(',').map(day => parseInt(day.trim()))
          : [];
      const desiredVacationDaysArray = this.desiredVacationDays
          ? this.desiredVacationDays.split(',').map(day => parseInt(day.trim()))
          : [];
      const sickLeaveDaysArray = this.sickLeaveDays
          ? this.sickLeaveDays.split(',').map(day => parseInt(day.trim()))
          : [];
      const trainingDaysArray = this.trainingDays
          ? this.trainingDays.split(',').map(day => parseInt(day.trim()))
          : [];
      const desiredWorkDaysArray = this.desiredWorkDays
          ? this.desiredWorkDays.split(',').map(item => {
            const [day, duration] = item.split(':');
            return { day: parseInt(day.trim()), duration: parseInt(duration.trim()) };
          })
          : [];

      try {
        // Get id of last worker
        const response = await axios.get("http://localhost:3000/workers");
        const workers = response.data || [];
        const maxId = workers.reduce((max, worker) => Math.max(max, worker.id || 0), 0);

        // Create a new worker
        const newWorker = {
          id: maxId + 1,
          name: this.name,
          workLoad: parseFloat(this.koormus),
          hoursBalance: parseInt(this.lastmonthbalance),
          lastMonthBalance: parseInt(this.lastmonthbalance),
          lastMonthLastDayHours: this.lastDay24Shift,
          vacationDays: vacationDaysArray,
          desiredVacationDays: desiredVacationDaysArray,
          desiredWorkDays: desiredWorkDaysArray,
          sickLeaveDays: sickLeaveDaysArray,
          trainingDays: trainingDaysArray
        };

        // Step 3: Post the new worker to the API
        const result = await axios.post("http://localhost:3000/workers", newWorker, {
          headers: {'Content-Type': 'application/json'}
        });

        console.log(result);
        if (result.status === 201) {
          alert("Worker added successfully!");
          this.$emit("worker-added");
        }
      } catch (error) {
        console.error("Error adding worker:", error.response?.data || error.message);
        alert(`Failed to add worker: ${error.response?.data?.message || error.message}`);
      }
    }
  }
}
</script>

<style scoped>
.worker-input-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #333;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-field {
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.radio-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.radio-input {
  margin-right: 5px;
}

.radio-label {
  font-size: 1rem;
  margin-bottom: 5px;
}

.submit-button-container {
  display: flex;
  justify-content: center;
}

.submit-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:focus {
  outline: none;
}

@media (max-width: 768px) {
  .worker-input-container {
    padding: 10px;
  }
}
</style>
