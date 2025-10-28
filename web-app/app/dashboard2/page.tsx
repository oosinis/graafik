"use client";

import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import type { Employee } from "@/models/Employee";
import type { Shift } from "@/models/Shift";
import type { GeneratedSchedule } from "@/models/Schedule";
import type { Role } from "@/models/Role";
import { EmployeeService } from "@/services/employeeService";
import { RoleService } from "@/services/roleService";
import { ShiftsService } from "@/services/shiftService";
import { ScheduleService } from "@/services/scheduleService";

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [generatedSchedules, setGeneratedSchedules] =
    useState<{ [key: string]: GeneratedSchedule }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeesData, rolesData, shiftsData, schedulesData] = await Promise.all([
          EmployeeService.getAll(),
          RoleService.getAll(),
          ShiftsService.getAll(),
          ScheduleService.getAll(),
        ]);

        setEmployees(employeesData);
        setRoles(rolesData);
        setShifts(shiftsData);
        setGeneratedSchedules(schedulesData); //Check the schedule data structure

      } catch (e) {
        console.error("Dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <Dashboard
      employees={employees}
      roles={roles}
      shifts={shifts}
      generatedSchedules={generatedSchedules}
    />
  );
}