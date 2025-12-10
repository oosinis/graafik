"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import type { Shift, ShiftRule } from '@/models/Shift';

interface ShiftsContextValue {
  shifts: Shift[];
  isLoading: boolean;
  error?: unknown;
  getAllShifts: () => Promise<Shift[]>;
  addShift: (input: Partial<Shift>) => Promise<Shift | null>;
  deleteShift: (id: string) => Promise<boolean>;
}

const ShiftsContextInternal = createContext<ShiftsContextValue | undefined>(undefined);

// Helper: convert server shift -> client Shift
function serverToClient(s: any): Shift {
  const duration = s.durationInMinutes ?? 0;
  // produce a simple start/end using 00:00 as start for display if times aren't provided
  const start = s.startTime ?? '00:00';
  let end = s.endTime;
  if (!end) {
    const minutes = duration % (24 * 60);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    end = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }
  const rules = (s.rules || []).map((r: any) => ({
    id: r.id?.toString?.(),
    name: r.name,
    daysApplied: (r.daysApplied || []).map((d: number) => mapDayNumberToName(d)),
    priority: r.priority,
    shiftsPerDay: r.perDay ?? r.shiftsPerDay ?? 1,
    continuousDays: r.continuousDays ?? 0,
    daysOff: r.restDays ?? r.daysOff ?? 0,
  }));

  return {
    id: s.id ?? s.uuid ?? String(Math.random()),
    name: s.name,
    type: s.type,
    startTime: start,
    endTime: end,
    durationInMinutes: duration,
    rules,
    createdAt: s.createdAt ?? s.created_at,
  };
}

function mapDayNumberToName(n: number) {
  const map = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  // server uses 1..7 for Monday..Sunday in earlier code; handle both
  if (n >= 1 && n <= 7) {
    // assume 1=Monday -> index 1
    return (['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'])[n-1];
  }
  return map[n % 7] ?? String(n);
}

function mapDayNameToNumber(name: string) {
  const nm = name.toLowerCase();
  const map: Record<string, number> = { monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6, sunday:7 };
  return map[nm] ?? 0;
}

export function ShiftsContext({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  async function getAllShifts() {
    setIsLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`${apiBase}/shifts`);
      if (!res.ok) throw new Error(`Failed fetching shifts ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data.map(serverToClient) : [];
      setShifts(list);
      return list;
    } catch (err) {
      setError(err);
      setShifts([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // fetch on mount
    getAllShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function minutesBetween(start = '00:00', end = '00:00') {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let mins = (eh*60 + em) - (sh*60 + sm);
    if (mins < 0) mins += 24*60;
    return mins;
  }

  function mapRuleToServer(r: ShiftRule) {
    return {
      // server expects integers for daysApplied
      daysApplied: (r.daysApplied || []).map(d => mapDayNameToNumber(typeof d === 'string' ? d : String(d))),
      perDay: r.shiftsPerDay ?? 1,
      restDays: r.daysOff ?? 0,
      continuousDays: r.continuousDays ?? 0,
      priority: (r.priority || 'medium').toLowerCase(),
    };
  }

  async function addShift(input: Partial<Shift>) {
    setIsLoading(true);
    setError(undefined);
    try {
      const durationInMinutes = minutesBetween(input.startTime ?? '00:00', input.endTime ?? '00:00');
      const payload: any = {
        type: input.type ?? 'Day',
        durationInMinutes,
        startTime: input.startTime,
        endTime: input.endTime,
        rules: (input.rules || []).map(mapRuleToServer),
      };
      // include name if backend supports it (harmless if ignored)
      if (input.name) payload.name = input.name;

      const res = await fetch(`${apiBase}/shifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed saving shift ${res.status}`);
      const saved = await res.json();
      const client = serverToClient(saved);
      setShifts(prev => [client, ...prev]);
      return client;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteShift(id: string) {
    // Backend currently has no DELETE endpoint; if you add one, call it here.
    // For now we optimistically remove from local state and return false to indicate no server call.
    setShifts(prev => prev.filter(s => s.id !== id));
    return false;
  }

  const value: ShiftsContextValue = {
    shifts,
    isLoading,
    error,
    getAllShifts,
    addShift,
    deleteShift,
  };

  return <ShiftsContextInternal.Provider value={value}>{children}</ShiftsContextInternal.Provider>;
}

export function useShifts() {
  const ctx = useContext(ShiftsContextInternal);
  if (!ctx) throw new Error('useShifts must be used within <ShiftsContext> provider');
  return ctx;
}