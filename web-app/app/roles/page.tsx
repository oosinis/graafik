'use client';

import { useState, useEffect } from 'react';
import type { Employee } from '@/models/Employee';
import { RoleService, type Role } from '@/services/roleService';
import { EmployeeService } from '@/services/employeeService';
import Roles from './Roles';
import { AddRole } from './AddRole';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await RoleService.getAll();
      setRoles(data);
    } catch (err) {
      console.error('Failed to fetch roles', err);
    } finally {
      setLoading(false);
    }
  };

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
        console.error('Failed to load roles and employees');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddRole = async (roleData: Partial<Role>) => {
    try {
      console.log('Sending role:', roleData);
      const created = await RoleService.create(roleData);
      if (created) {
        setRoles((prev) => [created, ...prev]);
      } else {
        await fetchRoles();
      }
    } catch (err) {
      console.error('Failed to create role', err);
    } finally {
      setShowModal(false);
    }
  };

  const handleDeleteRole = async (roleName: string) => {
    try {
      // Find the role by name
      const roleToDelete = roles.find((r) => r.name === roleName);
      if (!roleToDelete) return;

      // Check if any employees have this role
      const employeesWithRole = employees.filter(
        (emp) => emp.role?.id === roleToDelete.id || emp.role?.name === roleName
      );
      if (employeesWithRole.length > 0) {
        alert(
          `Cannot delete role "${roleName}". ${employeesWithRole.length} employee(s) are assigned to this role.`
        );
        return;
      }

      await RoleService.delete(roleToDelete.id);
      setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
    } catch (error) {
      console.error('Failed to delete role:', error);
      alert('Failed to delete role. Please try again.');
    }
  };

  return (
    <>
      <Roles
        roles={roles}
        employees={employees}
        isLoading={loading}
        onAddRole={() => setShowModal(true)}
        onDeleteRole={handleDeleteRole}
      />
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg p-4 w-full max-w-[600px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <AddRole
              onSave={handleAddRole}
              onDiscard={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
