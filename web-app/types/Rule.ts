import { PriorityType } from "./PriorityType"

export type Rule = {
    id: string;
    name: string;
    daysApplied: number[];
    perDay: number;
    restDays: number;
    continuousDays: number;
    priority: PriorityType;
  }