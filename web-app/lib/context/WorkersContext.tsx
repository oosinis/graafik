"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Worker, WorkerRole, WorkerStatus } from "@/models/Worker";
import { mockWorkers } from "@/mocks/data/workers";

interface WorkersContextValue {
  workers: Worker[];
  addWorker: (input: Omit<Worker, "id" | "assignedShifts"> & { assignedShifts?: Worker["assignedShifts"] }) => Worker;
}

const WorkersContext = createContext<WorkersContextValue | undefined>(undefined);

export function WorkersProvider({ children }: { children: ReactNode }) {
  const [workers, setWorkers] = useState<Worker[]>(() => mockWorkers);

  const addWorker = useCallback<WorkersContextValue["addWorker"]>((input) => {
    const worker: Worker = {
      id: (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)),
      assignedShifts: input.assignedShifts ?? [],
      name: input.name,
      role: input.role as WorkerRole,
      status: input.status as WorkerStatus,
      email: input.email,
      phone: input.phone,
    };
    setWorkers((prev) => [worker, ...prev]);
    return worker;
  }, []);

  return (
    <WorkersContext.Provider value={{ workers, addWorker }}>
      {children}
    </WorkersContext.Provider>
  );
}

export function useWorkers() {
  const ctx = useContext(WorkersContext);
  if (!ctx) throw new Error("useWorkers must be used within WorkersProvider");
  return ctx;
}
