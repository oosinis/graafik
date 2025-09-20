"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ShiftDetailsCard } from "@/components/shift-details-card";
import { MonthNavigation } from "@/components/month-navigation";
import { DayNavigation } from "@/components/day-navigation";
import { ViewModeToggle } from "@/components/view-mode-toggle";
import type { ScheduleResponse } from "@/models/ScheduleResponse";
import React from "react";

interface ScheduleGridViewProps {
  year: number;
  month: number; 
  onMonthChange: (year: number, month: number) => void;
}

const monthNames = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December"
];

export function ScheduleGridView({
  year, month, onMonthChange
}: ScheduleGridViewProps) {
  // modes & data
  const [viewMode, setViewMode] = useState<"monthly"|"weekly"|"daily">("monthly");
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<number>(1);
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(year, month - 1, 1));

  const [selectedShift, setSelectedShift] = useState<{
    day: number;
    workerName: string;
    shiftType: string;
    fte: string;
  } | null>(null);

  const [selectedShiftType, setSelectedShiftType] = useState<string | "All">("All");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
        const res = await fetch(`${apiUrl}/schedule?year=${year}&month=${month}`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data: ScheduleResponse = await res.json();

        if (!cancelled) {
          setSchedule(data);
          setCurrentWeekStart(1);
          setSelectedShift(null);
          setCurrentDate(new Date(year, month - 1, 1));
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setSchedule(null);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const addDays = (d: Date, n: number) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

  //load workers
  const workerNames = useMemo(() => {
    const set = new Set<string>();
    schedule?.daySchedules.forEach(d =>
      d.assignments.forEach(a => set.add(a.worker.name))
    );
    return Array.from(set).sort();
  }, [schedule]);

  // load shifts
  const shiftTypes = useMemo(() => {
    const set = new Set<string>();
    schedule?.daySchedules.forEach(d =>
      d.assignments.forEach(a => a.shift?.type && set.add(a.shift.type))
    );
    return Array.from(set).sort();
  }, [schedule]);

  //Värvid
  const shiftColors: Record<string, string> = useMemo(() => {
    const palette = ["bg-orange-200","bg-teal-200","bg-pink-200","bg-purple-200","bg-blue-200","bg-amber-200","bg-lime-200"];
    const map: Record<string,string> = {};
    shiftTypes.forEach((t, i) => { map[t] = palette[i % palette.length]; });
    return map;
  }, [shiftTypes]);

  //Lühendid
  const shiftAbbrev: Record<string, string> = useMemo(() => {
    const map: Record<string,string> = {};
    shiftTypes.forEach(t => { map[t] = (t[0] || "?").toUpperCase(); });
    return map;
  }, [shiftTypes]);


  const visibleDays = useMemo<number[]>(() => {
    if (viewMode === "daily") {
      return [currentDate.getDate()];
    }
    if (viewMode === "weekly") {
      const end = Math.min(currentWeekStart + 6, daysInMonth);
      return Array.from({ length: end - currentWeekStart + 1 }, (_, i) => currentWeekStart + i);
    }
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [viewMode, currentWeekStart, daysInMonth, currentDate]);

  function shiftFor(workerName: string, day: number): string | null {
    return (
      schedule?.daySchedules
        .find(d => d.dayOfMonth === day)
        ?.assignments.find(a => a.worker.name === workerName)
        ?.shift?.type ?? null
    );
  }

  // navigations
  const prevWeek = () => setCurrentWeekStart(s => Math.max(1, s - 7));
  const nextWeek = () => setCurrentWeekStart(s => s + 7 <= daysInMonth ? s + 7 : s);

  return (
    <div className="w-full space-y-4">
      {/* top bar */}
      <div className="flex justify-between items-center">
        <MonthNavigation
          month={month}
          year={year}
          monthNames={monthNames}
          onPrevious={() => onMonthChange(month === 1 ? year - 1 : year, month === 1 ? 12 : month - 1)}
          onNext={() => onMonthChange(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)}
        />

        <div className="flex items-center space-x-6">
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />

          {/* shift-type filter (derived) */}
          <select
            value={selectedShiftType}
            onChange={e => setSelectedShiftType(e.target.value)}
            className="border p-2 rounded shadow-sm"
          >
            <option value="All">All Shifts</option>
            {shiftTypes.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* weekly controls */}
      {viewMode === "weekly" && (
        <div className="flex justify-end gap-2">
          <Button onClick={prevWeek} disabled={currentWeekStart === 1}>
            Previous week
          </Button>
          <span className="font-medium">
            {visibleDays[0]}–{visibleDays[visibleDays.length - 1]}
          </span>
          <Button onClick={nextWeek} disabled={currentWeekStart + 6 >= daysInMonth}>
            Next week
          </Button>
        </div>
      )}

      {/* daily navigation */}
      {viewMode === "daily" && (
        <DayNavigation
          date={currentDate}
          onPrevious={() => setCurrentDate(d => addDays(d, -1))}
          onNext={() => setCurrentDate(d => addDays(d, +1))}
        />
      )}

      {/* grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-gray-50 border p-2 w-40">Employees</th>
              {visibleDays.map(d => (
                <th key={d} className="border p-2 text-center">{d}</th>
              ))}
              <th className="border p-2 w-24 text-center">Hours</th>
            </tr>
          </thead>
          <tbody>
            {workerNames.map(workerName => (
              <tr key={workerName}>
                <td className="sticky left-0 bg-white border p-2 font-medium">
                  {workerName}
                </td>

                {visibleDays.map(day => {
                  const t = shiftFor(workerName, day);
                  const show = !!t && (selectedShiftType === "All" || t === selectedShiftType);
                  return (
                    <td
                      key={day}
                      className={`border p-1 text-center ${show ? (shiftColors[t!] ?? "bg-gray-100") : ""}`}
                      onClick={() =>
                        t && setSelectedShift({ day, workerName, shiftType: t, fte: "1.0" })
                      }
                    >
                      {show ? (shiftAbbrev[t!] ?? (t![0] || "?").toUpperCase()) : ""}
                    </td>
                  );
                })}

                <td className="border p-2 text-center">
                  {schedule?.workerHours?.[workerName] ?? 0}/180
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {workerNames.length === 0 && (
              <tr>
                <td
                  colSpan={visibleDays.length + 2}
                  className="text-center text-gray-500 p-6"
                >
                  {schedule ? "No assignments for this month." : "Loading schedule…"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* shift details modal */}
      {selectedShift && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedShift(null)}
        >
          <div onClick={e => e.stopPropagation()}>
            <ShiftDetailsCard
              day={`Day ${selectedShift.day}`}
              date={`${selectedShift.day} ${monthNames[month - 1]}`}
              shiftType={selectedShift.shiftType}
              startTime="09:00"
              endTime="17:00"
              hours={8}
              worker={selectedShift.workerName}
              department="—"
              fte={selectedShift.fte}
              onEdit={() => console.log("edit", selectedShift)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
