export interface DayAssignment {
  shift: { type: string; length: number };
  worker: { name: string };
}

export interface DaySchedule {
  dayOfMonth: number;
  assignments: DayAssignment[];
}

export interface ScheduleResponse {
  month: number;
  year: number;
  daySchedules: DaySchedule[];
}

export interface ScheduleResponse {
  month: number
  year: number
  daySchedules: DaySchedule[]
  score: number
  workerHours: Record<string, number>
  workers: Worker[]
}
