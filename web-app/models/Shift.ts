export interface Shift {
  type: string
  length: number
  rules?: Rule[]
}

export interface Rule {
  priority: "low" | "medium" | "high"
  daysApplied: number[]
  perDay: number
  restDays: number
  continuousDays: number
}
