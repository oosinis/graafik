"use client"

import { Button } from "@/components/ui/button"

interface ViewModeToggleProps {
  viewMode: "weekly" | "monthly"
  onViewModeChange: (mode: "weekly" | "monthly") => void
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={viewMode === "weekly" ? "default" : "outline"}
        onClick={() => onViewModeChange("weekly")}
        className="rounded-full"
      >
        Weekly
      </Button>
      <Button
        variant={viewMode === "monthly" ? "default" : "outline"}
        onClick={() => onViewModeChange("monthly")}
        className="rounded-full"
      >
        Monthly
      </Button>
    </div>
  )
}
