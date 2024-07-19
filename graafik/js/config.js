export const weekEnd = ['l', 'p'];
export const sickLeave = 'h';
export const vacation = 'p';
export const requestOffDay = 'x';
export const requestworkDay = 't';


export const shiftLengths = [
  { start: '08:00', end: '8:00', duration: '24' },
  { start: '08:00', end: '20:00', duration: '12' },
  { start: '20:00', end: '08:00', duration: '12' }
];

export const weekdayPersonnel = [
  { count: 2, shift: { start: '08:00', end: '20:00' } },
  { count: 1, shift: { start: '20:00', end: '8:00' } }
];

export const weekendPersonnel = [...weekdayPersonnel];
