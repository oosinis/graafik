import type { Rule } from "./Rule";

export interface Shift {
  id: string;
  name: string;
  startTime?: string;
  endTime?: string;
  rules: Rule[];
  createdAt?: string;
}
