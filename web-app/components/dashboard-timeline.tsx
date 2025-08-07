import React from "react";

interface Shift {
  id: string;
  worker: string;
  role: string;
  start: string; // "08:00"
  end: string;   // "14:00"
  color: string; // Tailwind class like "bg-pink-200"
}

export function DashboardTimeline({ shifts }: { shifts: Shift[] }) {
  const toHour = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1200px]">
        {/* Hour Labels Row */}
        <div className="grid grid-cols-24 text-xs text-gray-500 border-b px-4 py-2 bg-white sticky top-0 z-10">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="text-center">{i}:00</div>
          ))}
        </div>

        {/* Timeline Background Grid + Shift Bars */}
        <div className="relative">
          {/* Background Grid */}
          <div className="absolute inset-0 grid grid-cols-24 border-y border-gray-200">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border-l border-gray-100" />
            ))}
          </div>

          {/* Shift Bars */}
          <div className="relative space-y-3 px-4 py-4">
            {shifts.map((shift) => {
              const startHour = toHour(shift.start);
              const endHour = toHour(shift.end);
              const leftPercent = (startHour / 24) * 100;
              const widthPercent = ((endHour - startHour) / 24) * 100;

              return (
                <div key={shift.id} className="relative h-8 w-full">
                  <div
                    className={`absolute h-full ${shift.color} rounded-md text-xs px-3 flex items-center shadow-sm border border-gray-300`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  >
                    {shift.worker} <span className="ml-1 text-gray-600">({shift.role})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}