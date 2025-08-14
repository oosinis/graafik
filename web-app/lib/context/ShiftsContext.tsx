"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Shift } from "@/models/Shift";
import { mockShifts } from "@/mocks/data/shifts";

interface ShiftsContextValue {
  shifts: Shift[];
  addShift: (input: Omit<Shift, "id" | "createdAt" | "length" | "rules"> & { rules?: Shift["rules"] }) => Shift;
}

const ShiftsContext = createContext<ShiftsContextValue | undefined>(undefined);

export function ShiftsProvider({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>(() => mockShifts);

  const addShift = useCallback<ShiftsContextValue["addShift"]>((input) => {
    const length = computeLength(input.start, input.end);
    const shift: Shift = {
      id: (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)),
      type: input.type,
      start: input.start,
      end: input.end,
      length,
      roles: input.roles,
      rules: input.rules,
      createdAt: new Date().toISOString()
    };
    setShifts(prev => [shift, ...prev]);
    return shift;
  }, []);

  return <ShiftsContext.Provider value={{ shifts, addShift }}>{children}</ShiftsContext.Provider>;
}

function computeLength(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = (eh*60+em) - (sh*60+sm);
  if (mins < 0) mins += 24*60; // overnight wrap
  return Math.round(mins/60);
}

export function useShifts() {
  const ctx = useContext(ShiftsContext);
  if (!ctx) throw new Error("useShifts must be used within ShiftsProvider");
  return ctx;
}
