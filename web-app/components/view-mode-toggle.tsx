"use client"

import { Button } from "@/components/ui/button"

type ViewMode = "monthly" | "weekly" | "daily"

interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={viewMode === "monthly" ? "default" : "outline"}
        onClick={() => onViewModeChange("monthly")}
        className="rounded-full"
      >
        Month
      </Button>
      <Button
        variant={viewMode === "weekly" ? "default" : "outline"}
        onClick={() => onViewModeChange("weekly")}
        className="rounded-full"
      >
        Week
      </Button>
      <Button
        variant={viewMode === "daily" ? "default" : "outline"}
        onClick={() => onViewModeChange("daily")}
        className="rounded-full"
      >
        Day
      </Button>
    </div>
  )
}
