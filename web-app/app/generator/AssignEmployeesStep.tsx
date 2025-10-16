"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Worker } from "@/models/Worker"
import { WorkerProps } from '@/models/Props'
import { v4 as uuidv4 } from 'uuid';


export function AssignEmployeesStep({
  monthName,
  shifts,
  workers,
  activeWorkerId,
  onAddWorker,
  onDeleteWorker,
  onSelectWorker,
  onUpdateWorker,
  onToggleAssignedShift,
  onSetWorkLoad,
  onToggleDesiredVacationDay,
  onToggleVacationDay,
  onSetRequestedWorkDay,
}: WorkerProps) {
  const [adding, setAdding] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [draftRole, setDraftRole] = useState("")  // free text
  const [draftWorkload, setDraftWorkload] = useState<number | "">("")
  const [draftAssignedShiftIds, setDraftAssignedShiftIds] = useState<string[]>([])
  const [draftDesiredDays, setDraftDesiredDays] = useState<number[]>([])
  const [draftApprovedDays, setDraftApprovedDays] = useState<number[]>([])
  const [draftRequested, setDraftRequested] = useState<Record<number, string | null>>({})
  const [draftSickDays, setDraftSickDays] = useState<number[]>([])

  const monthIndex = useMemo(() => (
    ["January","February","March","April","May","June","July","August","September","October","November","December"].indexOf(monthName)
  ), [monthName])

  const daysInMonth = useMemo(() => {
    const year = new Date().getFullYear()
    return new Date(year, monthIndex + 1, 0).getDate() // 28..31
  }, [monthIndex])

  const resetDraft = () => {
    setDraftName("")
    setDraftRole("")             
    setDraftWorkload("")
    setDraftAssignedShiftIds([])
    setDraftDesiredDays([])
    setDraftApprovedDays([])
    setDraftRequested({})
    setDraftSickDays([])
  }

  const openAdd = () => {
    resetDraft()
    setAdding(true)
    onSelectWorker("")
  }

  const cancelAdd = () => {
    resetDraft()
    setAdding(false)
  }

  const saveNewWorker = () => {
  
    const worker: Worker = {
      id: uuidv4().toString(),
      name: draftName.trim(),
      role: draftRole.trim(),        
      email: undefined,
      phone: undefined,
      assignedShifts: draftAssignedShiftIds,
      workLoad: draftWorkload as number,
      desiredVacationDays: [...draftDesiredDays].sort((a,b)=>a-b),
      vacationDays: [...draftApprovedDays].sort((a,b)=>a-b),
      requestedWorkDays: draftRequested,
      sickDays: [...draftSickDays].sort((a,b)=>a-b),
    }
  
    onAddWorker(worker)
    setAdding(false)
    resetDraft()
    onSelectWorker(worker.id)
  }

  const handleSelectWorker = (id: string) => {
    if(adding){
      setAdding(false);
      resetDraft();
    }
    onSelectWorker(id);
  }

  const toggleDraftAssigned = (shiftId: string) => {
    setDraftAssignedShiftIds(prev => 
      prev.includes(shiftId)
        ? prev.filter(id => id !== shiftId)
        : [...prev, shiftId]
    )
  }

  const toggleNumInArray = (arr: number[], v: number) =>
    arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]

  const activeWorker = useMemo(
    () => workers.find(w => w.id === activeWorkerId) ?? null,
    [workers, activeWorkerId]
  )

  const labelForShift = (id: string) => shifts.find(s => s.id === id)?.type ?? id

  return (
    <Card className="p-6">
    {/* Header + Add / Save / Cancel */}
    <div>
      <h2 className="text-2xl font-bold mb-6">Assign Employees</h2>

      <div className="flex flex-wrap mb-6">
      {!adding ? (
          <div className="">
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={openAdd}>
              + Add
          </Button>
          </div>
      ) : (
        <div className="flex gap-2">
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={saveNewWorker}
          >
            Save
          </Button>
          <Button variant="outline" onClick={cancelAdd}>
            Cancel
          </Button>
        </div>
      )}
      </div>

    </div>

    {/* Worker pills */}
    <div className="flex flex-wrap gap-2 mb-6">
      {workers.map(w => {
        const isActive = w.id === activeWorkerId
        return (
          <Button
            key={w.id}
            variant={isActive ? "default" : "outline"}
            className={isActive ? "bg-gray-300 text-black hover:bg-gray-500" : ""}
            onClick={() => handleSelectWorker(w.id)}
            disabled={adding}
          >
            {w.name}
          </Button>
        )
      })}
    </div>

    {/* ADD FORM */}
    {adding && (
      <div className="rounded-lg bg-purple-50 p-4 space-y-6 animate-in fade-in-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Employee Name</label>
            <Input
              value={draftName}
              onChange={e => setDraftName(e.currentTarget.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Input
              value={draftRole}
              onChange={e => setDraftRole(e.currentTarget.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Workload (0–1)</label>
            <Input
              type="number"
              step={0.05}
              min={0}
              max={1}
              value={draftWorkload}
              onChange={e => {
                const v = e.currentTarget.value
                setDraftWorkload(v === "" ? "" : Math.min(1, Math.max(0, e.currentTarget.valueAsNumber)))
              }}
            />
          </div>
        </div>

        {/* Assigned Shifts (draft) */}
        <div>
          <label className="block text-sm font-medium mb-2">Assigned Shifts</label>
          <div className="flex flex-wrap gap-2">
            {shifts.length === 0 && (
              <span className="text-sm text-gray-500">No shifts yet. Add shifts first.</span>
            )}
            {shifts.map(s => {
              const on = draftAssignedShiftIds.includes(s.id)
              return (
                <Button
                  key={s.id}
                  variant={on ? "default" : "outline"}
                  className={on ? "bg-purple-600 hover:bg-purple-700" : ""}
                  onClick={() => toggleDraftAssigned(s.id)}
                >
                  {labelForShift(s.id)}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Desired / Approved Vacation Days */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Desired Vacation Days</label>
            <DayStrip
              days={daysInMonth}
              selected={new Set(draftDesiredDays)}
              onToggle={d => setDraftDesiredDays(prev => toggleNumInArray(prev, d))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Approved Vacation Days</label>
            <DayStrip
              days={daysInMonth}
              selected={new Set(draftApprovedDays)}
              onToggle={d => setDraftApprovedDays(prev => toggleNumInArray(prev, d))}
            />
          </div>
        </div>

        {/* Requested work days*/}
        <div>
          <label className="block text-sm font-medium mb-2">Requested Work Days</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const currentShiftId = draftRequested[day] ?? ""
              const assignedForDraft = shifts.filter(s => draftAssignedShiftIds.includes(s.id))

              return (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-6 text-right">{day}</span>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={currentShiftId || ""}
                    onChange={e =>
                      setDraftRequested(prev => ({
                        ...prev,
                        [day]: e.target.value ? e.target.value : null,
                      }))
                    }
                  >
                    <option value="">—</option>
                    {assignedForDraft.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.type}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sick days*/}
        <div>
          <label className="block text-sm font-medium mb-2">Sick Days</label>
          <DayStrip
            days={daysInMonth}
            selected={new Set(draftSickDays)}
            onToggle={d => setDraftSickDays(prev => toggleNumInArray(prev, d))}
          />
        </div>
      </div>
    )}

    {/* EDIT EXISTING WORKER */}
    {activeWorker && !adding && (
      <Card className="space-y-6 p-6 rounded-lg bg-gray-50">
        {/* Top row: name, role, delete */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="grow">
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              value={activeWorker.name}
              onChange={e => onUpdateWorker(activeWorker.id, { name: e.currentTarget.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Input
              value={activeWorker.role ?? ""}
              onChange={e => onUpdateWorker(activeWorker.id, { role: e.currentTarget.value })}
              placeholder="e.g. Waiter"
              className="w-48"
            />
          </div>

          <div className="ml-auto">
            <Button
              variant="destructive"
              onClick={() => {
                onDeleteWorker(activeWorker.id)
                onSelectWorker("") 
              }}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Workload + Assigned Shifts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Workload (0–1)</label>
            <Input
              type="number"
              step={0.05}
              min={0}
              max={1}
              value={activeWorker.workLoad}
              onChange={e => {
                const v = e.currentTarget.valueAsNumber
                if (!Number.isNaN(v)) {
                  onSetWorkLoad(activeWorker.id, Math.min(1, Math.max(0, v)))
                }
              }}
              className="max-w-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Assigned Shifts</label>
            <div className="flex flex-wrap gap-2">
              {shifts.map(s => {
                const on = (activeWorker.assignedShifts ?? []).some(id => id === s.id)
                return (
                  <Button
                    key={s.id}
                    variant={on ? "default" : "outline"}
                    className={on ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => onToggleAssignedShift(activeWorker.id, s.id)}
                  >
                    {s.type}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Vacation preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Desired Vacation Days</label>
            <DayStrip
              days={daysInMonth}
              selected={new Set(activeWorker.desiredVacationDays)}
              onToggle={d => onToggleDesiredVacationDay(activeWorker.id, d)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Approved Vacation Days</label>
            <DayStrip
              days={daysInMonth}
              selected={new Set(activeWorker.vacationDays)}
              onToggle={d => onToggleVacationDay(activeWorker.id, d)}
            />
          </div>
        </div>

        {/* Requested work days */}
        <div>
          <label className="block text-sm font-medium mb-2">Requested Work Days</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const currentShiftId = activeWorker.requestedWorkDays[day] ?? ""
              const updateAssignedShifts = (activeWorker.assignedShifts ?? [])
              return (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-6 text-right">{day}</span>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={currentShiftId || ""}
                    onChange={e => onSetRequestedWorkDay(activeWorker.id, day, e.target.value || null)}
                  >
                    <option value="">—</option>
                    {updateAssignedShifts.map(id => (
                      <option key={id} value={id}>
                        {labelForShift(id)}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sick days*/}
        <div>
          <label className="block text-sm font-medium mb-2">Sick Days</label>
          <DayStrip
            days={daysInMonth}
            selected={new Set(activeWorker.sickDays)}
            onToggle={d => {
              const next = activeWorker.sickDays.includes(d)
                ? activeWorker.sickDays.filter(x => x !== d)
                : [...activeWorker.sickDays, d]
              onUpdateWorker(activeWorker.id, { sickDays: next })
            }}          
            />
        </div>
      </Card>
    )}
  </Card>
  )
}

function DayStrip({
  days,
  selected,
  onToggle,
}: { days: number; selected: Set<number>; onToggle: (day: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: days }, (_, i) => i + 1).map(d => {
        const on = selected.has(d)
        return (
          <Button
            key={d}
            size="sm"
            variant={on ? "default" : "outline"}
            className={`w-10 ${on ? "bg-purple-600 hover:bg-purple-700" : ""}`}
            onClick={() => onToggle(d)}
          >
            {d}
          </Button>
        )
      })}
    </div>
  )
}
