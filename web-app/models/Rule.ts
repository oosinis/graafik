export interface Rule {
  daysApplied: number[];
  perDay: number;
  restDays: number;
  continuousDays: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}
  
  