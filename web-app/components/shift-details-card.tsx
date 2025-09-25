/* "use client"

import { Pencil, Briefcase, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShiftDetailsCardProps {
  date: string
  day: string
  shiftType: string
  startTime: string
  endTime: string
  hours: number
  worker: string
  department: string
  fte: string
  onEdit?: () => void
}

export function ShiftDetailsCard({
  date,
  day,
  shiftType,
  startTime,
  endTime,
  hours,
  worker,
  department,
  fte,
  onEdit,
}: ShiftDetailsCardProps) {
  return (
    {/* <div className="w-64 rounded-lg overflow-hidden shadow-md bg-white">
      <div className="bg-pink-200 h-2 w-full"></div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <div className="text-gray-600 text-sm">
            {day}, {date}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-purple-600" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <h3 className="text-xl font-bold mb-1">{shiftType}</h3>

        <div className="text-gray-700 mb-1">
          {startTime} - {endTime}
        </div>

        <div className="text-gray-500 text-sm mb-3">{hours} hours</div>

        <div className="font-medium mb-1">{worker}</div>

        <div className="flex items-center text-gray-500 text-sm mb-1">
          <Briefcase className="h-4 w-4 mr-1" />
          <span>{department}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>FTE {fte}</span>
        </div>
      </div>

      <div className="flex">
        <div className="bg-green-200 text-xs py-1 px-2 flex-1 text-center">Afternoon</div>
        <div className="bg-orange-200 text-xs py-1 px-2 flex-1 text-center">Morning</div>
      </div>
    </div> */