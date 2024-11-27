import {Shift} from "./Shift";

export class Rule {
    shift: Shift;
    days: number;
    perDay: number;
    restDaysAfter: number;
    priority: PriorityType;

    constructor(
        shift: Shift,
        days: number,
        perDay: number,
        restDaysAfter: number,
        priority: PriorityType
    ) {
        this.shift = shift;
        this.days = days;
        this.perDay = perDay;
        this.restDaysAfter = restDaysAfter;
        this.priority = priority;
    }
}

// Define the PriorityType enum
export enum PriorityType {
    // Unbreakable rule
    Critical = "Critical",
    // Can break if very needed
    High = "High",
    // Can break
    Medium = "Medium",
    // Nice to have
    Low = "Low",
}