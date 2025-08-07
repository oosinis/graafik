"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { DashboardTimeline } from "@/components/dashboard-timeline";

interface Shift {
  id: string;
  worker: string;
  role: string;
  start: string;
  end: string;
  color: string;
}

interface WorkerShift {
  id: string;
  name: string;
  role: string;
  time: string;
}

interface Notification {
  id: string;
  message: string;
  time: string;
}

interface DashboardDisplayProps {
  date: Date;
  upcomingShifts: Shift[];
  activeWorkers: WorkerShift[];
  notifications: Notification[];
}

export default function DashboardDisplay({
  date,
  upcomingShifts,
  activeWorkers,
  notifications,
}: DashboardDisplayProps) {
  const router = useRouter();

  const dateString = date.toLocaleDateString("et-EE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F4F2FA] px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left & Center columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Your schedule for {dateString}</h2>
              </div>
              <Button
                onClick={() => router.push("/schedules/new")}
                className="bg-[#0E0F3F] text-white px-4 py-2 rounded-md hover:bg-[#1e1f5e]"
              >
                New Schedule +
              </Button>
            </div>
            <DashboardTimeline shifts={upcomingShifts} />
          </div>

          {/* Currently working */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Currently working</h3>
            {activeWorkers.length ? (
              <ul className="space-y-4">
                {activeWorkers.map(w => (
                  <li key={w.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{w.name}</div>
                      <div className="text-sm text-gray-500">{w.role}</div>
                    </div>
                    <div className="text-sm text-gray-700">{w.time}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Looks like a day off for everyone…</p>
            )}
          </div>
        </div>

        {/* Right column: Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {notifications.length ? (
              notifications.map(n => (
                <div key={n.id} className="flex justify-between items-start">
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{n.time}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No notifications for now!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}