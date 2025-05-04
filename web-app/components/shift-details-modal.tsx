"use client"

import { ShiftDetailsCard } from "@/components/shift-details-card"

interface ShiftDetailsModalProps {
  day: string
  date: string
  shiftType: string
  startTime: string
  endTime: string
  hours: number
  worker: string
  department: string
  fte: string
  onEdit: () => void
  onClose: () => void
}

export function ShiftDetailsModal({
  day,
  date,
  shiftType,
  startTime,
  endTime,
  hours,
  worker,
  department,
  fte,
  onEdit,
  onClose,
}: ShiftDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <ShiftDetailsCard
          day={day}
          date={date}
          shiftType={shiftType}
          startTime={startTime}
          endTime={endTime}
          hours={hours}
          worker={worker}
          department={department}
          fte={fte}
          onEdit={onEdit}
        />
      </div>
    </div>
  )
}
