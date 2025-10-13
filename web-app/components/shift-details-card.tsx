 "use client"

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

//testimiseks tegin mõned väljad valikulisteks - TODO: tee korda hiljem
interface ShiftDetailsCardProps {
  day: number
  shiftType: string
  worker: string
  duration: number
  onEdit?: () => void
}

export function ShiftDetailsCard({
  shiftType,
  worker,
  duration,
  onEdit,
}: ShiftDetailsCardProps) {
  return (
     <div className="w-64 rounded-lg overflow-hidden shadow-md bg-white">
      <div className="bg-pink-200 h-2 w-full"></div>

      <div className="p-4">
        <div className="flex justify-end items-start mb-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-purple-600" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-gray-500 text-sm">Shift type:</div>
        <h3 className="text-xl font-bold mb-1">{shiftType}</h3>

        <div className="text-gray-500 text-sm mb-3">{duration} hours</div>

        <div className="font-medium mb-1">{worker}</div>
      </div>
    </div> 
) }