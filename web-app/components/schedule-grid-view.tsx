"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { ShiftDetailsCard } from "@/components/shift-details-card"
import { MonthNavigation } from "@/components/month-navigation"
import { WeekNavigation } from "@/components/week-navigation"
import { ViewModeToggle } from "@/components/view-mode-toggle"
import { useRouter } from "next/navigation"
import type { ScheduleResponse } from "@/models/ScheduleResponse"
import type { WorkerDto } from "@/models/WorkerDto"
import type { ShiftAssignment } from "@/models/ShiftAssignment"
import type { DaySchedule } from "@/models/DaySchedule"

interface ScheduleGridViewProps {
  year: number
  month: number
  onMonthChange: (year: number, month: number) => void
}

export function ScheduleGridView({ year, month, onMonthChange }: ScheduleGridViewProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("monthly")
  const [selectedShift, setSelectedShift] = useState<{
    day: number
    worker: string
    shift: string
    fte: string
  } | null>(null)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null)
  const [loading, setLoading] = useState(true)

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

  const shiftColors = {
    Morning: "bg-orange-200",
    Afternoon: "bg-teal-200",
    Evening: "bg-pink-200",
    Night: "bg-purple-200",
    Hommik: "bg-orange-200",
    Päev: "bg-teal-200",
    Õhtu: "bg-pink-200",
    Öö: "bg-purple-200",
    "Teenindaja/hommikul": "bg-orange-200",
    "Teenindaja õhtul": "bg-purple-100",
    "Kokk õhtul": "bg-pink-100",
  }

  // Fetch schedule data when month or year changes
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/schedule?year=${year}&month=${month}`);
        // const data = await response.json();

        // For now, we'll use mock data
        const mockSchedule = generateMockSchedule(year, month)
        setSchedule(mockSchedule)
      } catch (error) {
        console.error("Error fetching schedule:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
    setCurrentWeek(0) // Reset to first week when month changes
  }, [year, month])

  // Generate mock schedule data that matches the ScheduleResponse interface
  const generateMockSchedule = (year: number, month: number): ScheduleResponse => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const workers: WorkerDto[] = [
      { name: "Mari Tamm" },
      { name: "Kertu Jõesaar" },
      { name: "Jaan Kask" },
      { name: "Liis Lepp" },
      { name: "Andres Allik" },
    ]

    const shiftTypes = ["Hommik", "Päev", "Õhtu", "Öö"]
    const workerHours: Record<string, number> = {}

    // Initialize worker hours
    workers.forEach((worker) => {
      workerHours[worker.name] = Math.floor(Math.random() * 40) + 140 // 140-180 hours
    })

    // Generate day schedules
    const daySchedules: DaySchedule[] = Array.from({ length: daysInMonth }, (_, i) => {
      const dayOfMonth = i + 1
      const assignments: ShiftAssignment[] = []

      // Assign shifts for this day
      shiftTypes.forEach((type, index) => {
        const workerIndex = (dayOfMonth + index) % workers.length
        assignments.push({
          shift: { type, length: type === "Öö" ? 10 : 8 },
          worker: workers[workerIndex],
        })
      })

      return {
        dayOfMonth,
        assignments,
        score: Math.floor(Math.random() * 100),
      }
    })

    return {
      month,
      year,
      daySchedules,
      score: Math.floor(Math.random() * 1000),
      workerHours,
    }
  }

  // Get all unique workers from the schedule
  const getUniqueWorkers = (): string[] => {
    if (!schedule) return []

    const workerSet = new Set<string>()
    schedule.daySchedules.forEach((day) => {
      day.assignments.forEach((assignment) => {
        workerSet.add(assignment.worker.name)
      })
    })

    return Array.from(workerSet)
  }

  // Get shift for a specific worker on a specific day
  const getShiftForWorkerOnDay = (workerName: string, day: number): string | null => {
    if (!schedule) return null

    const daySchedule = schedule.daySchedules.find((ds) => ds.dayOfMonth === day)
    if (!daySchedule) return null

    const assignment = daySchedule.assignments.find((a) => a.worker.name === workerName)
    return assignment ? assignment.shift.type : null
  }

  // Get hours for a specific worker
  const getWorkerHours = (workerName: string): number => {
    if (!schedule || !schedule.workerHours[workerName]) return 0
    return schedule.workerHours[workerName]
  }

  // Get unassigned shifts for a specific day
  const getUnassignedShiftsForDay = (day: number): string[] => {
    // This is a placeholder - in a real app, you would compare required shifts vs assigned shifts
    // For now, we'll just return some random unassigned shifts
    if (day % 5 === 0) return ["Morning"]
    if (day % 7 === 0) return ["Night"]
    return []
  }

  // Calculate weeks in the month
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const weeksInMonth = Math.ceil((daysInMonth + firstDayOfMonth) / 7)

  // Get days for current view (monthly or weekly)
  const getDaysForView = () => {
    if (viewMode === "monthly") {
      return Array.from({ length: daysInMonth }, (_, i) => i + 1)
    } else {
      // Weekly view - get days for the current week
      const startDay = currentWeek * 7 + 1
      const endDay = Math.min(startDay + 6, daysInMonth)
      return Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i)
    }
  }

  const days = getDaysForView()
  const uniqueWorkers = getUniqueWorkers()

  // Handle month navigation
  const goToPreviousMonth = () => {
    let newMonth = month - 1
    let newYear = year
    if (newMonth < 1) {
      newMonth = 12
      newYear--
    }
    onMonthChange(newYear, newMonth)
  }

  const goToNextMonth = () => {
    let newMonth = month + 1
    let newYear = year
    if (newMonth > 12) {
      newMonth = 1
      newYear++
    }
    onMonthChange(newYear, newMonth)
  }

  // Handle week navigation
  const goToPreviousWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1)
    } else {
      // Go to previous month, last week
      const prevMonth = month - 1 > 0 ? month - 1 : 12
      const prevYear = prevMonth === 12 ? year - 1 : year
      const prevMonthDays = new Date(prevYear, prevMonth, 0).getDate()
      const prevMonthFirstDay = new Date(prevYear, prevMonth - 1, 1).getDay()
      const prevMonthWeeks = Math.ceil((prevMonthDays + prevMonthFirstDay) / 7)

      onMonthChange(prevYear, prevMonth)
      setCurrentWeek(prevMonthWeeks - 1)
    }
  }

  const goToNextWeek = () => {
    if (currentWeek < weeksInMonth - 1) {
      setCurrentWeek(currentWeek + 1)
    } else {
      // Go to next month, first week
      const nextMonth = month + 1 <= 12 ? month + 1 : 1
      const nextYear = nextMonth === 1 ? year + 1 : year

      onMonthChange(nextYear, nextMonth)
      setCurrentWeek(0)
    }
  }

  // Get day of week name
  const getDayName = (day: number) => {
    const date = new Date(year, month - 1, day)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return dayNames[date.getDay()]
  }

  const handleShiftClick = (day: number, worker: string, shift: string) => {
    setSelectedShift({
      day,
      worker,
      shift,
      fte: "1.0", // This would come from worker data in a real app
    })
  }

  const closeShiftDetails = () => {
    setSelectedShift(null)
  }

  // Get shift times based on shift type
  const getShiftTimes = (shiftType: string) => {
    switch (shiftType) {
      case "Hommik":
        return { start: "06:00", end: "14:00", hours: 8 }
      case "Päev":
        return { start: "10:00", end: "18:00", hours: 8 }
      case "Õhtu":
        return { start: "17:00", end: "02:00", hours: 9 }
      case "Öö":
        return { start: "22:00", end: "06:00", hours: 8 }
      case "Evening":
        return { start: "17:00", end: "02:00", hours: 9 }
      default:
        return { start: "09:00", end: "17:00", hours: 8 }
    }
  }

  // Get week date range for display
  const getWeekDateRange = () => {
    if (viewMode !== "weekly") return null

    const startDay = currentWeek * 7 + 1
    const endDay = Math.min(startDay + 6, daysInMonth)
    return `${startDay} - ${endDay} ${monthNames[month - 1]}`
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading schedule...</div>
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4">Schedule</h2>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        <Button variant="outline" className="mb-4 bg-purple-600 text-white hover:bg-purple-700">
          Kes täna tööl
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        {viewMode === "monthly" ? (
          <MonthNavigation
            month={month}
            year={year}
            onPrevious={goToPreviousMonth}
            onNext={goToNextMonth}
            monthNames={monthNames}
          />
        ) : (
          <WeekNavigation
            weekRange={getWeekDateRange() || ""}
            year={year}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
          />
        )}
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">Publish</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-50 w-40 sticky left-0 z-10">Worker</th>
              {days.map((day) => (
                <th key={day} className="border p-2 bg-gray-50 min-w-24 text-center">
                  <div>
                    {getDayName(day)} {day}
                  </div>
                </th>
              ))}
              <th className="border p-2 bg-gray-50 w-28 text-center">Total hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-medium bg-white sticky left-0 z-10">Unassigned shifts</td>
              {days.map((day) => (
                <td key={day} className="border p-1 bg-white">
                  <div className="flex flex-wrap gap-1">
                    {getUnassignedShiftsForDay(day).map((shift, index) => (
                      <div key={index} className={`text-xs p-1 rounded ${shiftColors[shift] || "bg-gray-200"}`}>
                        {shift}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
              <td className="border p-2 bg-white"></td>
            </tr>
            {uniqueWorkers.map((worker, index) => (
              <tr key={index}>
                <td className="border p-2 bg-white sticky left-0 z-10">
                  <div className="font-medium">{worker}</div>
                  <div className="text-xs text-gray-500">FTE 1.0</div>
                </td>
                {days.map((day) => {
                  const shift = getShiftForWorkerOnDay(worker, day)
                  return (
                    <td key={day} className="border p-1 bg-white">
                      {shift && (
                        <div
                          className={`p-2 rounded text-sm ${shiftColors[shift] || "bg-gray-100"} cursor-pointer hover:opacity-80`}
                          onClick={() => handleShiftClick(day, worker, shift)}
                        >
                          {shift}
                        </div>
                      )}
                    </td>
                  )
                })}
                <td className="border p-2 bg-white text-center font-medium">{getWorkerHours(worker)}/180</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shift Details Modal */}
      {selectedShift && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeShiftDetails}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <ShiftDetailsCard
              day={getDayName(selectedShift.day)}
              date={`${selectedShift.day} ${monthNames[month - 1]}`}
              shiftType={selectedShift.shift}
              startTime={getShiftTimes(selectedShift.shift).start}
              endTime={getShiftTimes(selectedShift.shift).end}
              hours={getShiftTimes(selectedShift.shift).hours}
              worker={selectedShift.worker}
              department="Intensiivosakond"
              fte={selectedShift.fte}
              onEdit={() => console.log("Edit shift", selectedShift)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
