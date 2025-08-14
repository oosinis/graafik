import { Shift } from "./Shift"

export type WorkerStatus = "active" | "inactive" | "leave"
export type WorkerRole = "Chef" | "Manager" | "Waiter" | "Cleaner" | "Other"

export interface Worker {
  id: string
  name: string
  role: WorkerRole
  status: WorkerStatus
  email?: string
  phone?: string
  assignedShifts: Shift[]
}
