import { httpClient } from "./httpClient";
import { Shift } from "@/models/Shift";

const BASE_URL = "/shifts";

export const ShiftsService = {
  /**
   * GET /shifts
   */
  getAll(): Promise<Shift[]> {
    return httpClient(BASE_URL);
  },

  /**
   * GET /shifts/{id}
   */
  getById(id: string): Promise<Shift> {
    return httpClient(`${BASE_URL}/${id}`);
  },

  /**
   * POST /shifts
   */
  create(shift: Partial<Shift>): Promise<Shift> {
    return httpClient(BASE_URL, {
      method: "POST",
      body: JSON.stringify(shift),
    });
  },
};
