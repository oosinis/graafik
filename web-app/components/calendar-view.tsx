"use client"

import { useState, useEffect } from "react"
import type { ScheduleResponse } from "@/models/ScheduleResponse"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

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

export function CalendarView({ schedule }: { schedule: ScheduleResponse }) {
  const [workers, setWorkers] = useState<string[]>([])

  useEffect(() => {
    const workerSet = new Set<string>()
    schedule.daySchedules.forEach((day) => {
      day.assignments.forEach((assignment) => {
        workerSet.add(assignment.worker.name)
      })
    })
    setWorkers(Array.from(workerSet))
  }, [schedule])

  const daysInMonth = new Date(schedule.year, schedule.month, 0).getDate()

  const isWeekend = (day: number) => {
    const date = new Date(schedule.year, schedule.month - 1, day)
    return date.getDay() === 0 || date.getDay() === 6
  }

  const getShiftForWorkerOnDay = (worker: string, day: number) => {
    const daySchedule = schedule.daySchedules.find((ds) => ds.dayOfMonth === day)
    return daySchedule?.assignments.find((a) => a.worker.name === worker)?.shift.type || ""
  }

  const calculateTotalHours = (worker: string) => {
    if (schedule.workerHours && schedule.workerHours[worker]) {
      return schedule.workerHours[worker]
    }

    // Fallback calculation if workerHours is not available
    let totalHours = 0
    schedule.daySchedules.forEach((day) => {
      const assignment = day.assignments.find((a) => a.worker.name === worker)
      if (assignment) {
        totalHours += assignment.shift.duration
      }
    })
    return totalHours
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background z-20">Töötaja</TableHead>
            <TableHead className="text-right pr-4">Tunnid</TableHead>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <TableHead key={day} className={isWeekend(day) ? "bg-yellow-100" : ""}>
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map((worker) => (
            <TableRow key={worker}>
              <TableCell className="font-medium sticky left-0 bg-background z-10">{worker}</TableCell>
              <TableCell className="text-right pr-4">{calculateTotalHours(worker)}</TableCell>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <TableCell key={day} className={isWeekend(day) ? "bg-yellow-100" : ""}>
                  {getShiftForWorkerOnDay(worker, day)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
