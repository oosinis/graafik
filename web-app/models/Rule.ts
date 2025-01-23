import { Shift } from "./Shift";

export interface Rule {
  shift: Shift;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  daysApplied: number[];
  perDay: number;
  restDays: number;
}
  
  