import { Employee } from "./Employee";
import { Shift } from "./Shift";

export interface ScheduleRequest {
  employees: Employee[];
  shifts: Shift[];
  month: number;
  fullTimeMinutes: number;
}
