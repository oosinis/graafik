import type { Rule } from "./Rule"

export interface Shift {
  id: string
  type: string
  durationInMinutes?: number
  duration?: number
  rules: Rule[]
  createdAt?: string
}