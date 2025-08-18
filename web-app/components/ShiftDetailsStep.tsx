"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RuleDetailsStep } from "@/components/RuleDetailsStep"


type Shift = {
  id: string
  type: string
  durationInMinutes: number
}

type Props = {
  shifts: Shift[]
  activeShiftId: string
  onSelectShift: (id: string) => void
  onUpdateShift: (id: string, patch: Partial<Shift>) => void
}

export function ShiftDetailsStep({shifts,
  activeShiftId,
  onSelectShift,
  onUpdateShift,} : Props){
    const active = shifts.find(s => s.id === activeShiftId)

  const hours = active ? Math.floor(active.durationInMinutes / 60) : 0
  const minutes = active ? active.durationInMinutes % 60 : 0

  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
      
    return(
        <div className="mb-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Shift Details</h2>
                  <button className="text-purple-600 mt-1">Retrieve data from last month</button>
                </div>
              </div>

              <p className="text-gray-500 mb-6">
                Create shifts and rules for specific months, assign shifts to employees.
              </p>

              <div className="flex space-x-2 mb-6">
              {shifts.map((s) => {
            const isActive = s.id === activeShiftId
            return (
              <Button
                key={s.id}
                variant={isActive ? "default" : "outline"}
                className={isActive ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => onSelectShift(s.id)}
              >
                {s.type}
              </Button>
            )
          })}
              </div>

              {active && (
          <div className="grid grid-cols-2 gap-6 mb-6">
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
                  className="w-16"
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
                  className="w-16"
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
        )}
              <RuleDetailsStep />
            </Card>
        </div>
    )
}