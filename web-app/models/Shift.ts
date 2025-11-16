import type { Rule } from "./Rule"

export interface Shift {
  id: string
  name?: string
  type: string
  durationInMinutes?: number
  startTime?: string
  endTime?: string
  rules: Rule[]
  createdAt?: string
}