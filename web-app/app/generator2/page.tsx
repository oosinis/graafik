'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Employee } from '@/models/Employee';
import { Shift } from '@/models/Shift';
import { Role } from '@/models/Role';
import { RoleGuard } from '@/components/RoleGuard';
import Generator from './Generator';

export default function GeneratorPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------------
  // Load data on first mount
  // ------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const [empRes, shiftRes, rolesRes] = await Promise.all([
          fetch('/api/employees'),
          fetch('/api/shifts'),
          fetch('/api/roles'),
        ]);

        if (!empRes.ok || !shiftRes.ok || !rolesRes.ok) {
          throw new Error('Failed to load backend data');
        }

        const employeesData: Employee[] = await empRes.json();
        const shiftsData: Shift[] = await shiftRes.json();
        const rolesData: Role[] = await rolesRes.json();

        setEmployees(employeesData);
        setShifts(shiftsData);
        setRoles(rolesData);
      } catch (err) {
        setError('Could not load scheduling data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    try {
      await fetch(`/api/employees/${updatedEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      setEmployees((prev) =>
        prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
      );
    } catch {
      alert('Failed to update employee');
    }
  };

  const handleScheduleGenerated = async (
    schedule: any,
    year: number,
    month: number
  ) => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year,
          month,
          assignments: schedule,
        }),
      });

      if (!response.ok) {
        throw new Error('Schedule failed to save');
      }

      router.push(`/schedule/${year}/${month + 1}`);
    } catch {
      alert('Failed to save schedule');
    }
  };

  if (loading) return <p className="text-center p-6">Loading schedule data…</p>;
  if (error) return <p className="text-red-600 text-center p-6">{error}</p>;

  return (
    <RoleGuard allowedRoles={['Admin', 'Manager']}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Generator
          employees={employees}
          shifts={shifts}
          roles={roles}
          onUpdateEmployee={handleUpdateEmployee}
          onScheduleGenerated={handleScheduleGenerated}
        />
      </div>
    </RoleGuard>
  );
}
