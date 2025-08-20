export type Shift = {
    id: string
    type: string
    durationInMinutes: number 
    rules: Rule[];
}

export type Rule = {
    id: string;
    name: string;
    daysApplied: number[];
    perDay: number;
    restDays: number;
    continuousDays: number;
    priority: PriorityType;
  }

export type Props = {
  shifts: Shift[]
  activeShiftId: string
  onSelectShift: (id: string) => void
  onUpdateShift: (id: string, patch: Partial<Shift>) => void
}

export type RulesProps = {
  activeRuleId: string
  onSelectRule: (ruleId: string) => void
  updateRule: (shiftId: string, ruleId: string, patch: Partial<Rule>) => void
  toggleRuleDay: (shiftId: string, ruleId: string, day: number) => void
  setRulePriority: (shiftId: string, ruleId: string, p: PriorityType) => void
}

export type PriorityType = "critical" | "high" | "medium" | "low";

export type WorkerFE = {
  id: string;
  name: string;
  assignedShiftIds: string[];         
  workLoad: number;                    
  desiredVacationDays: number[];      
  vacationDays: number[];              
  requestedWorkDays: Record<number, string | null>;
  sickDays: number[];
};
