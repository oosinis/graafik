"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DayNavigationProps {
  date: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export function DayNavigation({ date, onPrevious, onNext }: DayNavigationProps) {
  const label = date.toLocaleDateString("et-EE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Button variant="ghost" size="icon" onClick={onPrevious}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h2 className="text-xl font-semibold">{label}</h2>
      <Button variant="ghost" size="icon" onClick={onNext}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
