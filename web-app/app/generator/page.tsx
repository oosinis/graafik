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

export default function GeneratorRoute() {
  /* TODO: communication between FE and BE */
    const [fullTimeHours, setFullTimeHours] = useState<string>("170")
    const [month, setMonth] = useState<string>(months[new Date().getMonth()])

  
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Graafiku Generaator" description="Loo uus töögraafik" />
      <MonthsHoursStep 
      fullTimeHours={fullTimeHours}
      onFullTimeHoursChange={setFullTimeHours}
      month={month}
      onMonthChange={setMonth}/>
      <ShiftDetailsStep />
      <RuleDetailsStep />
      <AssignEmployeesStep />
    </div>
  )
}
