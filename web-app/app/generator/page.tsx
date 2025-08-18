"use client"

import { useState } from "react"

import { MonthsHoursStep } from "@/components/MonthsHoursStep"
import { ShiftDetailsStep } from "@/components/ShiftDetailsStep"
import { RuleDetailsStep } from "@/components/RuleDetailsStep"
import { AssignEmployeesStep } from "@/components/AssignEmployeesStep"
import { PageHeader } from "@/components/page-header"

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

type Shift = {
  id: string
  type: string
  durationInMinutes: number 
  //TODO: Add Rules
}


export default function GeneratorRoute() {
  /* TODO: communication between FE and BE */
    const [fullTimeHours, setFullTimeHours] = useState<string>("170")
    const [month, setMonth] = useState<string>(months[new Date().getMonth()])
    const [shifts, setShifts] = useState<Shift[]>([
      { id: "1", type: "Day",     durationInMinutes: 480 },
      { id: "2", type: "Morning", durationInMinutes: 480 },
      { id: "3", type: "Evening", durationInMinutes: 480 },
    ])
    const [activeShiftId, setActiveShiftId] = useState<string>(shifts[1]?.id ?? shifts[0]?.id ?? "")
  
    function updateShift(id: string, patch: Partial<Shift>) {
      setShifts(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))
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
       onUpdateShift={updateShift}/>
      <RuleDetailsStep />
      <AssignEmployeesStep />
    </div>
  )
}
