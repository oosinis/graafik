"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Employee } from "@/models/Employee";
import { AvailabilityData } from "./Availability";
import Employees from "./Employees";

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const res = await fetch("/api/employees");
        const data: Employee[] = await res.json();
        setEmployees(data);
      } catch {
        console.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  const handleAddEmployee = () => {
    router.push("/employees/create"); // ✅ Adjust if needed
  };

  const handleEditEmployee = (employee: Employee) => {
    router.push(`/employees/${employee.id}`);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    await fetch(`/api/employees/${employeeId}`, { method: "DELETE" });
    setEmployees(prev => prev.filter(e => e.id !== employeeId));
  };

  const handleUpdateAvailability = async (employeeId: string, availability: AvailabilityData) => {
    await fetch(`/api/employees/${employeeId}/availability`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(availability),
    });
  };

  return (
    <Employees
      employees={employees}
      isLoading={loading}
      onAddEmployee={handleAddEmployee}
      onEditEmployee={handleEditEmployee}
      onDeleteEmployee={handleDeleteEmployee}
      onUpdateAvailability={handleUpdateAvailability}
    />
  );
}
