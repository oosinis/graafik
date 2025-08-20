"use client"

import { useState, useEffect } from "react"

import { MonthsHoursStep } from "@/components/MonthsHoursStep"
import { ShiftDetailsStep } from "@/components/ShiftDetailsStep"
import { AssignEmployeesStep } from "@/components/AssignEmployeesStep"
import { PageHeader } from "@/components/page-header"
import { Shift, Rule, PriorityType } from '@/types'

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]


export default function GeneratorRoute() {
  /* TODO: communication between FE and BE */
    const [fullTimeHours, setFullTimeHours] = useState<string>("170")
    const [month, setMonth] = useState<string>(months[new Date().getMonth()])
    const [shifts, setShifts] = useState<Shift[]>([
      {
        id: "1",
        type: "Day",
        durationInMinutes: 480,
        rules: [
          { id: "r1", name: "Work days", daysApplied: [1,2,3,4,5], perDay: 3, restDays: 2, continuousDays: 5, priority: "medium" },
          { id: "r2", name: "Fridays",   daysApplied: [5],         perDay: 2, restDays: 0, continuousDays: 1, priority: "low" },
        ],
      },
      { id: "2", type: "Morning", durationInMinutes: 480, rules: [] },
      { id: "3", type: "Evening", durationInMinutes: 480, rules: [] },
    ])
  
    const [activeShiftId, setActiveShiftId] = useState<string>(shifts[0]?.id ?? "")
    const [activeRuleId, setActiveRuleId]   = useState<string>("")

    // when shift changes, default select its first rule (or none)
  useEffect(() => {
    const activeShift = shifts.find(s => s.id === activeShiftId)
    setActiveRuleId(activeShift?.rules[0]?.id ?? "")
  }, [activeShiftId, shifts])
  
    function updateShift(id: string, patch: Partial<Shift>) {
      setShifts(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))
    }

    // rule-level updates (NO add/delete)
  function updateRule(shiftId: string, ruleId: string, patch: Partial<Rule>) {
    setShifts(prev =>
      prev.map(s =>
        s.id !== shiftId
          ? s
          : { ...s, rules: s.rules.map(r => (r.id === ruleId ? { ...r, ...patch } : r)) }
      )
    )
  }

  function toggleRuleDay(shiftId: string, ruleId: string, day: number) {
    setShifts(prev =>
      prev.map(s => {
        if (s.id !== shiftId) return s
        return {
          ...s,
          rules: s.rules.map(r => {
            if (r.id !== ruleId) return r
            const on = r.daysApplied.includes(day)
            return { ...r, daysApplied: on ? r.daysApplied.filter(d => d !== day) : [...r.daysApplied, day] }
          }),
        }
      })
    )
  }

  function setRulePriority(shiftId: string, ruleId: string, p: PriorityType) {
    updateRule(shiftId, ruleId, { priority: p })
  }

      const generateSchedule = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const requestBody = {
          /* workers, */
          shifts,
          month: months.indexOf(month) + 1, // 1..12
          fullTimeHours: Number(fullTimeHours),
        }
    
        const response = await fetch(`${apiUrl}/create-schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })
    
        if (!response.ok) {
          alert("Failed to generate schedule")
          return
        }
    
        const data = await response.json()
        console.log("BE response:", data)
      }
    

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Graafiku Generaator" description="Loo uus töögraafik" />
      <MonthsHoursStep 
      fullTimeHours={fullTimeHours}
      onFullTimeHoursChange={setFullTimeHours}
      month={month}
      onMonthChange={setMonth}/>
      <ShiftDetailsStep 
      shifts={shifts}
      activeShiftId={activeShiftId}
      onSelectShift={setActiveShiftId}
       onUpdateShift={updateShift}
       rulesProps={{
        activeRuleId,
        onSelectRule: setActiveRuleId,
        updateRule,
        toggleRuleDay,
        setRulePriority,
      }}/>
      <AssignEmployeesStep />
    </div>
  )
}

