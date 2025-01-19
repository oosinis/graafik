import { Worker } from "./Worker";
import { Shift } from "./Shift";
import { Rule } from "./Rule";

export interface ScheduleRequest {
  workers: Worker[];
  shifts: Shift[];
  rules: Rule[];
  month: number;
  fullTimeHours: number;
}

