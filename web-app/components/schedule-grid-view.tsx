'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { MonthNavigation } from '@/components/month-navigation';
import { DayNavigation } from '@/components/day-navigation';
import { ViewModeToggle } from '@/components/view-mode-toggle';
import type { ScheduleResponse } from '@/models/ScheduleResponse';
import { ShiftDetailsCard } from '@/components/shift-details-card';

interface ScheduleGridViewProps {
  scheduleId?: string;
  initialMonth?: number;
  initialYear?: number;
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function ScheduleGridView({
  scheduleId,
  initialMonth = new Date().getMonth() + 1,
  initialYear = new Date().getFullYear(),
}: ScheduleGridViewProps) {
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly' | 'daily'>(
    'monthly'
  );
  const [currentWeekStart, setCurrentWeekStart] = useState(1);
  const [currentDate, setCurrentDate] = useState(
    new Date(initialYear, initialMonth - 1, 1)
  );
  const [selectedShift, setSelectedShift] = useState<{
    day: number;
    workerName: string;
    shiftType: string;
    duration: number;
  } | null>(null);
  const [selectedShiftType, setSelectedShiftType] = useState<string | 'All'>(
    'All'
  );
  const [noScheduleFound, setNoScheduleFound] = useState(false);

  // fetch schedule by month/year or by ID
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
        let res;

        if (scheduleId) {
          // Fetch by specific ID
          res = await fetch(`${apiUrl}/schedules/${scheduleId}`);
        } else {
          // Fetch latest by month/year
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          res = await fetch(
            `${apiUrl}/schedules/latest?month=${month}&year=${year}`
          );
        }

        if (res.status === 404) {
          if (!cancelled) {
            setSchedule(null);
            setNoScheduleFound(true);
          }
          return;
        }

        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data: ScheduleResponse = await res.json();
        console.log('Schedule API response:', data);
        console.log('Day schedules:', data.daySchedules);
        if (data.daySchedules && data.daySchedules.length > 0) {
          console.log('First day schedule:', data.daySchedules[0]);
          console.log(
            'First day assignments:',
            data.daySchedules[0]?.assignments
          );
        }
        if (!cancelled) {
          setSchedule(data);
          setCurrentWeekStart(1);
          setSelectedShift(null);
          setNoScheduleFound(false);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setSchedule(null);
          setNoScheduleFound(true);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [scheduleId, currentDate]);

  // Move all useMemo hooks BEFORE the early return
  const workerNameToId = useMemo(() => {
    if (!schedule || !schedule.workers) return {};
    const map: Record<string, string> = {};

    // Build map from the workers list
    schedule.workers.forEach((worker) => {
      map[worker.name] = worker.id;
    });

    // Also include workers from assignments (in case there are any discrepancies)
    schedule.daySchedules.forEach((d) =>
      d.assignments?.forEach((a) => {
        map[a.worker.name] = a.worker.id;
      })
    );

    return map;
  }, [schedule]);

  const workerNames = useMemo(() => {
    if (!schedule || !schedule.workers) return [];

    // Get all workers from the workers list (includes all workers, even those without assignments)
    return schedule.workers.map((worker) => worker.name).sort();
  }, [schedule]);

  const shiftTypes = useMemo(() => {
    if (!schedule) return [];
    const set = new Set<string>();
    schedule.daySchedules.forEach((d) =>
      d.assignments?.forEach((a) => a.shift?.type && set.add(a.shift.type))
    );
    return Array.from(set).sort();
  }, [schedule]);

  const shiftColors = useMemo(() => {
    const palette = [
      'bg-orange-200',
      'bg-teal-200',
      'bg-pink-200',
      'bg-purple-200',
      'bg-blue-200',
      'bg-amber-200',
      'bg-lime-200',
    ];
    const map: Record<string, string> = {};
    shiftTypes.forEach((t, i) => {
      map[t] = palette[i % palette.length];
    });
    return map;
  }, [shiftTypes]);

  const shiftAbbrev = useMemo(() => {
    const map: Record<string, string> = {};
    shiftTypes.forEach((t) => {
      map[t] = (t[0] || '?').toUpperCase();
    });
    return map;
  }, [shiftTypes]);

