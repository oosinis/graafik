"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

export type Employee = {
  id: string;
  name: string;
  role?: string;
};

type EmployeesContextValue = {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
};

const EmployeesContext = createContext<EmployeesContextValue | undefined>(
  undefined
);

export const EmployeesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const value = useMemo(() => ({ employees, setEmployees }), [employees]);
  return (
    <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>
  );
};

export function useEmployees() {
  const ctx = useContext(EmployeesContext);
  if (!ctx) {
    throw new Error("useEmployees must be used within an EmployeesProvider");
  }
  return ctx;
}
