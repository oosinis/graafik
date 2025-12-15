'use client';

import { useState, useEffect } from 'react';
import type { Employee } from '@/models/Employee';
import { RoleService, type Role } from '@/services/roleService';
import { EmployeeService } from '@/services/employeeService';
import Roles from './Roles';
import { AddRole } from './AddRole';
import { Notification } from '@/components/ui/notification';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteRole, setPendingDeleteRole] = useState<Role | null>(null);

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
    const role = roles.find((r) => r.name === roleName);
    if (!role) return;
    setPendingDeleteRole(role);
  };

  const confirmDeleteRole = async () => {
    if (!pendingDeleteRole) return;

    try {
      await RoleService.delete(pendingDeleteRole.id);
      setRoles((prev) => prev.filter((r) => r.id !== pendingDeleteRole.id));
    } catch (err) {
      console.error('Failed to delete role', err);
    } finally {
      setPendingDeleteRole(null);
    }
  };

  const cancelDeleteRole = () => {
    setPendingDeleteRole(null);
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

      {pendingDeleteRole && (
        <Notification
          message={`Are you sure you want to delete the role "${pendingDeleteRole.name}"?`}
          onConfirm={confirmDeleteRole}
          onClose={cancelDeleteRole}
        />
      )}
    </>
  );
}
