"use client"

import { useEffect } from "react"
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import type { Rule, PriorityType } from "@/types"

type Props = {
  shiftId: string
  rules: Rule[]
  activeRuleId: string
  onSelectRule: (ruleId: string) => void
  onUpdateRule: (shiftId: string, ruleId: string, patch: Partial<Rule>) => void
  onToggleDay: (shiftId: string, ruleId: string, day: number) => void
  onSetPriority: (shiftId: string, ruleId: string, p: PriorityType) => void
}

const dayLabels = ["Mo","Tu","We","Th","Fr","Sa","Su"]

export function RuleDetailsStep({
  shiftId,
  rules,
  activeRuleId,
  onSelectRule,
  onUpdateRule,
  onToggleDay,
  onSetPriority,
}: Props){
    
    // ensure an active rule if available
  useEffect(() => {
    if (!activeRuleId && rules[0]?.id) onSelectRule(rules[0].id)
  }, [activeRuleId, rules, onSelectRule])

  const active = rules.find(r => r.id === activeRuleId)
  if (!active && rules.length === 0) {
    return (
      <Card className="p-6 bg-gray-50">
        <p className="text-gray-500">No rules for this shift.</p>
      </Card>
    )
  }

    return(
      <Card className="p-6 bg-gray-50">
      <div className="mb-4">
        <h3 className="text-xl font-bold">Rules</h3>
      </div>

      {rules.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {rules.map((r) => {
            const isActive = r.id === activeRuleId
            return (
              <Button
                key={r.id}
                variant={isActive ? "default" : "outline"}
                className={isActive ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => onSelectRule(r.id)}
              >
                {r.name}
              </Button>
            )
          })}
        </div>
      )}

      {active && (
        <>
          <div className="flex justify-between mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rule Title</label>
              <Input
                className="max-w-md"
                value={active.name}
                onChange={(e) => onUpdateRule(shiftId, active.id, { name: e.currentTarget.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <div className="flex space-x-2">
                {(["low","medium","high","critical"] as PriorityType[]).map(p => (
                  <Button
                    key={p}
                    size="sm"
                    variant={active.priority === p ? "default" : "outline"}
                    className={active.priority === p ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => onSetPriority(shiftId, active.id, p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Days Applied</label>
            <div className="flex gap-2 flex-wrap">
              {dayLabels.map((label, idx) => {
                const dayNum = idx + 1 // 1..7
                const on = active.daysApplied.includes(dayNum)
                return (
                  <Button
                    key={dayNum}
                    size="sm"
                    variant={on ? "default" : "outline"}
                    className={on ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => onToggleDay(shiftId, active.id, dayNum)}
                  >
                    {label}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Shifts Per Day</label>
              <Input
                type="number"
                value={active.perDay}
                min={0}
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  if (!Number.isNaN(n)) onUpdateRule(shiftId, active.id, { perDay: n })
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Off-Days After</label>
              <Input
                type="number"
                value={active.restDays}
                min={0}
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  if (!Number.isNaN(n)) onUpdateRule(shiftId, active.id, { restDays: n })
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Continuous Days</label>
              <Input
                type="number"
                value={active.continuousDays}
                min={0}
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  if (!Number.isNaN(n)) onUpdateRule(shiftId, active.id, { continuousDays: n })
                }}
              />
            </div>
          </div>
        </>
      )}
    </Card>
    )
}