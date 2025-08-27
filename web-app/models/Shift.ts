import type { WorkerRole } from "./Worker"
import type { Rule } from "./Rule"

export interface Shift {
  id: string
  type: string
  durationInMinutes: number
  rules: Rule[]
  createdAt?: string
}