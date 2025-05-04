import { Shift } from "./Shift"

export interface Worker {
  name: string
  assignedShifts: Shift[]
}
