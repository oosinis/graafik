import { Rule } from "./Rule"

export interface Shift {
    type: string
    duration: number
    rules: Rule[]
  }
  
  