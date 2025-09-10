import { Shift } from "./Shift"

export type WorkerStatus = "active" | "inactive" | "leave"

export interface Worker {
  id: string
  name: string
  role: string
    //email ja tel nr tulevad ka hiljem
  email?: string
  phone?: string
  assignedShifts: Shift[]
  workLoad: number;                    
  desiredVacationDays: number[];      
  vacationDays: number[];              
  requestedWorkDays: Record<number, string | null>;
  sickDays: number[];
}

