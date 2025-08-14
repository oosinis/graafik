import type { WorkerRole } from "./Worker"

export interface Shift {
  id: string
  type: string // display/title
  start: string // HH:MM 24h
  end: string // HH:MM 24h
  length: number // computed hours (approx, ignoring day wrap for now)
  roles: WorkerRole[]
  rules?: Rule[]
  createdAt?: string
}

export interface Rule {
  priority: "low" | "medium" | "high"
  daysApplied: number[]
  perDay: number
  restDays: number
  continuousDays: number
}
