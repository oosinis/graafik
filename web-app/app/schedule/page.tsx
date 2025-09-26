"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { ScheduleGridView } from "@/components/schedule-grid-view"

function ScheduleContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const yearParam = searchParams?.get("year")
  const monthParam = searchParams?.get("month")

  const year = yearParam ? Number.parseInt(yearParam, 10) : new Date().getFullYear()
  const month = monthParam ? Number.parseInt(monthParam, 10) : new Date().getMonth() + 1

  const handleMonthChange = (newYear: number, newMonth: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    params.set("year", String(newYear))
    params.set("month", String(newMonth))
    router.push(`/schedule?month=${newMonth}`)
  }

  return (
    <div className="max-w-full mx-auto">
      <PageHeader title="Schedule overview" />
      <ScheduleGridView year={year} month={month} onMonthChange={handleMonthChange} />
    </div>
  )
}

export default function ScheduleRoute() {
  return (
    <Suspense fallback={<div className="p-6">Loading schedule…</div>}>
      <ScheduleContent />
    </Suspense>
  )
}
