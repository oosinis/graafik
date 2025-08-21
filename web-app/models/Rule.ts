export interface Rule {
  id: string
  name: string
  priority: "low" | "medium" | "high"
  daysApplied: number[]
  perDay: number
  restDays: number
  continuousDays: number
}
