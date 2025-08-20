import { Shift, WorkerFE } from "@/types/types";

export function mapShiftToBE(s: Shift) {
    return {
      type: s.type,
      duration: s.durationInMinutes,
      rules: s.rules.map(r => ({
        daysApplied: r.daysApplied,
        perDay: r.perDay,
        restDays: r.restDays,
        continuousDays: r.continuousDays,
        priority: r.priority,
      })),
    };
  }
  
  export function mapWorkerToBE(w: WorkerFE, shiftById: Map<string, Shift>) {
    const toBeShift = (id?: string | null) => {
      if (!id) return null;
      const s = shiftById.get(id);
      if (!s) return null;
      return mapShiftToBE(s);
    };
  
    const requestedWorkDays: Record<number, any> = {};
    for (const [dayStr, sid] of Object.entries(w.requestedWorkDays)) {
      const beShift = toBeShift(sid);
      if (beShift) requestedWorkDays[Number(dayStr)] = beShift;
    }
  
    return {
      name: w.name,
      assignedShifts: w.assignedShiftIds.map(id => toBeShift(id)).filter(Boolean),
      workLoad: w.workLoad,
      desiredVacationDays: w.desiredVacationDays,
      vacationDays: w.vacationDays,
      requestedWorkDays,
      sickDays: w.sickDays,
    };
  }