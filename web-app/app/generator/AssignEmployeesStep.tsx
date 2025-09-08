"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shift } from '@/models/Shift'
import { Worker } from "@/models/Worker"
import { WorkerProps } from '@/models/Props'

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
  const [newWorkload, setNewWorkload] = useState("")
  const [newVacationPreferences, setNewVacationPreferences] = useState([])
  const [newApprovedVacationDays, setNewApprovedVacationDays] = useState([])
  const [newRequestedDays, setNewRequestedDays] = useState([])

  const monthIndex = useMemo(() => (
    ["January","February","March","April","May","June","July","August","September","October","November","December"].indexOf(monthName)
  ), [monthName])

  const daysInMonth = useMemo(() => {
    const year = new Date().getFullYear()
    return new Date(year, monthIndex + 1, 0).getDate() // 28..31
  }, [monthIndex])

  const resetDraft = () => {
    setNewWorkload("");
    setNewVacationPreferences([])
    setNewApprovedVacationDays([])
    setNewRequestedDays([])
  }

  const openAdd = () => {
    resetDraft()
    setAdding(true)
    onSelectWorker("")
  }

  const activeWorker = workers.find(w => w.id === activeWorkerId)

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Assign Employees</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex flex-wrap gap-2 mb-6">
        {workers.map(w => {
          const active = w.id === activeWorkerId
          return (
            <Button
              key={w.id}
              variant={active ? "default" : "outline"}
              className={active ? "bg-purple-600 hover:bg-purple-700" : ""}
              onClick={() => setActiveWorkerId(w.id)}
            >
              {w.name}
            </Button>
          )
        })}
      </div>
      <div>
        <Button             
        className="bg-purple-600 hover:bg-purple-700"
        onClick={openAdd}>
          + Add
        </Button>
        </div>
      </div>
{activeWorker && (
        <div className="space-y-6">
          {/* Workload */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Workload (0–1)</label>
              <Input
                type="number"
                step={0.05}
                min={0}
                max={1}
                value={activeWorker.workLoad}
                onChange={(e) => {
                  const v = e.currentTarget.valueAsNumber
                  if (!Number.isNaN(v)) onSetWorkLoad(activeWorker.id, Math.min(1, Math.max(0, v)))
                }}
                className="max-w-xs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Assigned Shifts</label>
              <div className="flex flex-wrap gap-2">
                {shifts.map(s => {
                  const on = activeWorker.assignedShifts.includes(s)
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Desired Vacation Days</label>
              <DayStrip
                days={daysInMonth}
                selected={new Set(activeWorker.desiredVacationDays)}
                onToggle={(d) => onToggleDesiredVacationDay(activeWorker.id, d)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Approved Vacation Days</label>
              <DayStrip
                days={daysInMonth}
                selected={new Set(activeWorker.vacationDays)}
                onToggle={(d) => onToggleVacationDay(activeWorker.id, d)}
              />
            </div>
          </div>

          {/* Requested work days (day -> shift) */}
          <div>
            <label className="block text-sm font-medium mb-2">Requested Work Days</label>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const currentShiftId = activeWorker.requestedWorkDays[day] ?? ""
                return (
                  <div key={day} className="flex items-center gap-2">
                    <span className="w-6 text-right">{day}</span>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={currentShiftId}
                      onChange={(e) => onSetRequestedWorkDay(activeWorker.id, day, e.target.value || null)}
                    >
                      <option value="">—</option>
                      {shifts.map(s => (
                        <option key={s.id} value={s.id}>{s.type}</option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      {/* Worker selector row */}
      {activeWorker && (
        <div className="space-y-6">
          {/* Workload */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Workload (0–1)</label>
              <Input
                type="number"
                step={0.05}
                min={0}
                max={1}
                value={activeWorker.workLoad}
                onChange={(e) => {
                  const v = e.currentTarget.valueAsNumber
                  if (!Number.isNaN(v)) onSetWorkLoad(activeWorker.id, Math.min(1, Math.max(0, v)))
                }}
                className="max-w-xs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Assigned Shifts</label>
              <div className="flex flex-wrap gap-2">
                {shifts.map(s => {
                  const on = activeWorker.assignedShifts.includes(s)
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Desired Vacation Days</label>
              <DayStrip
                days={daysInMonth}
                selected={new Set(activeWorker.desiredVacationDays)}
                onToggle={(d) => onToggleDesiredVacationDay(activeWorker.id, d)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Approved Vacation Days</label>
              <DayStrip
                days={daysInMonth}
                selected={new Set(activeWorker.vacationDays)}
                onToggle={(d) => onToggleVacationDay(activeWorker.id, d)}
              />
            </div>
          </div>

          {/* Requested work days (day -> shift) */}
          <div>
            <label className="block text-sm font-medium mb-2">Requested Work Days</label>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const currentShiftId = activeWorker.requestedWorkDays[day] ?? ""
                return (
                  <div key={day} className="flex items-center gap-2">
                    <span className="w-6 text-right">{day}</span>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={currentShiftId}
                      onChange={(e) => onSetRequestedWorkDay(activeWorker.id, day, e.target.value || null)}
                    >
                      <option value="">—</option>
                      {shifts.map(s => (
                        <option key={s.id} value={s.id}>{s.type}</option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
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
