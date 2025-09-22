/* import type { Worker } from "@/models/Worker";

export const mockWorkers: Worker[] = [
  {
    id: "w1",
    name: "Jan Tamm",
    role: "Chef",
    status: "active",
    email: "jan.tamm@example.com",
    phone: "+3725551001",
    assignedShifts: [
  { id: "s1", type: "Morning", start: "08:00", end: "16:00", length: 8, roles: ["Chef"] },
  { id: "s2", type: "Evening", start: "16:00", end: "00:00", length: 8, roles: ["Chef", "Waiter"] },
    ],
  },
  {
    id: "w2",
    name: "Mari Forest",
    role: "Waiter",
    status: "leave",
    email: "mari.forest@example.com",
    phone: "+3725551002",
    assignedShifts: [
      { id: "s3", type: "Night", start: "00:00", end: "10:00", length: 10, roles: ["Waiter"] },
    ],
  },
  {
    id: "w3",
    name: "Peter Birch",
    role: "Waiter",
    status: "active",
    email: "peter.birch@example.com",
    phone: "+3725551003",
    assignedShifts: [
      { id: "s4", type: "Day", start: "10:00", end: "16:00", length: 6, roles: ["Waiter"] },
      { id: "s5", type: "Evening", start: "16:00", end: "00:00", length: 8, roles: ["Waiter"] },
    ],
  },
];

export function fetchMockWorkers(delayMs = 250): Promise<Worker[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockWorkers), delayMs));
}
 */