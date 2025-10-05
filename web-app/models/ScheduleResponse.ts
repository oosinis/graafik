import type { DaySchedule } from "./DaySchedule"
import type { Worker } from "./Worker"

export interface ScheduleResponse {
  month: number
  year: number
  daySchedules: DaySchedule[]
  score: number
  workerHours: Record<string, number>
  workers: Worker[]
}
