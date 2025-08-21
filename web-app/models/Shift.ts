import { Rule } from '@/models/Rule'

export interface Shift {
  id: string
  type: string
  durationInMinutes: number
  rules?: Rule[]
}
