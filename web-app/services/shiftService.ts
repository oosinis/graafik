import { httpClient } from "./httpClient";
import { Shift } from "@/models/Shift";

export const ShiftsService = {
  getAll(): Promise<Shift[]> {
    return httpClient("/shifts");
  },

  getById(id: string): Promise<Shift> {
    return httpClient(`/shifts/${id}`);
  },

  create(shift: Partial<Shift>): Promise<Shift> {
    return httpClient("/shifts", {
      method: "POST",
      body: JSON.stringify(shift),
    });
  },

  update(id: string, shift: Partial<Shift>): Promise<Shift> {
    return httpClient(`/shifts/${id}`, {
      method: "PUT",
      body: JSON.stringify(shift),
    });
  },

  delete(id: string): Promise<void> {
    return httpClient(`/shifts/${id}`, {
      method: "DELETE",
    });
  },
};
