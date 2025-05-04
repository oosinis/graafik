import { ShiftAssignment } from "./ShiftAssignment"

export interface DaySchedule {
  dayOfMonth: number
  assignments: ShiftAssignment[]
  score: number
}
