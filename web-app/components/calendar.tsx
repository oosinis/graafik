"use client"

import { useState } from "react"
import { /* format, */ startOfMonth, getDaysInMonth, getDay, subMonths, addMonths } from "date-fns"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  export function Calendar({ scheduleMarkings }) {
    const today = new Date()
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfWeek = getDay(startOfMonth(currentDate)) // 0 = Sunday
  
    const generateCalendarDays = () => {
      const days = []
  
      // Add padding for days before the 1st
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null)
      }
  
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day)
      }
  
      return days
    }
  
    const calendarDays = generateCalendarDays()
  
    const handleMonthChange = (value: string) => {
      const newMonth = months.indexOf(value)
      setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1))
    }
  
    const handlePrevMonth = () => {
      setCurrentDate((prev) => subMonths(prev, 1))
    }
  
    const handleNextMonth = () => {
      setCurrentDate((prev) => addMonths(prev, 1))
    }
  
    return (
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={handlePrevMonth}>←</Button>
          <Select onValueChange={handleMonthChange} value={months[currentDate.getMonth()]}>
            <SelectTrigger className="w-40 text-center">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleNextMonth}>→</Button>
        </div>
  
        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-gray-500">{day}</div>
          ))}
        </div>
  
        <div className="grid grid-cols-7 gap-2 p-auto">
          {calendarDays.map((day, index) => (
            <div
            key={index}
            className={`h-24 flex flex-col items-center justify-start p-1 rounded border text-sm ${day ? "bg-white" : "bg-transparent"}`}
          >
            {day && <span className="mb-1 font-medium">{day}</span>}
            <select className="w-full px-1 py-1 text-xs rounded border">
              <option value=""></option>
              {scheduleMarkings.map((marking) => (
                <option key={marking.name} value={marking.name}>
                  {marking.name}
                </option>
              ))}
            </select>
          </div>          
          ))}
        </div>
      </div>
    )
  }