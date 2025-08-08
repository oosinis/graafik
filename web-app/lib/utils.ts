// web-app/lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge Tailwind-style class lists */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ——— shared business models ———

/** An individual employee */
export interface Employee {
  id: string
  name: string
  role: string
  fte: number
  email: string
  phone: string
}

export interface Shift {
  id: string
  title: string
  from: string
  to: string
  roles: string [];
  rulesCount: number
}

/** A reusable shift template */
//export interface ShiftTemplate {
 // id: string
 // title: string
 // start: string   // e.g. "09:00"
 // end: string     // e.g. "17:00"
 // roles: string[] // which roles can fill it
  //rulesCount: number
//}
