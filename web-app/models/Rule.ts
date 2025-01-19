import { Shift } from "./Shift";

export interface Rule {
  shift: Shift;
  priority: 'low' | 'medium' | 'high';
  daysApplied: number[];
  perDay: number;
  restDays: number;
}
  
  