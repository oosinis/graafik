// app/schedule/page.tsx
"use client"

import { RoleGuard } from "@/components/RoleGuard";
import ScheduleGridView from "@/components/schedule-grid-view";

export default function SchedulePage() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear();

  return (
    <RoleGuard allowedRoles={['Admin', 'Manager']}>
      <div className="max-w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Current Schedule</h1>
        <ScheduleGridView
          initialMonth={currentMonth}
          initialYear={currentYear}
        />
      </div>
    </RoleGuard>
  );
}