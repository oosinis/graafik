"use client";

import { useState, useEffect } from "react";
import type { Employee } from "@/models/Employee";
import { RoleService, type Role } from "@/services/roleService";
import { EmployeeService } from "@/services/employeeService";
import Roles from "./roles";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesData, employeesData] = await Promise.all([
          RoleService.getAll(),
          EmployeeService.getAll(),
        ]);
        setRoles(rolesData);
        setEmployees(employeesData);
      } catch {
        console.error("Failed to load roles and employees");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddRole = () => {
    // TODO: Implement add role modal/form
    console.log("Add role clicked");
  };

  const handleDeleteRole = async (roleName: string) => {
    try {
      // Find the role by name
      const roleToDelete = roles.find(r => r.name === roleName);
      if (!roleToDelete) return;

      // Check if any employees have this role
      const employeesWithRole = employees.filter(emp => emp.role === roleName);
      if (employeesWithRole.length > 0) {
        alert(`Cannot delete role "${roleName}". ${employeesWithRole.length} employee(s) are assigned to this role.`);
        return;
      }

      await RoleService.delete(roleToDelete.id);
      setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
    } catch (error) {
      console.error("Failed to delete role:", error);
      alert("Failed to delete role. Please try again.");
    }
  };

  return (
    <Roles
      roles={roles}
      employees={employees}
      isLoading={loading}
      onAddRole={handleAddRole}
      onDeleteRole={handleDeleteRole}
    />
  );
}