  const visibleDays = useMemo(() => {
    if (!schedule) return [];
    const daysInMonth = new Date(schedule.year, schedule.month, 0).getDate();
    if (viewMode === 'daily') return [currentDate.getDate()];
    if (viewMode === 'weekly') {
      const end = Math.min(currentWeekStart + 6, daysInMonth);
      return Array.from(
        { length: end - currentWeekStart + 1 },
        (_, i) => currentWeekStart + i
      );
    }
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [schedule, viewMode, currentWeekStart, currentDate]);

  // Get current date info even when no schedule is found
  const year = schedule?.year ?? currentDate.getFullYear();
  const apiMonthOneBased = schedule?.month ?? currentDate.getMonth() + 1;
  const monthIndex = apiMonthOneBased - 1;

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const addDays = (d: Date, n: number) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

  const assignmentFor = (workerName: string, day: number) => {
    const dayRec = schedule?.daySchedules.find((d) => {
      // If API uses 1-based days, this is a no-op; if it uses 0-based, +1 fixes it.
      const apiDay = typeof d.dayOfMonth === 'number' ? d.dayOfMonth : NaN;
      const uiDay = apiDay >= 1 ? apiDay : apiDay + 1; // 1..31
      return uiDay === day;
    });
    return (
      dayRec?.assignments?.find((a) => a.worker.name === workerName) ?? null
    );
  };

  function getDurationMinutes(
    a: ReturnType<typeof assignmentFor>
  ): number | null {
    if (!a?.shift) return null;
    const raw =
      (a.shift as any).durationInMinutes ?? (a.shift as any).duration ?? null;

    return typeof raw === 'string' ? Number(raw) : raw;
  }

  const prevWeek = () => setCurrentWeekStart((s) => Math.max(1, s - 7));
  const nextWeek = () =>
    setCurrentWeekStart((s) => (s + 7 <= daysInMonth ? s + 7 : s));

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <MonthNavigation
          month={apiMonthOneBased}
          year={year}
          monthNames={monthNames}
          onPrevious={() =>
            setCurrentDate((d) => new Date(d.getFullYear(), monthIndex - 1, 1))
          }
          onNext={() =>
            setCurrentDate((d) => new Date(d.getFullYear(), monthIndex + 1, 1))
          }
        />
        {schedule && (
          <div className="flex items-center space-x-6">
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            <select
              value={selectedShiftType}
              onChange={(e) => setSelectedShiftType(e.target.value)}
              className="border p-2 rounded shadow-sm"
            >
              <option value="All">All Shifts</option>
              {shiftTypes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!schedule && noScheduleFound && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            No Schedule for this month yet
          </p>
        </div>
      )}

      {!schedule && !noScheduleFound && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Loading schedule…</p>
        </div>
      )}

      {schedule && (
        <>
          {viewMode === 'weekly' && (
            <div className="flex justify-end gap-2">
              <Button onClick={prevWeek} disabled={currentWeekStart === 1}>
                Previous week
              </Button>
              <span className="font-medium">
                {visibleDays[0]}–{visibleDays[visibleDays.length - 1]}
              </span>
              <Button
                onClick={nextWeek}
                disabled={currentWeekStart + 6 >= daysInMonth}
              >
                Next week
              </Button>
            </div>
          )}

          {viewMode === 'daily' && (
            <DayNavigation
              date={currentDate}
              onPrevious={() => setCurrentDate((d) => addDays(d, -1))}
              onNext={() => setCurrentDate((d) => addDays(d, +1))}
            />
          )}

          {/* grid */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-gray-50 border p-2 w-40">
                    Employees
                  </th>
                  {visibleDays.map((d) => (
                    <th key={d} className="border p-2 text-center">
                      {d}
                    </th>
                  ))}
                  <th className="border p-2 w-24 text-center">Hours</th>
                </tr>
              </thead>
              <tbody>
                {workerNames.map((workerName) => (
                  <tr key={workerName}>
                    <td className="sticky left-0 bg-white border p-2 font-medium">
                      {workerName}
                    </td>
                    {visibleDays.map((day) => {
                      const a = assignmentFor(workerName, day);
                      const t = a?.shift?.type ?? null;
                      const durationInMinutes = getDurationMinutes(a);

                      if (a && typeof window !== 'undefined') {
                        // Only log the first time we see a duration for this worker/day
                        // eslint-disable-next-line no-console
                        console.debug('Shift payload for check:', a.shift);
                      }

                      const show =
                        !!t &&
                        (selectedShiftType === 'All' ||
                          t === selectedShiftType);
                      return (
                        <td
                          key={day}
                          className={`border p-1 text-center ${
                            show ? shiftColors[t!] ?? 'bg-gray-100' : ''
                          }`}
                          onClick={() => {
                            if (t && durationInMinutes != null) {
                              setSelectedShift({
                                day,
                                workerName,
                                shiftType: t,
                                duration: durationInMinutes,
                              });
                            }
                          }}
                        >
                          {show
                            ? shiftAbbrev[t!] ?? (t![0] || '?').toUpperCase()
                            : ''}
                        </td>
                      );
                    })}
                    <td className="border p-2 text-center">
                      {schedule.workerHours?.[workerNameToId[workerName]] ?? 0}
                      /180
                    </td>
                  </tr>
                ))}
                {workerNames.length === 0 && (
                  <tr>
                    <td
                      colSpan={visibleDays.length + 2}
                      className="text-center text-gray-500 p-6"
                    >
                      {schedule
                        ? 'No assignments for this month.'
                        : 'Loading schedule…'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedShift && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setSelectedShift(null)}
            >
              <div onClick={(e) => e.stopPropagation()} o>
                <ShiftDetailsCard
                  day={selectedShift.day}
                  shiftType={selectedShift.shiftType}
                  worker={selectedShift.workerName}
                  duration={selectedShift.duration / 60}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
