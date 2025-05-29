"use client";

import { Button } from "@/components/ui/button";

interface ViewModeToggleProps {
  viewMode: "monthly" | "weekly" | "daily";
  onViewModeChange: (mode: "monthly" | "weekly" | "daily") => void;
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant={viewMode === "monthly" ? "default" : "outline"}
        onClick={() => onViewModeChange("monthly")}
        className="rounded-full"
        size="sm"
      >
        Month
      </Button>
      <Button
        variant={viewMode === "weekly" ? "default" : "outline"}
        onClick={() => onViewModeChange("weekly")}
        className="rounded-full"
        size="sm"
      >
        Week
      </Button>
      <Button
        variant={viewMode === "daily" ? "default" : "outline"}
        onClick={() => onViewModeChange("daily")}
        className="rounded-full"
        size="sm"
      >
        Day
      </Button>
    </div>
  );
}
