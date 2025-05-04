"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WorkerDto {
  name: string
}

interface Shift {
  type: string
  length: number
}

interface ShiftAssignment {
  shift: Shift
  worker: WorkerDto
}

interface DaySchedule {
  dayOfMonth: number
  assignments: ShiftAssignment[]
}

interface Schedule {
  month: number
  year: number
  daySchedules: DaySchedule[]
}

export function ScheduleDisplay() {
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch("/api/get-schedule")
        if (!response.ok) {
          throw new Error("Failed to fetch schedule")
        }
        const data = await response.json()
        setSchedule(data)
      } catch (error) {
        console.error("Error fetching schedule:", error)
      }
    }

    fetchSchedule()
  }, [])

  const handleBack = () => {
    router.push("/")
  }

  if (!schedule) {
    return <div>Loading schedule...</div>
  }

  const monthNames = [
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

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>
          {monthNames[schedule.month - 1]} {schedule.year} Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {schedule.daySchedules.map((daySchedule) => (
            <Card key={daySchedule.dayOfMonth}>
              <CardHeader>
                <CardTitle>Day {daySchedule.dayOfMonth}</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Shift</th>
                      <th className="text-left">Worker</th>
                      <th className="text-left">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daySchedule.assignments.map((assignment, index) => (
                      <tr key={index}>
                        <td>{assignment.shift.type}</td>
                        <td>{assignment.worker.name}</td>
                        <td>{assignment.shift.length} hours</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={handleBack} className="mt-6">
          Back to Planner
        </Button>
      </CardContent>
    </Card>
  )
}
