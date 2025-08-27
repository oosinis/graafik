"use client"

/* import { MonthsHoursStep } from "@/components/MonthsHoursStep"
import { ShiftDetailsStep } from "@/components/ShiftDetailsStep"
import { RuleDetailsStep } from "@/components/RuleDetailsStep"
import { AssignEmployeesStep } from "@/components/AssignEmployeesStep"
======= */

import { useEffect, useState } from "react"
import { MonthsHoursStep } from "@/app/generator/MonthsHoursStep"
import { ShiftDetailsStep } from "@/app/generator/ShiftDetailsStep"
import { RuleDetailsStep } from "@/components/RuleDetailsStep"        
import { AssignEmployeesStep } from "@/app/generator/AssignEmployeesStep"
import { PageHeader } from "@/components/page-header"
import { Worker } from '@/models/Worker'
import { Shift } from '@/models/Shift'
import { Rule } from '@/models/Rule'
import { mapShiftToBE, mapWorkerToBE } from "@/lib/mappers";
import { Button } from "@/components/ui/button"

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function GeneratorRoute() {
  const [fullTimeHours, setFullTimeHours] = useState("170")
  const [month, setMonth] = useState(months[new Date().getMonth()])

  const [shifts, setShifts] = useState<Shift[]>([
    { id: "1", type: "Day",     durationInMinutes: 480, rules: [] },
    { id: "2", type: "Morning", durationInMinutes: 480, rules: [] },
    { id: "3", type: "Evening", durationInMinutes: 480, rules: [] },
  ])
  const [activeShiftId, setActiveShiftId] = useState<string>(shifts[0]?.id ?? "")
  const [activeRuleId, setActiveRuleId] = useState<string>("")
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: "w1",
      name: "John Doe",
      role: "Waiter",
      status: "active",
      assignedShifts: [],            
      workLoad: 1,
      desiredVacationDays: [],
      vacationDays: [],
      requestedWorkDays: {},
      sickDays: [],
    },
  ])

  useEffect(() => {
    const activeShift = shifts.find(s => s.id === activeShiftId)
    setActiveRuleId(activeShift?.rules[0]?.id ?? "")
  }, [activeShiftId, shifts])

  function updateShift(id: string, patch: Partial<Shift>) {
    setShifts(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))
  }
  function updateRule(shiftId: string, ruleId: string, patch: Partial<Rule>) {
    setShifts(prev =>
      prev.map(s =>
        s.id !== shiftId ? s : { ...s, rules: s.rules.map(r => (r.id === ruleId ? { ...r, ...patch } : r)) }
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
  function setRulePriority(shiftId: string, ruleId: string, p: Rule['priority']) {
    updateRule(shiftId, ruleId, { priority: p })
  }
  
  

  function toggleAssignedShift(workerId: string, shiftId: string) {
    setWorkers(prev =>
           prev.map(w => {
             if (w.id !== workerId) return w
             const exists = (w.assignedShifts ?? []).some(sh => sh.id === shiftId)
             if (exists) {
               return { ...w, assignedShifts: w.assignedShifts.filter(sh => sh.id !== shiftId) }
             }
             const shiftObj = shifts.find(s => s.id === shiftId)
             if (!shiftObj) return w
             return { ...w, assignedShifts: [...w.assignedShifts, shiftObj] }
           })
         )
  }
  function setWorkLoad(workerId: string, value: number) {
    setWorkers(prev => prev.map(w => (w.id === workerId ? { ...w, workLoad: value } : w)))
  }
  function toggleDesiredVacationDay(workerId: string, day: number) {
    setWorkers(prev =>
      prev.map(w =>
        w.id !== workerId
          ? w
          : {
              ...w,
              desiredVacationDays: w.desiredVacationDays.includes(day)
                ? w.desiredVacationDays.filter(d => d !== day)
                : [...w.desiredVacationDays, day],
            }
      )
    )
  }
  function toggleVacationDay(workerId: string, day: number) {
    setWorkers(prev =>
      prev.map(w =>
        w.id !== workerId
          ? w
          : {
              ...w,
              vacationDays: w.vacationDays.includes(day)
                ? w.vacationDays.filter(d => d !== day)
                : [...w.vacationDays, day],
            }
      )
    )
  }
  function setRequestedWorkDay(workerId: string, day: number, shiftId: string | null) {
    setWorkers(prev =>
      prev.map(w =>
        w.id !== workerId
          ? w
          : {
              ...w,
              requestedWorkDays: { ...w.requestedWorkDays, [day]: shiftId },
            }
      )
    )
  }

  const generateSchedule = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("Missing NEXT_PUBLIC_API_URL");
      return;
    }
  
    const beShifts = shifts.map(mapShiftToBE);
  
    const shiftById = new Map(shifts.map(s => [s.id, s]));
    const beWorkers = workers.map(w => mapWorkerToBE(w, shiftById));
  
    const requestBody = {
      workers: beWorkers,
      shifts: beShifts,
      month: months.indexOf(month) + 1,
      fullTimeHours: Number(fullTimeHours),
    };
  
    try {
      const res = await fetch(`${apiUrl}/create-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }
  
      const data = await res.json();
      console.log("BE response:", data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate schedule");
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Graafiku Generaator" description="Loo uus töögraafik" />

      <MonthsHoursStep
        fullTimeHours={fullTimeHours}
        onFullTimeHoursChange={setFullTimeHours}
        month={month}
        onMonthChange={setMonth}
      />

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
        }}
      />

      <AssignEmployeesStep
        monthName={month}
        shifts={shifts}
        workers={workers}
        onToggleAssignedShift={toggleAssignedShift}
        onSetWorkLoad={setWorkLoad}
        onToggleDesiredVacationDay={toggleDesiredVacationDay}
        onToggleVacationDay={toggleVacationDay}
        onSetRequestedWorkDay={setRequestedWorkDay}
      />
      <Button 
    onClick={generateSchedule} 
    className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
  >
    Generate Schedule
  </Button>
    </div>
  )
}
