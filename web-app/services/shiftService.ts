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
    // When creating a shift the frontend may generate temporary string ids for nested rules
    // (e.g. "rule-123"). The backend expects UUIDs (or no id for new entities). Strip
    // any client-side ids from nested rules before sending the payload so Jackson can
    // deserialize into entities without failing on UUID parsing.
    const payload: any = {
      ...shift,
      rules: shift.rules ? shift.rules.map(r => {
        const { id, ...rest } = r as any;
        return rest;
      }) : undefined
    };

    console.log("POST /shifts payload:", payload);
    return httpClient(BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
