import { ScheduleResponse } from "@/models/ScheduleResponse";
import { httpClient } from "./httpClient";
import { ScheduleRequest } from "@/models/ScheduleRequest";

const BASE_URL = "/schedules";

export const ScheduleService = {
    /**
     * POST /schedules
     */
    create(schedule: ScheduleRequest): Promise<ScheduleResponse> {
        return httpClient(BASE_URL, {
            method: "POST",
            body: JSON.stringify(schedule),
        });
    },

    /**
     * GET /schedules
     */
    getAll(): Promise<ScheduleResponse[]> {
        return httpClient(BASE_URL);
    },

    /**
     * GET /schedules/{id}
     */
    getById(id: string): Promise<ScheduleResponse> {
        return httpClient(`${BASE_URL}/${id}`);
    },

    /**
     * GET /schedules/latest?month=X&year=Y
     */
    getLatest(month: number, year: number): Promise<ScheduleResponse> {
        return httpClient(
            `${BASE_URL}/latest?month=${month}&year=${year}`
        );
    },

    /**
     * PUT /schedules/{id}
     */
    update(
        id: string,
        schedule: ScheduleRequest,
        startDate: number,
        endDate: number,
        workerId: string
    ): Promise<ScheduleResponse> {
        const query = `?startDate=${startDate}&endDate=${endDate}&workerId=${workerId}`;
        return httpClient(`${BASE_URL}/${id}${query}`, {
            method: "PUT",
            body: JSON.stringify(schedule),
        });
    },

    /**
     * DELETE /schedules/{id}
     */
    delete(id: string): Promise<void> {
        return httpClient(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });
    },
};
