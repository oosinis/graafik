"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Employee } from '@/models/Employee';
import type { Shift } from '@/models/Shift';
import type { GeneratedSchedule } from '@/models/Schedule';
import { ScheduleCalendar } from '../schedule/ScheduleCalendar';

interface DashboardProps {
  employees: Employee[];
  roles: Array<{ name: string; color: string; backgroundColor: string }>;
  shifts: Shift[];
  generatedSchedules: { [key: string]: GeneratedSchedule };
}

export function Dashboard({ employees, roles, shifts, generatedSchedules }: DashboardProps) {
  // Use state to track the selected date (starts with today)
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  // Convert 0-based month to 1-based for storage key
  const todayKey = `${currentYear}-${currentMonth + 1}`;
  
  // Navigation functions
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  
  // Check if selected date is today
  const isToday = useMemo(() => {
    const today = new Date();
    return selectedDate.getFullYear() === today.getFullYear() &&
           selectedDate.getMonth() === today.getMonth() &&
           selectedDate.getDate() === today.getDate();
  }, [selectedDate]);
  
  // Get currently working employees based on the generated schedule
  const currentlyWorking = useMemo(() => {
    const schedule = generatedSchedules[todayKey];
    if (!schedule) return [];
    
    // Format selected date as YYYY-MM-DD
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const todayDateKey = `${year}-${month}-${day}`;
    
    // Get current time in minutes since midnight (only use real time if viewing today)
    const now = new Date();
    const currentTimeMinutes = isToday 
      ? now.getHours() * 60 + now.getMinutes()
      : 0; // Show all shifts if not today
    
    // Function to convert time string to minutes
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    // Filter assignments for selected date and currently working
    const todaysAssignments = schedule.assignments.filter(assignment => {
      if (assignment.date !== todayDateKey || assignment.isDayOff) return false;
      
      const startMinutes = timeToMinutes(assignment.startTime);
      const endMinutes = timeToMinutes(assignment.endTime);
      
      // If viewing today, check if current time is within shift time
      // If viewing another day, show all shifts
      if (isToday) {
        return currentTimeMinutes >= startMinutes && currentTimeMinutes <= endMinutes;
      }
      return true; // Show all shifts for non-today dates
    });
    
    return todaysAssignments.map(assignment => {
      const employee = employees.find(e => e.id === assignment.employeeId);
      return {
        name: assignment.employeeName,
        role: employee?.role || 'Staff',
        roleColor: assignment.shiftColor,
        roleBg: assignment.shiftBg,
        time: `${assignment.startTime} - ${assignment.endTime}`,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${assignment.employeeName}`
      };
    });
  }, [selectedDate, generatedSchedules, employees, todayKey, isToday]);

  return (
    <div className="py-[32px] w-full">
      {/* Header */}
      <div className="mb-[32px]">
        <h1 className="font-['Poppins:Medium',_sans-serif] text-[28px] tracking-[-0.56px] text-[#19181d] leading-[16px] mb-[16px]">
          Your dashboard
        </h1>
      </div>

      {/* Main Content - Single Column (Responsive) */}
      <div className="max-w-[1200px]">
        {/* Schedule & Currently Working */}
        <div className="space-y-[24px]">
          {/* Today's Schedule */}
          <div className="bg-white rounded-[15px] p-[24px]">
            <div className="mb-[16px] flex items-center justify-between">
              <div>
                <p className="font-['Poppins:Medium',_sans-serif] text-[#888796] text-[16px] tracking-[-0.32px] leading-[16px] mb-[8px]">
                  {isToday ? 'Today' : 'Schedule'}
                </p>
                <h2 className="font-['Poppins:Medium',_sans-serif] text-[22px] tracking-[-0.44px] text-black leading-[16px]">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
              </div>
              
              {/* Date Navigation Controls */}
              <div className="flex items-center gap-[12px]">
                <button
                  onClick={goToPreviousDay}
                  className="p-[8px] rounded-[8px] hover:bg-[#f7f6fb] transition-colors"
                  title="Previous day"
                >
                  <ChevronLeft className="w-[20px] h-[20px] text-[#888796]" strokeWidth={2} />
                </button>
                
                {!isToday && (
                  <button
                    onClick={goToToday}
                    className="px-[16px] py-[8px] rounded-[8px] bg-[#7636ff] hover:bg-[#6428e0] transition-colors"
                  >
                    <span className="font-['Poppins:Medium',_sans-serif] text-[14px] text-white tracking-[-0.28px]">
                      Today
                    </span>
                  </button>
                )}
                
                <button
                  onClick={goToNextDay}
                  className="p-[8px] rounded-[8px] hover:bg-[#f7f6fb] transition-colors"
                  title="Next day"
                >
                  <ChevronRight className="w-[20px] h-[20px] text-[#888796]" strokeWidth={2} />
                </button>
              </div>
            </div>
            
            {/* Schedule Calendar */}
            <ScheduleCalendar 
              shifts={(() => {
                const schedule = generatedSchedules[todayKey];
                if (!schedule) return [];
                
                // Format selected date as YYYY-MM-DD
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const todayDateKey = `${year}-${month}-${day}`;
                
                // Convert assignments to shifts format for calendar
                return schedule.assignments
                  .filter(a => a.date === todayDateKey && !a.isDayOff)
                  .map(a => {
                    // Find the actual shift to get its name/type
                    const actualShift = shifts.find(s => s.id === a.shiftId);
                    
                    return {
                      id: `${a.employeeId}-${a.date}-${a.shiftId}`,
                      employeeName: a.employeeName,
                      employeeImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.employeeName}`,
                      role: employees.find(e => e.id === a.employeeId)?.role || 'Staff',
                      roleColor: a.shiftColor,
                      roleBg: a.shiftBg,
                      shiftType: actualShift?.name || a.shiftName || 'Shift',
                      shiftColor: a.shiftColor,
                      shiftBg: a.shiftBg,
                      startTime: a.startTime,
                      endTime: a.endTime,
                      day: 0 // Selected day (doesn't matter for dashboard view)
                    };
                  });
              })()}
              currentDate={selectedDate} 
            />
          </div>

          {/* Currently Working */}
          <div className="bg-white rounded-[15px] p-[24px]" style={{ minHeight: 'calc(100vh - 580px)' }}>
            <h2 className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-black leading-[16px] mb-[24px]">
              {isToday ? 'Currently working' : 'Scheduled employees'}
            </h2>
            
            {currentlyWorking.length > 0 ? (
              <div className="space-y-[8px]">
                {currentlyWorking.map((person, index) => (
                  <div key={index} className="bg-[#f7f6fb] rounded-[8px] p-[14px] flex items-center gap-[12px]">
                    <div className="size-[24px] rounded-full overflow-hidden flex-shrink-0">
                      <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-['Poppins:Medium',_sans-serif] text-[14px] text-black tracking-[-0.28px] capitalize leading-[14px]">
                      {person.name}
                    </p>
                    <div 
                      className="px-[10px] py-[5px] rounded-[4px] border border-solid"
                      style={{ 
                        backgroundColor: person.roleColor,
                        borderColor: `${person.roleBg}33`
                      }}
                    >
                      <p 
                        className="font-['Poppins:Medium',_sans-serif] text-[12px] tracking-[-0.24px] capitalize leading-[12px]"
                        style={{ color: person.roleBg }}
                      >
                        {person.role}
                      </p>
                    </div>
                    <p className="font-['Poppins:Medium',_sans-serif] text-[12px] text-black tracking-[-0.24px] capitalize leading-[12px]">
                      {person.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#f7f6fb] rounded-[8px] p-[24px] text-center">
                <p className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#888796] tracking-[-0.28px]">
                  No employees currently working
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

  export default Dashboard;
