export interface ScheduleAssignment {
  employeeId: string;
  employeeName: string;
  date: string; // ISO date yyyy-mm-dd
  shiftId: string;
  shiftName: string;
  shiftColor: string;
  shiftBg: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  isDayOff?: boolean;
}

export interface GeneratedSchedule {
  startDate: string; // ISO date
  endDate: string;   // ISO date
  assignments: ScheduleAssignment[];
}
