import type { DaySchedule } from "./DaySchedule"

export interface ScheduleResponse {
  id: string
  month: number
  year: number
  daySchedules: DaySchedule[]
  score: number
  workerHours: Record<string, number>
}
