export interface Rule {
  daysApplied: number[];
  perDay: number;
  restDays: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}
  
  