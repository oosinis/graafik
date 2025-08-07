"use client";

import DashboardDisplay from "@/components/dashboard-display";

export default function DashboardRoute() {
  const today = new Date();

  // mock data
  const upcomingShifts = [
    { id: "1", worker: "Sander Saar",   role: "Vahetusevanem", start: "08:00", end: "14:00", color: "bg-pink-200" },
    { id: "2", worker: "Mirjam Laane",  role: "Vahetusevanem", start: "09:00", end: "15:00", color: "bg-purple-200" },
    // …add more…
  ];

  const activeWorkers = [
    { id: "1", name: "Sander Saar",   role: "Vahetusevanem", time: "08:00–14:00" },
    { id: "2", name: "Mirjam Laane",  role: "Vahetusevanem", time: "09:00–15:00" },
    // …add more…
  ];

  const notifications = [
    { id: "1", message: "Mirjam Laane has updated her availability", time: "2h ago" },
    { id: "2", message: "New shift assigned to Sander Saar",      time: "5h ago" },
    // …add more…
  ];

  return (
    <DashboardDisplay
      date={today}
      upcomingShifts={upcomingShifts}
      activeWorkers={activeWorkers}
      notifications={notifications}
    />
  );
}