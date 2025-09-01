"use client"
//TODO: the adding module is gone when navigating between the shift buttons
import { useState, useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RuleDetailsStep } from "@/app/generator/RuleDetailsStep"
import { Props } from "@/models/Props"
import { Shift } from '@/models/Shift'

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `shift_${Math.random().toString(36).slice(2)}`
}

export function ShiftDetailsStep({
  shifts,
  onAddShift,
  //onDeleteShift,
  activeShiftId,
  onSelectShift,
  onUpdateShift,
  rulesProps
}: Props) {

  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newHours, setNewHours] = useState<number | "">("")
  const [newMinutes, setNewMinutes] = useState<number | "">("")

  const active = useMemo(
    () => shifts.find(s => s.id === activeShiftId) ?? null,
    [shifts, activeShiftId]
  )  

  const hours = active ? Math.floor(active.durationInMinutes / 60) : 0
  const minutes = active ? active.durationInMinutes % 60 : 0
  
  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))


  const resetDraft = () => {
    setNewTitle("")
    setNewHours("")
    setNewMinutes("")
  }

  const openAdd = () => {
    resetDraft()
    setAdding(true)
    onSelectShift("")
  }

  const cancelAdd = () => {
    resetDraft()
    setAdding(false)
  }

  const saveNewShift = () => {
    const title = newTitle.trim()
    const h = typeof newHours === "number" ? clamp(newHours, 0, 24) : 0
    const m = typeof newMinutes === "number" ? clamp(newMinutes, 0, 59) : 0
    const total = h * 60 + m

    if (!title || total <= 0) return

    const shift: Shift = {
      id: makeId(),
      type: title,
      durationInMinutes: total,
      rules: [],
      createdAt: new Date().toISOString(),
    }

    onAddShift(shift)
    setAdding(false)
    resetDraft()
    onSelectShift("")
  }

  const handleSelectShift = (id: string) => {
    if (adding) {
      setAdding(false);
      resetDraft();
    }
    onSelectShift(id); 
  };
  

  //TODO: delete shift
  const deleteShift = () => {

  }

  return (
    <div className="mb-6">
      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Shift Details</h2>
            <button className="text-purple-600 mt-1">
              Retrieve data from last month
            </button>
          </div>
        </div>

        <p className="text-gray-500">
          Create shifts and rules for the month, assign shifts to employees.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {shifts.length > 0 &&
            shifts.map((s) => {
              const isActive = s.id === activeShiftId
              return (
                <Button
                  key={s.id}
                  variant={isActive ? "default" : "outline"}
                  className={isActive ? "bg-purple-600 hover:bg-purple-700" : ""}
                  onClick={() => handleSelectShift(s.id)}
                >
                  {s.type}
                </Button>
              )
            })}

          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={openAdd}
          >
            + Add
          </Button>
        </div>

        {adding && (
          <div className="rounded-lg bg-purple-50 p-4 space-y-4 animate-in fade-in-50">
            <div>
              <label className="block text-sm font-medium mb-2">Shift Title</label>
              <Input
                placeholder="e.g. Morning"
                value={newTitle}
                onChange={(e) => setNewTitle(e.currentTarget.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shift Length</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-20"
                  placeholder="0"
                  min={0}
                  max={24}
                  value={newHours}
                  onChange={(e) => {
                    const v = e.currentTarget.value
                    setNewHours(v === "" ? "" : e.currentTarget.valueAsNumber)
                  }}
                />
                <span>h</span>
                <Input
                  type="number"
                  className="w-20"
                  placeholder="0"
                  min={0}
                  max={59}
                  value={newMinutes}
                  onChange={(e) => {
                    const v = e.currentTarget.value
                    setNewMinutes(v === "" ? "" : e.currentTarget.valueAsNumber)
                  }}
                />
                <span>min</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={saveNewShift}
              >
                Save shift
              </Button>
              <Button variant="outline" onClick={cancelAdd}>Cancel</Button>
            </div>
          </div>
        )}

        {!!active && !adding && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Shift Title</label>
                <Input
                  value={active.type}
                  onChange={(e) => onUpdateShift(active.id, { type: e.currentTarget.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Shift Length</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20"
                    value={hours}
                    min={0}
                    onChange={(e) => {
                      const h = e.currentTarget.valueAsNumber
                      if (!Number.isNaN(h)) {
                        const total = clamp(h, 0, 24) * 60 + minutes
                        onUpdateShift(active.id, { durationInMinutes: total })
                      }
                    }}
                  />
                  <span>h</span>
                  <Input
                    type="number"
                    className="w-20"
                    value={minutes}
                    min={0}
                    max={59}
                    onChange={(e) => {
                      const m = e.currentTarget.valueAsNumber
                      if (!Number.isNaN(m)) {
                        const total = hours * 60 + clamp(m, 0, 59)
                        onUpdateShift(active.id, { durationInMinutes: total })
                      }
                    }}
                  />
                  <span>min</span>
                </div>
              </div>
            </div>

            <RuleDetailsStep
              shiftId={active.id}
              rules={active.rules}
              activeRuleId={rulesProps.activeRuleId}
              onSelectRule={rulesProps.onSelectRule}
              onUpdateRule={rulesProps.updateRule}
              onToggleDay={rulesProps.toggleRuleDay}
              onSetPriority={rulesProps.setRulePriority}
            />
          </>
        )}
      </Card>
    </div>
  )
}