"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Rule } from "@/models/Rule"
import { RulesProps } from "@/models/Props";

const dayLabels = ["Mo","Tu","We","Th","Fr","Sa","Su"]

export function RuleDetailsStep({
  shiftId,
  rules,
  activeRuleId,
  onSelectRule,
  onUpdateRule,
  onToggleDay,
  onSetPriority,
  onAddRule,  
  onDeleteRule,
}: RulesProps){

  const [adding, setAdding] = useState(false)
  const [draftName, setDraftName] = useState("")
  const resetDraft = () => setDraftName("")
    
  useEffect(() => {
    if (!activeRuleId && rules[0]?.id) onSelectRule(rules[0].id)
    if (activeRuleId && !rules.some(r => r.id === activeRuleId)) {
      onSelectRule(rules[0]?.id ?? "")
    }
  }, [activeRuleId, rules, onSelectRule])

  const active = useMemo(
    () => rules.find(r => r.id === activeRuleId) ?? null,
    [rules, activeRuleId]
  )

  const saveRule = () => {
    const name = draftName.trim()
    if (!name) return
    // provide defaults; parent will assign the id
    onAddRule(shiftId!, {
      name,
      priority: "medium",
      daysApplied: [],
      perDay: 1,
      restDays: 0,
      continuousDays: 1,
    })
    setAdding(false)
    resetDraft()
  }

    return(
      <Card className="p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Rules</h3>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={saveRule}>
          + Add rule
        </Button>
      </div>

      {rules.length > 0 ? (
        <div className="flex gap-2 mb-4 flex-wrap">
          {rules.map(r => {
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
      ) : (
        <p className="text-gray-500 mb-4">No rules for this shift.</p>
      )}

      {active && (
        <>
          <div className="flex justify-between mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rule Title</label>
              <Input
                className="max-w-md"
                value={active.name}
                onChange={(e) => onUpdateRule(shiftId!, active.id, { name: e.currentTarget.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <div className="flex space-x-2">
                {(["low","medium","high","critical"] as Rule["priority"][]).map(p => (
                  <Button
                    key={p}
                    size="sm"
                    variant={active.priority === p ? "default" : "outline"}
                    className={active.priority === p ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => onSetPriority(shiftId!, active.id, p)}
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
                const dayNum = idx + 1
                const on = active.daysApplied.includes(dayNum)
                return (
                  <Button
                    key={dayNum}
                    size="sm"
                    variant={on ? "default" : "outline"}
                    className={on ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => onToggleDay(shiftId!, active.id, dayNum)}
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
                  if (!Number.isNaN(n)) onUpdateRule(shiftId!, active.id, { perDay: n })
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
                  if (!Number.isNaN(n)) onUpdateRule(shiftId!, active.id, { restDays: n })
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
                  if (!Number.isNaN(n)) onUpdateRule(shiftId!, active.id, { continuousDays: n })
                }}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button variant="destructive" onClick={() => onDeleteRule(shiftId!, active.id)}>
              Delete rule
            </Button>
          </div>
        </>
      )}
    </Card>
    )
}