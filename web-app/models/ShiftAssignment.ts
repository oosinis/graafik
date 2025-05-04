import type { Shift } from "./Shift"
import type { WorkerDto } from "./WorkerDto"

export interface ShiftAssignment {
  shift: Shift
  worker: WorkerDto
}
