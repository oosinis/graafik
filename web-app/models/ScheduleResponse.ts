import type { DaySchedule } from "./DaySchedule"

export interface ScheduleResponse {
  month: number
  year?: number
  daySchedules: DaySchedule[]
  score: number
  workerHours: Record<string, number> // Map<WorkerDto, Integer> in Java
}
