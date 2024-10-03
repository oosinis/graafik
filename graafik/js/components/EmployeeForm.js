// src/components/EmployeeForm.js
export default {
  template: `
    <div>
      <h2>Add New Employee</h2>
      <form @submit.prevent="addEmployee">
        <label>
          Name:
          <input type="text" v-model="employee.name" required />
        </label>
        <label>
          Age:
          <input type="number" v-model="employee.age" required />
        </label>
        <label>
          Position:
          <input type="text" v-model="employee.position" required />
        </label>
        <button type="submit">Add Employee</button>
      </form>
    </div>
  `,
  data() {
    return {
      employee: {
        name: '',
        age: '',
        position: ''
      }
    };
  },
  methods: {
    addEmployee() {
      this.$emit('add-employee', { ...this.employee });
      this.employee.name = '';
      this.employee.age = '';
      this.employee.position = '';
    }
  }
};
