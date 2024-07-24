import FileInput from "./FileInput.js";
import { processCSVData } from "./DataProcessor.js";

export default {
  components: { FileInput },

  template: `

      <h1>CSV File Upload</h1>
      <FileInput @parsed-data="handleParsedData" />
      <div v-if="csvData.length">
        <h2>Processed CSV Data</h2>
        <table border="1">
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in csvData" :key="rowIndex">
              <td v-for="(header, colIndex) in headers" :key="colIndex">{{ row[header] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      `,

  data() {
    return {
      csvData: []
    };
  },
  computed: {
    headers() {
      return this.csvData.length ? Object.keys(this.csvData[0]) : [];

    }
  },
  
  methods: {
    handleParsedData(data) {
      console.log(data);
      this.csvData = processCSVData(data);
    }
  }
}