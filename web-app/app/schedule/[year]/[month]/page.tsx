// web-app/app/schedule/[year]/[month]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ScheduleGridView } from "@/components/schedule-grid-view";
import { Button } from "@/components/ui/button"; // ✅ Make sure this exists

export default function SchedulePage() {
  const { year, month } = useParams() as { year: string; month: string };
  const router = useRouter();

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    router.push(`/schedule/${newYear}/${newMonth}`);
  };

  const handleNewScheduleClick = () => {
    router.push("/generator");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Schedule for {monthNum}/{yearNum}
        </h1>
        <Button onClick={handleNewScheduleClick}>New Schedule</Button>
      </div>

      <ScheduleGridView
        year={yearNum}
        month={monthNum}
        onMonthChange={handleMonthChange}
      />
    </div>
  );
}