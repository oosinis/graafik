import { Shift } from "./Shift";

export interface Worker {
    name: string;
    assignedShifts: Shift[];
    workLoad: number;
    desiredVacationDays: number[];
    vacationDays: number[];
    requestedWorkDays: { [key: number]: Shift };
}
