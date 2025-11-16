const imgImage = 'https://api.dicebear.com/7.x/avataaars/svg?seed=img1';
const imgImage1 = 'https://api.dicebear.com/7.x/avataaars/svg?seed=img2';
const imgImage2 = 'https://api.dicebear.com/7.x/avataaars/svg?seed=img3';

export interface Shift {
  id: string;
  employeeName: string;
  employeeImage: string;
  role: string;
  roleColor: string;
  roleBg: string;
  shiftType: string;
  shiftColor: string;
  shiftBg: string;
  startTime: string;
  endTime: string;
  day: number; // 0 = Monday, 1 = Tuesday, etc.
}

interface ScheduleCalendarProps {
  shifts: Shift[];
  currentDate: Date;
}

export function ScheduleCalendar({ shifts, currentDate }: ScheduleCalendarProps) {
  const days = ['Mon, 21', 'Tue, 22', 'Wed, 23', 'Thu, 24', 'Fri, 25', 'Sat, 26', 'Sun, 27'];
  const startHour = 0;
  const totalHours = 24; // Full 24 hours
  const hours = Array.from({ length: totalHours }, (_, i) => i);

  const getShiftPosition = (startTime: string, endTime: string) => {
    const [startHr, startMin] = startTime.split(':').map(Number);
    const [endHr, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = (startHr - startHour) * 60 + startMin;
    
    // Handle midnight (00:00) as end of day (24:00)
    let endTotalMinutes = endHr * 60 + endMin;
    if (endHr === 0 && endMin === 0) {
      endTotalMinutes = 24 * 60;
    }
    
    const startTotalMinutes = startHr * 60 + startMin;
    const duration = endTotalMinutes - startTotalMinutes;
    
    return {
      left: `${(startMinutes / 60) * 68}px`, // 68px per hour
      width: `${(duration / 60) * 68}px` // Exact width based on duration
    };
  };

  // Sort shifts by day and time
  const sortedShifts = [...shifts].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="relative border border-[#e6e6ec] rounded-[8px] overflow-hidden bg-white w-full h-[552px]">
      {/* Single scrollable container for both vertical and horizontal */}
      <div className="h-full overflow-auto pr-[24px]">
        <div className="relative">
          {/* Header - Time Slots (Sticky Top) */}
          <div className="sticky top-0 z-10 bg-white border-b border-[#e6e6ec] flex" style={{ minWidth: `${140 + 24 * 68}px` }}>
            {/* Left column header - sticky */}
            <div className="sticky left-0 z-20 bg-[#f7f6fb] p-[12px] border-r border-[#e6e6ec] w-[140px] flex-shrink-0"></div>
            {/* Time headers */}
            <div className="flex">
              {hours.map((hour, index) => (
                <div key={index} className="bg-[#f7f6fb] p-[8px] border-l border-[#e6e6ec] first:border-l-0 w-[68px] flex-shrink-0">
                  <p className="font-['Poppins:Medium',_sans-serif] text-[10px] text-[#888796] tracking-[-0.2px] leading-[10px] text-center">
                    {hour.toString().padStart(2, '0')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Rows */}
          {sortedShifts.map((shift) => (
            <div key={shift.id} className="flex border-b border-[#e6e6ec] last:border-b-0 hover:bg-[#f7f6fb] transition-colors" style={{ minWidth: `${140 + 24 * 68}px` }}>
              {/* Shift Info - Sticky Left */}
              <div className="sticky left-0 z-[5] bg-white p-[10px] flex flex-col gap-[4px] border-r border-[#e6e6ec] w-[140px] flex-shrink-0">
                <p className="font-['Poppins:Medium',_sans-serif] text-[10px] text-[#888796] tracking-[-0.2px] leading-[10px]">
                  {days[shift.day]}
                </p>
                <p className="font-['Poppins:Medium',_sans-serif] text-[12px] text-[#19181d] tracking-[-0.24px] leading-[12px]">
                  {shift.employeeName}
                </p>
              </div>

              {/* Time Grid with Shift Block */}
              <div className="relative h-[60px] flex-1" style={{ minWidth: `${24 * 68}px` }}>
                {/* Grid Lines */}
                <div className="absolute inset-0 flex">
                  {hours.map((_, idx) => (
                    <div 
                      key={idx} 
                      className="border-l border-[#e6e6ec] first:border-l-0 w-[68px] flex-shrink-0"
                    />
                  ))}
                </div>

                {/* Shift Block */}
                <div className="absolute inset-0 py-[6px]">
                  {(() => {
                    const position = getShiftPosition(shift.startTime, shift.endTime);
                    return (
                      <div
                        className="absolute top-[6px] bottom-[6px] rounded-[5px] border border-solid px-[8px] py-[6px] cursor-pointer hover:shadow-md transition-shadow"
                        style={{
                          backgroundColor: shift.shiftBg,
                          borderColor: `${shift.shiftColor}4d`,
                          ...position
                        }}
                      >
                        <div className="flex flex-col gap-[4px] h-full justify-center">
                          <p 
                            className="font-['Poppins:Regular',_sans-serif] text-[8px] tracking-[-0.16px] leading-[10px] uppercase"
                            style={{ color: `${shift.shiftColor}99` }}
                          >
                            {shift.startTime} - {shift.endTime}
                          </p>
                          <p 
                            className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] leading-[10px]"
                            style={{ color: shift.shiftColor }}
                          >
                            {shift.shiftType}
                          </p>
                          <p 
                            className="font-['Poppins:Regular',_sans-serif] text-[8px] tracking-[-0.16px] leading-[10px]"
                            style={{ color: `${shift.shiftColor}99` }}
                          >
                            {shift.role}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty placeholder rows to fill the space */}
          {Array.from({ length: Math.max(0, 8 - sortedShifts.length) }).map((_, index) => (
            <div key={`empty-${index}`} className="flex border-b border-[#e6e6ec] last:border-b-0" style={{ minWidth: `${140 + 24 * 68}px` }}>
              {/* Empty left column */}
              <div className="sticky left-0 z-[5] bg-white p-[10px] border-r border-[#e6e6ec] w-[140px] flex-shrink-0 h-[60px]" />
              
              {/* Empty time grid */}
              <div className="relative h-[60px] flex-1" style={{ minWidth: `${24 * 68}px` }}>
                <div className="absolute inset-0 flex">
                  {hours.map((_, idx) => (
                    <div 
                      key={idx} 
                      className="border-l border-[#e6e6ec] first:border-l-0 w-[68px] flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to get currently working employees
export function getCurrentlyWorking(shifts: Shift[], currentTime: Date = new Date()): Shift[] {
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinutes;
  const currentDay = currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1; // Convert to our day indexing (0 = Monday)

  return shifts.filter(shift => {
    if (shift.day !== currentDay) return false;

    const [startHour, startMin] = shift.startTime.split(':').map(Number);
    const [endHour, endMin] = shift.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMin;
    // Handle midnight (00:00) as end of day (24:00 = 1440 minutes)
    const endTotalMinutes = endHour === 0 && endMin === 0 ? 24 * 60 : endHour * 60 + endMin;

    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes;
  });
}

// Sample shift data
export const sampleShifts: Shift[] = [
  // Monday (day 0)
  {
    id: '1',
    employeeName: 'Jaan Tamm',
    employeeImage: imgImage,
    role: 'Chef',
    roleColor: '#fad1ff',
    roleBg: '#9d37aa',
    shiftType: 'Morning',
    shiftColor: '#9d37aa',
    shiftBg: '#fad1ff',
    startTime: '07:00',
    endTime: '14:00',
    day: 0
  },
  {
    id: '2',
    employeeName: 'Mirjam Laane',
    employeeImage: imgImage1,
    role: 'Shift manager',
    roleColor: '#cfe9f1',
    roleBg: '#234d5b',
    shiftType: 'Lunch',
    shiftColor: '#234d5b',
    shiftBg: '#cfe9f1',
    startTime: '12:00',
    endTime: '19:00',
    day: 0
  },
  {
    id: '11',
    employeeName: 'Saskia Saar',
    employeeImage: imgImage2,
    role: 'Waitress',
    roleColor: '#fadfce',
    roleBg: '#b34b24',
    shiftType: 'Night',
    shiftColor: '#b34b24',
    shiftBg: '#fadfce',
    startTime: '18:00',
    endTime: '00:00',
    day: 0
  },
  // Tuesday (day 1)
  {
    id: '3',
    employeeName: 'Triin Lepik',
    employeeImage: imgImage2,
    role: 'Waitress',
    roleColor: '#fadfce',
    roleBg: '#b34b24',
    shiftType: 'Day',
    shiftColor: '#b34b24',
    shiftBg: '#fadfce',
    startTime: '09:00',
    endTime: '17:00',
    day: 1
  },
  {
    id: '4',
    employeeName: 'Sander Saar',
    employeeImage: imgImage,
    role: 'Chef',
    roleColor: '#fad1ff',
    roleBg: '#9d37aa',
    shiftType: 'Morning',
    shiftColor: '#9d37aa',
    shiftBg: '#fad1ff',
    startTime: '07:00',
    endTime: '14:00',
    day: 1
  },
  {
    id: '12',
    employeeName: 'Jaanika Jõgi',
    employeeImage: imgImage1,
    role: 'Shift manager',
    roleColor: '#cfe9f1',
    roleBg: '#234d5b',
    shiftType: 'Night',
    shiftColor: '#234d5b',
    shiftBg: '#cfe9f1',
    startTime: '17:00',
    endTime: '00:00',
    day: 1
  },
  // Wednesday (day 2)
  {
    id: '5',
    employeeName: 'Liisa Kruus',
    employeeImage: imgImage1,
    role: 'Shift manager',
    roleColor: '#cfe9f1',
    roleBg: '#234d5b',
    shiftType: 'Lunch',
    shiftColor: '#234d5b',
    shiftBg: '#cfe9f1',
    startTime: '12:00',
    endTime: '19:00',
    day: 2
  },
  {
    id: '6',
    employeeName: 'Kelly Kuuse',
    employeeImage: imgImage2,
    role: 'Waitress',
    roleColor: '#fadfce',
    roleBg: '#b34b24',
    shiftType: 'Day',
    shiftColor: '#b34b24',
    shiftBg: '#fadfce',
    startTime: '10:00',
    endTime: '17:00',
    day: 2
  },
  // Thursday (day 3)
  {
    id: '7',
    employeeName: 'Joosep Karu',
    employeeImage: imgImage,
    role: 'Chef',
    roleColor: '#fad1ff',
    roleBg: '#9d37aa',
    shiftType: 'Morning',
    shiftColor: '#9d37aa',
    shiftBg: '#fad1ff',
    startTime: '07:00',
    endTime: '14:00',
    day: 3
  },
  {
    id: '8',
    employeeName: 'Kadri Mets',
    employeeImage: imgImage1,
    role: 'Shift manager',
    roleColor: '#cfe9f1',
    roleBg: '#234d5b',
    shiftType: 'Evening',
    shiftColor: '#234d5b',
    shiftBg: '#cfe9f1',
    startTime: '14:00',
    endTime: '23:00',
    day: 3
  },
  // Friday (day 4)
  {
    id: '9',
    employeeName: 'Mari Kask',
    employeeImage: imgImage2,
    role: 'Waitress',
    roleColor: '#fadfce',
    roleBg: '#b34b24',
    shiftType: 'Day',
    shiftColor: '#b34b24',
    shiftBg: '#fadfce',
    startTime: '09:00',
    endTime: '16:00',
    day: 4
  },
  {
    id: '10',
    employeeName: 'Priit Pärn',
    employeeImage: imgImage,
    role: 'Chef',
    roleColor: '#fad1ff',
    roleBg: '#9d37aa',
    shiftType: 'Morning',
    shiftColor: '#9d37aa',
    shiftBg: '#fad1ff',
    startTime: '07:00',
    endTime: '14:00',
    day: 4
  }
];
