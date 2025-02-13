export interface Rule {
  daysApplied: number[];
  perDay: number;
  restDays: number;
  continuousDays: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}
  
  