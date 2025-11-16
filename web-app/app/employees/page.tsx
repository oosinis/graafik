"use client";

import { useState, useEffect } from "react";
import type { Employee } from "@/models/Employee";
import type { Shift } from "@/models/Shift";
import type { Role } from "@/services/roleService";
import { AvailabilityData } from "./Availability";
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

  useEffect(() => {
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
      } catch {
        console.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
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

  const handleSaveEmployee = async (employeeData: any) => {
    try {
      if (editingEmployee) {
        await EmployeeService.update(editingEmployee.id, employeeData);
        // Refresh the list
        const data = await EmployeeService.getAll();
        setEmployees(data);
      } else {
        const newEmployee = await EmployeeService.create(employeeData);
        setEmployees(prev => [...prev, newEmployee]);
      }
      setShowAddEmployee(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Failed to save employee:", error);
    }
  };

  const handleDiscardEmployee = () => {
    setShowAddEmployee(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    // TODO: Add delete method to EmployeeService
    await fetch(`/api/employees/${employeeId}`, { method: "DELETE" });
    setEmployees(prev => prev.filter(e => e.id !== employeeId));
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
        editingEmployee={editingEmployee}
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
    />
  );
}