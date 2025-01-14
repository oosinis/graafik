import { Shift } from "./Shift";

export interface Rule {
    shift: Shift;
    priority: 'low' | 'medium' | 'high';
    daysApplied: string[];
    perDay: string;
    restDays: string;
  }
  
  