"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"

const availableSchedules = [
  { month: 2, year: 2025 },
  { month: 7, year: 2023 },
  { month: 6, year: 2023 },
  { month: 5, year: 2023 },
  { month: 4, year: 2023 },
]

const monthNames = [
  "Jaanuar",
  "Veebruar",
  "Märts",
  "Aprill",
  "Mai",
  "Juuni",
  "Juuli",
  "August",
  "September",
  "Oktoober",
  "November",
  "Detsember",
]
export default function ScheduleHistoryRoute() {
const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const router = useRouter()

  const years = Array.from(new Set(availableSchedules.map((s) => s.year))).sort((a, b) => b - a)

  const filteredSchedules = selectedYear
    ? availableSchedules.filter((s) => s.year === selectedYear)
    : availableSchedules

  const handleScheduleClick = (year: number, month: number) => {
    router.push(`/schedule?year=${year}&month=${month}`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Graafikute Ajalugu" />
      <div className="mb-4">
        <label htmlFor="year-select" className="mr-2">
          Filtreeri aasta järgi:
        </label>
        <select
          id="year-select"
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
          className="border rounded p-1"
        >
          <option value="">Kõik aastad</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Saadaval Graafikud</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {filteredSchedules.map((schedule) => (
              <Button
                key={`${schedule.year}-${schedule.month}`}
                variant="outline"
                className="w-full"
                onClick={() => handleScheduleClick(schedule.year, schedule.month)}
              >
                {monthNames[schedule.month - 1]} {schedule.year}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )}
