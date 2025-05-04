"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MonthNavigationProps {
  month: number
  year: number
  onPrevious: () => void
  onNext: () => void
  monthNames: string[]
}

export function MonthNavigation({ month, year, onPrevious, onNext, monthNames }: MonthNavigationProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={onPrevious}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h2 className="text-2xl font-bold">
        {monthNames[month - 1]} {year}
      </h2>
      <Button variant="ghost" size="icon" onClick={onNext}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
