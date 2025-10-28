import { useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Employee } from './Employees';
import { Shift } from '@/models/Shift';
import { GeneratedSchedule } from '../schedule/MonthScheduleView';

interface EmployeeDashboardProps {
  userData: any;
  employees: Employee[];
  shifts: Shift[];
  generatedSchedules: { [key: string]: GeneratedSchedule };
  myEmployee?: Employee;
}

export function EmployeeDashboard({
  userData,
  employees,
  shifts,
  generatedSchedules,
  myEmployee
}: EmployeeDashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}`;
  });

  // Get current month's schedule
  const currentSchedule = generatedSchedules[selectedMonth];

  // Get my shifts from the current schedule
  const myShifts = currentSchedule?.assignments?.filter(
    assignment => assignment.employeeId === myEmployee?.id
  ) || [];

  // Group shifts by date
  const shiftsByDate: { [date: string]: any[] } = {};
  myShifts.forEach(assignment => {
    if (!shiftsByDate[assignment.date]) {
      shiftsByDate[assignment.date] = [];
    }
    shiftsByDate[assignment.date].push(assignment);
  });

  // Get upcoming shifts (next 7 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingShifts = myShifts
    .filter(assignment => {
      const shiftDate = new Date(assignment.date);
      shiftDate.setHours(0, 0, 0, 0);
      return shiftDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 7);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getShiftDetails = (shiftId: string) => {
    return shifts.find(s => s.id === shiftId);
  };

  return (
    <div className="py-[32px] px-[48px] w-full">
      {!myEmployee ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <User className="w-16 h-16 text-[#888796] mx-auto mb-4" />
          <h2 className="font-['Poppins:SemiBold',_sans-serif] text-[24px] text-[#19181d] mb-2">
            Welcome!
          </h2>
          <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#888796] mb-6">
            Your admin hasn't created an employee profile for you yet. Please contact them to get started.
          </p>
          <p className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#888796]">
            Your email: <span className="text-[#7636ff]">{userData.email}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Employee Info Card */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="font-['Poppins:SemiBold',_sans-serif] text-[20px] text-[#19181d] mb-1">
              My Information
            </h2>
            <p className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#888796]">
              Role: {myEmployee.role}
            </p>
          </div>

          {/* Upcoming Shifts */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#7636ff]" />
              <h2 className="font-['Poppins:SemiBold',_sans-serif] text-[20px] text-[#19181d]">
                My Upcoming Shifts
              </h2>
            </div>

            {upcomingShifts.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-[#888796] mx-auto mb-3" />
                <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#888796]">
                  No upcoming shifts scheduled
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingShifts.map((assignment, index) => {
                  const shift = getShiftDetails(assignment.shiftId);
                  if (!shift) return null;

                  return (
                    <div
                      key={`${assignment.date}-${assignment.shiftId}-${index}`}
                      className="flex items-center justify-between p-4 bg-[#f7f6fb] rounded-lg hover:bg-[#ede9fe] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#7636ff] flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-['Poppins:SemiBold',_sans-serif] text-[16px] text-[#19181d]">
                            {formatDate(assignment.date)}
                          </p>
                          <p className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#888796]">
                            {shift.startTime} - {shift.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-['Poppins:Medium',_sans-serif] text-[14px] text-[#19181d]">
                          {shift.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Full Month Calendar */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Poppins:SemiBold',_sans-serif] text-[20px] text-[#19181d]">
                My Schedule
              </h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-[#f7f6fb] rounded-lg font-['Poppins:Regular',_sans-serif] text-[14px] text-[#19181d] outline-none focus:ring-2 focus:ring-[#7636ff]"
              >
                {Object.keys(generatedSchedules).sort().map(key => {
                  const [year, month] = key.split('-');
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return (
                    <option key={key} value={key}>
                      {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </option>
                  );
                })}
                {Object.keys(generatedSchedules).length === 0 && (
                  <option value={selectedMonth}>
                    {new Date(
                      parseInt(selectedMonth.split('-')[0]),
                      parseInt(selectedMonth.split('-')[1]) - 1
                    ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </option>
                )}
              </select>
            </div>

            {Object.keys(shiftsByDate).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-[#888796] mx-auto mb-3" />
                <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#888796]">
                  No shifts scheduled for this month
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(shiftsByDate)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([date, assignments]) => (
                    <div key={date} className="flex items-start gap-4 p-3 bg-[#f7f6fb] rounded-lg">
                      <div className="min-w-[80px] text-right">
                        <p className="font-['Poppins:SemiBold',_sans-serif] text-[14px] text-[#19181d]">
                          {new Date(date).getDate()}
                        </p>
                        <p className="font-['Poppins:Regular',_sans-serif] text-[12px] text-[#888796]">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {assignments.map((assignment, idx) => {
                          const shift = getShiftDetails(assignment.shiftId);
                          if (!shift) return null;

                          return (
                            <div
                              key={`${assignment.shiftId}-${idx}`}
                              className="flex items-center gap-3 p-2 bg-white rounded border border-[#e6e6ec]"
                            >
                              <Clock className="w-4 h-4 text-[#7636ff]" />
                              <div className="flex-1">
                                <p className="font-['Poppins:Medium',_sans-serif] text-[14px] text-[#19181d]">
                                  {shift.name}
                                </p>
                                <p className="font-['Poppins:Regular',_sans-serif] text-[12px] text-[#888796]">
                                  {shift.startTime} - {shift.endTime}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
