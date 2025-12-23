"use client";

import { useState, useEffect } from "react";
import type { Employee } from "@/models/Employee";
import type { Shift } from "@/models/Shift";
import type { Role } from "@/services/roleService";
import { AvailabilityData } from "./AvailabilityDialog";
import Employees from "./Employees";
import { AddEmployee } from "./AddEmployee";
import { EmployeeService } from "@/services/employeeService";
import { ShiftsService } from "@/services/shiftService";
import { RoleService } from "@/services/roleService";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const loadData = async () => {
    try {
      const [employeesData, shiftsData, rolesData] = await Promise.all([
        EmployeeService.getAll(),
        ShiftsService.getAll(),
        RoleService.getAll(),
      ]);
      setEmployees(employeesData);
      setShifts(shiftsData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEmployee = () => {
    setShowAddEmployee(true);
    setEditingEmployee(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowAddEmployee(true);
  };

  const handleSaveEmployee = (savedEmployee: Employee) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(e => e.id === savedEmployee.id ? savedEmployee : e));
    } else {
      setEmployees(prev => [...prev, savedEmployee]);
    }
    setShowAddEmployee(false);
    setEditingEmployee(null);
  };

  const handleDiscardEmployee = () => {
    setShowAddEmployee(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await EmployeeService.delete(employeeId);
      await loadData();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handleUpdateAvailability = async (employeeId: string, availability: AvailabilityData) => {
    // TODO: Add updateAvailability method to EmployeeService
    await fetch(`/api/employees/${employeeId}/availability`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(availability),
    });
  };

  // Show AddEmployee form if active
  if (showAddEmployee) {
    return (
      <AddEmployee
        onSave={handleSaveEmployee}
        onDiscard={handleDiscardEmployee}
        editingEmployee={editingEmployee || undefined}
        roles={roles}
        shifts={shifts}
      />
    );
  }

  return (
    <Employees
      employees={employees}
      isLoading={loading}
      onAddEmployee={handleAddEmployee}
      onEditEmployee={handleEditEmployee}
      onDeleteEmployee={handleDeleteEmployee}
      onUpdateAvailability={handleUpdateAvailability}
      shifts={shifts}
      roles={roles}
    />
  );
}