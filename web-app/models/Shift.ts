import type { WorkerRole } from "./Worker"
import type { Rule } from "./Rule"

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

// Rule interface now sourced from models/Rule.ts to avoid duplication
