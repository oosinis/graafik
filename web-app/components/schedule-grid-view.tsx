"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ShiftDetailsCard } from "@/components/shift-details-card";
import { MonthNavigation } from "@/components/month-navigation";
import { ViewModeToggle } from "@/components/view-mode-toggle";
import type { ScheduleResponse } from "@/models/ScheduleResponse";
import type { WorkerDto } from "@/models/WorkerDto";
import type { ShiftAssignment } from "@/models/ShiftAssignment";
import type { DaySchedule } from "@/models/DaySchedule";
import React from "react";

interface ScheduleGridViewProps {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

const monthNames = [
  "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni",
  "Juuli", "August", "September", "Oktoober", "November", "Detsember"
];

const shiftTypes = ["Hommik", "Päev", "Õhtu", "Öö"];

const shiftAbbreviations: Record<string, string> = {
  Hommik: "H",
  Päev: "P",
  Õhtu: "Õ",
  Öö: "Ö"
};

const shiftColors: Record<string, string> = {
  Hommik: "bg-orange-200",
  Päev: "bg-teal-200",
  Õhtu: "bg-pink-200",
  Öö: "bg-purple-200"
};

const groupedRoles: Record<string, string[]> = {
  Vahetusevanem: ["Sander Saar", "Mirjam Laane"],
  Ettekandjad: ["Gregor Ojamets", "Jürgen Kask"],
  Kokad: ["Andres Allik", "Liis Lepp"]
};

export function ScheduleGridView({ year, month, onMonthChange }: ScheduleGridViewProps) {
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">("monthly");
  const [selectedShift, setSelectedShift] = useState<{
    day: number;
    worker: string;
    shift: string;
    fte: string;
  } | null>(null);

  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedShiftType, setSelectedShiftType] = useState<string>("All");

  useEffect(() => {
    const mock = generateMockSchedule(year, month);
    setSchedule(mock);
  }, [year, month]);

  const generateMockSchedule = (year: number, month: number): ScheduleResponse => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const workers: WorkerDto[] = Object.values(groupedRoles).flat().map(name => ({ name }));
    const workerHours: Record<string, number> = {};

    workers.forEach(w => {
      workerHours[w.name] = Math.floor(Math.random() * 40) + 140;
    });

    const daySchedules: DaySchedule[] = Array.from({ length: daysInMonth }, (_, i) => {
      const assignments: ShiftAssignment[] = [];
      shiftTypes.forEach((type, index) => {
        const workerIndex = (i + index) % workers.length;
        assignments.push({
          shift: { type, length: 8 },
          worker: workers[workerIndex]
        });
      });
      return { dayOfMonth: i + 1, assignments, score: 0 };
    });

    return { year, month, daySchedules, workerHours, score: 0 };
  };

  const getShiftForWorkerOnDay = (worker: string, day: number): string | null => {
    const scheduleForDay = schedule?.daySchedules.find(d => d.dayOfMonth === day);
    const shift = scheduleForDay?.assignments.find(a => a.worker.name === worker)?.shift.type;
    return shift ?? null;
  };

  const getWorkerHours = (worker: string) => schedule?.workerHours[worker] ?? 0;

  const daysInMonth = new Date(year, month, 0).getDate();

  const getVisibleDays = (): number[] => {
    if (viewMode === "weekly") {
      const weekStart = Math.floor(new Date().getDate() / 7) * 7;
      return Array.from({ length: 7 }, (_, i) => weekStart + i + 1).filter(day => day <= daysInMonth);
    }
    if (viewMode === "daily") {
      return [new Date().getDate()];
    }
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = getVisibleDays();

  const filteredGroupedRoles = Object.entries(groupedRoles).reduce((acc, [role, workers]) => {
    if (selectedRole === "All" || selectedRole === role) acc[role] = workers;
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <MonthNavigation
          month={month}
          year={year}
          monthNames={monthNames}
          onPrevious={() => onMonthChange(month === 1 ? year - 1 : year, month === 1 ? 12 : month - 1)}
          onNext={() => onMonthChange(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)}
        />
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button className="bg-purple-600 text-white">Publish</Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        <div className="flex gap-4">
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="border p-2 rounded shadow-sm">
            <option value="All">All Roles</option>
            {Object.keys(groupedRoles).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select value={selectedShiftType} onChange={(e) => setSelectedShiftType(e.target.value)} className="border p-2 rounded shadow-sm">
            <option value="All">All Shifts</option>
            {shiftTypes.map(shift => (
              <option key={shift} value={shift}>{shift}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border bg-gray-50 w-40 sticky left-0 z-10 p-2">Worker</th>
              {days.map(day => (
                <th key={day} className="border bg-gray-50 p-2 text-center">{day}</th>
              ))}
              <th className="border bg-gray-50 w-28 text-center">Tunnid</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredGroupedRoles).map(([role, workers]) => (
              <React.Fragment key={role}>
                <tr className="bg-purple-100 font-semibold text-left text-sm">
                  <td colSpan={days.length + 2} className="border px-4 py-2 sticky left-0 z-0">{role}</td>
                </tr>
                {workers.map(worker => (
                  <tr key={worker}>
                    <td className="border p-2 bg-white sticky left-0 z-10">
                      <div className="font-medium">{worker}</div>
                      <div className="text-xs text-gray-500">FTE 1.0</div>
                    </td>
                    {days.map(day => {
                      const shift = getShiftForWorkerOnDay(worker, day);
                      const show = !selectedShiftType || selectedShiftType === "All" || shift === selectedShiftType;
                      return (
                        <td key={day} className="border p-1 bg-white text-center">
                          {shift && show ? (
                            <div
                              className={`p-2 rounded text-sm ${shiftColors[shift]}`}
                              onClick={() => setSelectedShift({ day, worker, shift, fte: "1.0" })}
                            >
                              {shiftAbbreviations[shift]}
                            </div>
                          ) : "-"}
                        </td>
                      );
                    })}
                    <td className="border p-2 text-center bg-white font-medium">
                      {getWorkerHours(worker)}/180
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {selectedShift && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedShift(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <ShiftDetailsCard
              day={`Day ${selectedShift.day}`}
              date={`${selectedShift.day} ${monthNames[month - 1]}`}
              shiftType={selectedShift.shift}
              startTime="09:00"
              endTime="17:00"
              hours={8}
              worker={selectedShift.worker}
              department="Intensiivosakond"
              fte={selectedShift.fte}
              onEdit={() => console.log("Edit shift", selectedShift)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
