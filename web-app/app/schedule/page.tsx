"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { ScheduleGridView } from "@/components/schedule-grid-view"

export default function ScheduleRoute() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const yearParam = searchParams?.get("year")
  const monthParam = searchParams?.get("month")

  const year = yearParam ? Number.parseInt(yearParam, 10) : new Date().getFullYear()
  const month = monthParam ? Number.parseInt(monthParam, 10) : new Date().getMonth() + 1

  const handleMonthChange = (newYear: number, newMonth: number) => {
    router.push(`/schedule?year=${newYear}&month=${newMonth}`)
  }

  return (
    <div className="max-w-full mx-auto">
      <PageHeader title="Töögraafiku Ülevaade" />
      <ScheduleGridView year={year} month={month} onMonthChange={handleMonthChange} />
    </div>
  )}
