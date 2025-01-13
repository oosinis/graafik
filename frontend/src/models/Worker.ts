import { Shift } from './Shift';

export class Worker {
    employeeId: number;
    name: string;
    workLoadHours: number;
    workLoad: number;
    quarterBalance: number | null;
    lastMonthBalance: number | null;
    lastMonthLastDayHours: number;
    vacationDays: number[];
    desiredVacationDays: number[];
    desiredWorkDays: Map<number, Shift>;
    sickLeaveDays: number[];
    trainingDays: number[];
    numOf24hShifts: number;
    initialBalance: number | null;

    constructor(
        employeeId: number,
        name: string,
        workLoadHours: number,
        workLoad: number,
        quarterBalance: number | null,
        lastMonthBalance: number | null,
        lastMonthLastDayHours: number,
        vacationDays: number[] = [],
        desiredVacationDays: number[] = [],
        desiredWorkDays: Map<number, Shift> = new Map(),
        sickLeaveDays: number[] = [],
        trainingDays: number[] = [],
        numOf24hShifts: number = 0,
        initialBalance: number | null = null
    ) {
        this.employeeId = employeeId;
        this.name = name;
        this.workLoadHours = workLoadHours;
        this.workLoad = workLoad;
        this.quarterBalance = quarterBalance;
        this.lastMonthBalance = lastMonthBalance;
        this.lastMonthLastDayHours = lastMonthLastDayHours;
        this.vacationDays = vacationDays;
        this.desiredVacationDays = desiredVacationDays;
        this.desiredWorkDays = desiredWorkDays;
        this.sickLeaveDays = sickLeaveDays;
        this.trainingDays = trainingDays;
        this.numOf24hShifts = numOf24hShifts;
        this.initialBalance = initialBalance;
    }
}
