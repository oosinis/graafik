//...libs/context/EmployeesContext.tsx

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// our Employee shape
export interface Employee {
  id:   string;
  name: string;
  role: string;
  fte:  number;
  email: string;
  phone: string;
}

interface EmployeesContextValue {
  employees: Employee[];
  addEmployee: (emp: Employee) => void;
}

const EmployeesContext = createContext<EmployeesContextValue | undefined>(
  undefined
);

export function EmployeesProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([
    // initial mock data
    { id: "1", name: "Astrid Laane",   role: "Kokk",          fte: 1,    email: "astrid@gmail.com", phone: "5123 4567" },
    { id: "2", name: "Denis Saar",     role: "Vahetusevanem", fte: 0.75, email: "denis01@gmail.com", phone: "5432 2324" },
    { id: "3", name: "Gregor Ojamets", role: "Ettekandja",    fte: 0.5,  email: "ojametsgregor@gmail.com", phone: "5544 0987" },
  ]);

  const addEmployee = (emp: Employee) => {
    setEmployees((prev) => [...prev, emp]);
  };

  return (
    <EmployeesContext.Provider value={{ employees, addEmployee }}>
      {children}
    </EmployeesContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeesContext);
  if (!ctx) {
    throw new Error("useEmployees must be used within an EmployeesProvider");
  }
  return ctx;
}
