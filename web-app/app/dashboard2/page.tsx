"use client";

import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import type { Employee } from "@/models/Employee";
import type { Shift } from "@/models/Shift";
import type { GeneratedSchedule } from "@/models/Schedule";
import type { Role } from "@/models/Role";

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
        const [empRes, roleRes, shiftRes, schedRes] = await Promise.all([
          fetch("/api/employees"),
          fetch("/api/roles"),
          fetch("/api/shifts"),
          fetch("/api/schedules"),
        ]);

        setEmployees(await empRes.json());
        setRoles(await roleRes.json());
        setShifts(await shiftRes.json());
        setGeneratedSchedules(await schedRes.json());
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
