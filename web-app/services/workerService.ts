import { httpClient } from "./httpClient";
import { Worker } from "@/models/Worker";

const BASE_URL = "/workers";

export const WorkerService = {
  /**
   * GET /workers
   */
  getAll(): Promise<Worker[]> {
    return httpClient(BASE_URL);
  },

  /**
   * GET /workers/{id}
   */
  getById(id: string): Promise<Worker> {
    return httpClient(`${BASE_URL}/${id}`);
  },

  /**
   * POST /workers
   */
  create(worker: Partial<Worker>): Promise<Worker> {
    return httpClient(BASE_URL, {
      method: "POST",
      body: JSON.stringify(worker),
    });
  },
};
