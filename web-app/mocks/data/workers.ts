import type { Worker } from "@/models/Worker"

export const mockWorkers: Worker[] = [
  {
    id: "w1",
    name: "Jan Tamm",
    role: "Chef",
    status: "active",
    email: "jan.tamm@example.com",
    phone: "+3725551001",
    assignedShifts: [
      { type: "Morning", length: 8 },
      { type: "Evening", length: 8 },
    ],
  },
  {
    id: "w2",
    name: "Mari Forest",
    role: "Waiter",
    status: "leave",
    email: "mari.forest@example.com",
    phone: "+3725551002",
    assignedShifts: [{ type: "Night", length: 10 }],
  },
  {
    id: "w3",
    name: "Peter Birch",
    role: "Waiter",
    status: "active",
    email: "peter.birch@example.com",
    phone: "+3725551003",
    assignedShifts: [
      { type: "Day", length: 6 },
      { type: "Evening", length: 8 },
    ],
  },
]

export function fetchMockWorkers(delayMs = 250): Promise<Worker[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockWorkers), delayMs))
}
