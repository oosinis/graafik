import { Worker } from './Worker';
import { Shift } from './Shift';
import { Rule } from './Rule';

export class ScheduleRequest {
    workers: Worker[];
    shifts: Shift[];
    month: number;
    fullTimeHours: number;
    rules: Rule[];

    constructor(
        workers: Worker[] = [],
        shifts: Shift[] = [],
        month: number,
        fullTimeHours: number,
        rules: Rule[] = []
    ) {
        this.workers = workers;
        this.shifts = shifts;
        this.month = month;
        this.fullTimeHours = fullTimeHours;
        this.rules = rules;
    }
}
