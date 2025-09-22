/* "use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useShifts } from "@/lib/context/ShiftsContext";
import type { WorkerRole } from "@/models/Worker";
import { Badge } from "@/components/ui/badge";

// Use existing WorkerRole union values; unsupported granular roles can map to "Other"
const ALL_ROLES: WorkerRole[] = ["Chef", "Manager", "Waiter", "Cleaner", "Other"];

export function ShiftForm() {
  const { addShift } = useShifts();
  const router = useRouter();
  const [type, setType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [roles, setRoles] = useState<WorkerRole[]>([]);
  const [error, setError] = useState("");

  function toggleRole(role: WorkerRole) {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!type.trim()) return setError("Shift type is required");
    if (!start || !end) return setError("Start and end times required");
    // Basic HH:MM validation
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(start) || !timeRegex.test(end)) {
      return setError("Times must be in HH:MM 24h format");
    }

    addShift({ type, start, end, roles });
    router.push("/shifts");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-800">Shift Details</h2>
          <button
            type="button"
            className="text-xs font-medium text-violet-600 hover:underline"
            onClick={() => {
              setType("");
              setStart("");
              setEnd("");
              setRoles([]);
            }}
          >
            Reset
          </button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-zinc-600">Shift Title</label>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Morning"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-zinc-600">Shift Length</label>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-[10px] text-zinc-500">From</label>
                <input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="h-9 w-40 rounded-md border border-zinc-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-zinc-500">To</label>
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="h-9 w-40 rounded-md border border-zinc-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="text-xs text-zinc-500">
                {start && end && (() => {
                  const [sh, sm] = start.split(":").map(Number)
                  const [eh, em] = end.split(":").map(Number)
                  const dur = (eh + em / 60) - (sh + sm / 60)
                  if (isNaN(dur) || dur <= 0) return null
                  return <span>{dur.toFixed(1)} hrs</span>
                })()}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-zinc-600">Role</label>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map((role) => {
                const active = roles.includes(role)
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`h-8 rounded-md border px-3 text-xs font-medium transition ${active ? "border-violet-600 bg-violet-600 text-white" : "border-zinc-300 bg-white hover:bg-violet-50"}`}
                  >
                    {role}
                  </button>
                )
              })}
            </div>
            {roles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {roles.map((r) => (
                  <Badge key={r} variant="outline" className="border-violet-200 bg-violet-50 text-[10px] font-medium text-violet-700">
                    {r}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold tracking-tight text-zinc-800">Rule Details</h2>
        <div className="space-y-4">
          <div className="rounded-md border border-dashed p-6 text-center text-xs text-zinc-500">
            Rule creation UI coming soon.
          </div>
          <button
            type="button"
            className="h-9 w-full rounded-md border border-violet-300 bg-violet-50 text-xs font-medium text-violet-700 hover:bg-violet-100"
            onClick={() => alert("Rule creation not implemented yet")}
          >
            Add Rule +
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="h-9 rounded-md bg-violet-600 px-5 text-xs font-medium text-white hover:bg-violet-500"
        >
          Add Shift
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-9 rounded-md border border-zinc-300 px-5 text-xs font-medium hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ShiftForm;
 */