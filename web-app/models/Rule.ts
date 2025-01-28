import { Shift } from "./Shift";

export interface Rule {
  shift: Shift;
  daysApplied: number[];
  perDay: number;
  restDays: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}
  
  