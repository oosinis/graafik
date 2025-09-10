import { Worker } from "./Worker";
import { Shift } from "./Shift";

export interface ScheduleRequest {
  workers: Worker[];
  shifts: Shift[];
  month: number;
  fullTimeHours: number;
}
