import { Employee } from "@/models/Employee";
import { httpClient } from "./httpClient";

const BASE_URL = "/employees";

export const EmployeeService = {
  /**
   * GET /employees
   */
  getAll(): Promise<Employee[]> {
    return httpClient(BASE_URL);
  },

  /**
   * GET /employees/{id}
   */
  getById(id: string): Promise<Employee> {
    return httpClient(`${BASE_URL}/${id}`);
  },

  /**
   * POST /employees
   */
  create(employee: Partial<Employee>): Promise<Employee> {
    return httpClient(BASE_URL, {
      method: "POST",
      body: JSON.stringify(employee),
    });
  },

  /**
   * PUT /employees/{id}
   */
  update(id: string, employee: Partial<Employee>): Promise<Employee> {
    return httpClient(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(employee),
    });
  },
};