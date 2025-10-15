"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MonthsHoursStep } from "@/app/generator/MonthsHoursStep"
import { ShiftDetailsStep } from "@/app/generator/ShiftDetailsStep"
import { AssignEmployeesStep } from "@/app/generator/AssignEmployeesStep"
import { PageHeader } from "@/components/page-header"
import { Worker } from '@/models/Worker'
import { Shift } from '@/models/Shift'
import { Rule } from '@/models/Rule'
import { Button } from "@/components/ui/button"
import { RoleGuard } from '@/components/RoleGuard';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const makeId = (): string => {
  return (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Math.random().toString(36).slice(2)}`)
}

export default function GeneratorRoute() {
  const [fullTimeHours, setFullTimeHours] = useState("170")
  const [month, setMonth] = useState(months[new Date().getMonth()])

  const [shifts, setShifts] = useState<Shift[]>([])
  const [activeShiftId, setActiveShiftId] = useState<string>(shifts[0]?.id ?? "")
  const [activeRuleId, setActiveRuleId] = useState<string>("")
  const [activeWorkerId, setActiveWorkerId] = useState<string>("")
  const [workers, setWorkers] = useState<Worker[]>([])

  const router = useRouter()

  //Shift things
  useEffect(() => {
    const activeShift = shifts.find(s => s.id === activeShiftId)
    setActiveRuleId(activeShift?.rules[0]?.id ?? "")
  }, [activeShiftId, shifts])

  const onAddShift = (shift: Shift) => {
    setShifts(prev => [...prev, shift])
  }

  const deleteShift = (shiftId: string) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId))
  }

  function updateShift(id: string, patch: Partial<Shift>) {
    setShifts(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))
  }

  //Rule things
  function addRule(shiftId: string, draft: Omit<Rule, "id">) {
    const newRule: Rule = { id: makeId(), ...draft };
    setShifts(prev =>
      prev.map(s => (s.id === shiftId ? { ...s, rules: [...s.rules, newRule] } : s))
    );
    setActiveRuleId(newRule.id);
  }

  function onUpdateRule(shiftId: string, ruleId: string, patch: Partial<Rule>) {
    setShifts(prev =>
      prev.map(s =>
        s.id !== shiftId ? s : { ...s, rules: s.rules.map(r => (r.id === ruleId ? { ...r, ...patch } : r)) }
      )
    )
  }
  function deleteRule(shiftId: string, ruleId: string) {
    setShifts(prev =>
      prev.map(s =>
        s.id !== shiftId ? s : { ...s, rules: s.rules.filter(r => r.id !== ruleId) }
      )
    );
    setActiveRuleId(prev => (prev === ruleId ? "" : prev));
  }

  function onToggleDay(shiftId: string, ruleId: string, day: number) {
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

  function onSetPriority(shiftId: string, ruleId: string, p: Rule['priority']) {
    onUpdateRule(shiftId, ruleId, { priority: p })
  }



  //Assing employees things
  const addWorker = (worker: Worker) => {
    setWorkers(prev => [...prev, worker])
  }

  const deleteWorker = (workerId: string) => {
    setWorkers(prev => prev.filter(s => s.id !== workerId))
  }

  function updateWorker(id: string, patch: Partial<Worker>) {
    setWorkers(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))
  }

  function toggleAssignedShift(workerId: string, shiftId: string) {
    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== workerId) return w
        const current = w.assignedShifts ?? []
        const has = current.includes(shiftId)
        return has
          ? { ...w, assignedShifts: current.filter(s => s !== shiftId) }
          : { ...w, assignedShifts: [...current, shiftId] }
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

    const requestBody = {
      workers: workers,
      shifts: shifts,
      month: months.indexOf(month) + 1,
      fullTimeHours: Number(fullTimeHours),
    };

    console.log("Generator request body:", requestBody);
    console.log("Workers:", workers);
    console.log("Shifts:", shifts);

    try {
      const res = await fetch(`${apiUrl}/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("Generator API response:", data);
      router.push(`/schedule/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate schedule");
    }
  };


  return (
    <RoleGuard allowedRoles={['Admin', 'Manager']}>
      <div className="max-w-6xl mx-auto">
        <PageHeader title="Schedule generator" description="Create a new work schedule" />

        <MonthsHoursStep
          fullTimeHours={fullTimeHours}
          onFullTimeHoursChange={setFullTimeHours}
          month={month}
          onMonthChange={setMonth}
        />

        <ShiftDetailsStep
          makeId={makeId}
          shifts={shifts}
          activeShiftId={activeShiftId}
          onAddShift={onAddShift}
          onDeleteShift={deleteShift}
          onSelectShift={setActiveShiftId}
          onUpdateShift={updateShift}
          rulesProps={{
            activeRuleId,
            rules: shifts.find(s => s.id === activeShiftId)?.rules ?? [],
            onSelectRule: setActiveRuleId,
            onAddRule: addRule,
            onDeleteRule: deleteRule,
            onUpdateRule,
            onToggleDay,
            onSetPriority,
          }}
        />

        <AssignEmployeesStep
          makeId={makeId}
          monthName={month}
          shifts={shifts}
          workers={workers}
          activeWorkerId={activeWorkerId}
          onAddWorker={addWorker}
          onDeleteWorker={deleteWorker}
          onSelectWorker={setActiveWorkerId}
          onUpdateWorker={updateWorker}
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
    </RoleGuard>
  )
}
