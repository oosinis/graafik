"use client"

import { useState } from "react"
import { ScheduleGridView } from "@/components/schedule-grid-view"
import { PageHeader } from "@/components/page-header"

export default function ScheduleGridPage() {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate({ year, month })
  }

  return (
    <div className="max-w-full mx-auto">
      <PageHeader title="Töögraafiku Ülevaade" />
      <ScheduleGridView year={currentDate.year} month={currentDate.month} onMonthChange={handleMonthChange} />
    </div>
  )
}
