// app/schedule/[id]/page.tsx
"use client"

import { RoleGuard } from "@/components/RoleGuard";
import ScheduleGridView from "@/components/schedule-grid-view";

interface SchedulePageProps {
  params: { id: string };
}

export default async function SchedulePage({ params }: SchedulePageProps) {
  const scheduleId = params.id;

  return (
    <RoleGuard allowedRoles={['Admin', 'Manager']}>
      <div className="max-w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Schedule overview</h1>
        <ScheduleGridView scheduleId={scheduleId} />
      </div>
    </RoleGuard>
  );
}
