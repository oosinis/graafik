"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Employee } from "@/models/Employee";
import { Shift } from "@/models/Shift";
import { Role } from "@/models/Role";
import { ScheduleResponse } from "@/models/ScheduleResponse";
// import { RoleGuard } from "@/components/RoleGuard"; // Temporarily disabled for testing
import Generator from "./Generator";
import { EmployeeService } from "@/services/employeeService";
import { ShiftsService } from "@/services/shiftService";
import { RoleService } from "@/services/roleService";

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
        const [employeesData, shiftsData, rolesData] = await Promise.all([
          EmployeeService.getAll(),
          ShiftsService.getAll(),
          RoleService.getAll(),
        ]);

        setEmployees(employeesData);
        setShifts(shiftsData);
        setRoles(rolesData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Could not load scheduling data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    try {
      await EmployeeService.update(updatedEmployee.id, updatedEmployee);

      setEmployees(prev =>
        prev.map(e => (e.id === updatedEmployee.id ? updatedEmployee : e))
      );
    } catch (err) {
      console.error("Failed to update employee:", err);
      alert("Failed to update employee");
    }
  };

  const handleScheduleGenerated = async (scheduleResponse: ScheduleResponse, year: number, month: number) => {
    try {
      // Schedule is already saved by the backend, navigate using the schedule ID
      const scheduleId = scheduleResponse.id;
      
      if (!scheduleId) {
        throw new Error("Schedule ID not found in response");
      }

      console.log('📅 Navigating to schedule view:', {
        scheduleId: scheduleId,
        year: scheduleResponse.year,
        month: scheduleResponse.month
      });

      // Navigate to schedule view using the schedule ID
      router.push(`/schedule/${scheduleId}`);
    } catch (err) {
      console.error("Failed to navigate to schedule:", err);
      alert("Schedule generated successfully, but failed to navigate to schedule view");
    }
  };

  if (loading) return <p className="text-center p-6">Loading schedule data…</p>;
  if (error) return <p className="text-red-600 text-center p-6">{error}</p>;

  // Temporarily removed RoleGuard for testing - add back after verifying API calls work
  // To re-enable: uncomment the import and wrap the return with <RoleGuard allowedRoles={["Admin", "Manager"]}>
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Generator
        employees={employees}
        shifts={shifts}
        roles={roles}
        onUpdateEmployee={handleUpdateEmployee}
        onScheduleGenerated={handleScheduleGenerated}
      />
    </div>
  );
}
