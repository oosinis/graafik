export default {
  template: `
      <input type="file" @change="handleFileChange" accept=".csv" />

      <button @click="handleFileUpload">Submit</button>

  `,

  data() {
    return {
      file: null
    };
  },

  methods: {

    handleFileChange(event) {
      this.file = event.target.files[0];
    },

    handleFileUpload() {
      if (this.file && this.file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvContent = e.target.result;
          const data = this.parseCSV(csvContent);
          this.$emit('parsed-data', data);
        };
        reader.readAsText(this.file);
      } else {
        alert('Please upload a valid CSV file.');
      }
    },

    parseCSV(csvContent) {
      const lines = csvContent.split('\n').filter(line => line.trim() !== '');
      const headers = lines[0].split(',').map(header => header.trim());
      return lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        return headers.reduce((obj, header, index) => {
          console.log("OBJ", header)
          console.log(values[index])
          obj[header] = values[index];
          return obj;
        }, {});
      });
    }
  }
}