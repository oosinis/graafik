/* import type { Shift } from "@/models/Shift";

export const mockShifts: Shift[] = [
  {
    id: "s1",
    type: "Morning",
    start: "08:00",
    end: "14:00",
    length: 6,
    roles: ["Chef", "Manager", "Waiter"],
    rules: [
      { priority: "high", daysApplied: [1,2,3,4,5], perDay: 1, restDays: 0, continuousDays: 5 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "s2",
    type: "Day",
    start: "12:00",
    end: "18:00",
    length: 6,
    roles: ["Chef", "Waiter"],
    rules: [
      { priority: "medium", daysApplied: [1,2,3,4,5], perDay: 1, restDays: 0, continuousDays: 5 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "s3",
    type: "Evening",
    start: "16:00",
    end: "22:00",
    length: 6,
    roles: ["Chef", "Waiter", "Cleaner"],
    rules: [
      { priority: "low", daysApplied: [1,2,3,4,5,6,7], perDay: 1, restDays: 1, continuousDays: 3 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "s4",
    type: "Night",
    start: "22:00",
    end: "08:00",
    length: 10,
    roles: ["Cleaner", "Manager"],
    rules: [
      { priority: "high", daysApplied: [1,2,3,4,5,6,7], perDay: 1, restDays: 2, continuousDays: 4 }
    ],
    createdAt: new Date().toISOString()
  }
];

export function fetchMockShifts(delayMs = 250): Promise<Shift[]> {
  return new Promise(res => setTimeout(() => res(mockShifts), delayMs));
}
 */