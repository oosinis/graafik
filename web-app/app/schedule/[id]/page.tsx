// app/schedule/[id]/page.tsx
"use client"

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RoleGuard } from "@/components/RoleGuard";
import { EmployeeService } from "@/services/employeeService";
import { RoleService } from "@/services/roleService";
import type { Employee } from "@/models/Employee";
import type { Role } from "@/services/roleService";
import type { GeneratedSchedule } from "@/models/Schedule";

// Dynamically import MonthScheduleView to avoid SSR issues with react-dnd
const MonthScheduleView = dynamic(() => import("../MonthScheduleView").then(mod => ({ default: mod.MonthScheduleView })), {
  ssr: false
});

interface SchedulePageProps {
  params: { id: string };
}

export default function SchedulePage({ params }: SchedulePageProps) {
  const scheduleId = params.id;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [schedule, setSchedule] = useState<GeneratedSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
        
        // Fetch employees, roles, and schedule in parallel
        const [employeesData, rolesData, scheduleRes] = await Promise.all([
          EmployeeService.getAll(),
          RoleService.getAll(),
          fetch(`${apiUrl}/schedules/${scheduleId}`)
        ]);

        setEmployees(employeesData);
        setRoles(rolesData);

        if (scheduleRes.status === 404) {
          setSchedule(null);
        } else if (scheduleRes.ok) {
          const scheduleData: GeneratedSchedule = await scheduleRes.json();
          setSchedule(scheduleData);
        } else {
          console.error("Failed to fetch schedule:", scheduleRes.status);
          setSchedule(null);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [scheduleId]);

  // Extract year and month from schedule startDate if available
  let year: number | undefined;
  let month: number | undefined;
  if (schedule?.startDate) {
    const dateParts = schedule.startDate.split('-');
    if (dateParts.length === 3) {
      year = parseInt(dateParts[0], 10);
      month = parseInt(dateParts[1], 10);
    }
  }

  return (
    <RoleGuard allowedRoles={['Admin', 'Manager']}>
      <div className="max-w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Schedule overview</h1>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Loading schedule…</p>
          </div>
        ) : (
          <MonthScheduleView
            schedule={schedule}
            employees={employees}
            roles={roles}
            year={year}
            month={month}
          />
        )}
      </div>
    </RoleGuard>
  );
}
