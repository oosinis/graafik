import type { Shift } from "./Shift"
import { WorkerDto } from "./WorkerDto"

export interface ShiftAssignment {
  shift: Shift
  worker: WorkerDto
}
