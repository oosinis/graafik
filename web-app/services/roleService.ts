import { httpClient } from "./httpClient";

export interface Role {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
}

const BASE_URL = "/roles";

export const RoleService = {
  /**
   * GET /roles
   */
  getAll(): Promise<Role[]> {
    return httpClient(BASE_URL);
  },

  /**
   * GET /roles/{id}
   */
  getById(id: string): Promise<Role> {
    return httpClient(`${BASE_URL}/${id}`);
  },

  /**
   * POST /roles
   */
  create(role: Partial<Role>): Promise<Role> {
    return httpClient(BASE_URL, {
      method: "POST",
      body: JSON.stringify(role),
    });
  },

  /**
   * PUT /roles/{id}
   */
  update(id: string, role: Partial<Role>): Promise<Role> {
    return httpClient(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(role),
    });
  },

  /**
   * DELETE /roles/{id}
   */
  delete(id: string): Promise<void> {
    return httpClient(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};