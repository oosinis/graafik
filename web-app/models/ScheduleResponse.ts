import { Shift } from "./Shift";
import { Employee } from "./Employee";

export interface ShiftAssignment {
  id: string;
  shift: Shift;
  employee: Employee;
}

export interface DaySchedule {
  id: string;
  dayOfMonth: number;
  score: number;
  assignments: ShiftAssignment[];
}

export interface ScheduleResponse {
  id: string;
  month: number;
  year: number;
  score: number;
  fullTimeHours: number;
  employeeHoursInMins: Record<string, number>;
  daySchedules: DaySchedule[];
}
