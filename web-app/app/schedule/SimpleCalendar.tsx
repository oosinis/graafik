import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCalendarProps {
  selectedDates: string[]; // Array of date strings in YYYY-MM-DD format
  onDateToggle: (date: string) => void;
  color?: string;
  bgColor?: string;
  initialMonth?: number;
  initialYear?: number;
}

export function SimpleCalendar({ selectedDates, onDateToggle, color = '#7636ff', bgColor = '#eae1ff', initialMonth, initialYear }: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (initialMonth !== undefined && initialYear !== undefined) {
      return new Date(initialYear, initialMonth, 1);
    }
    return new Date();
  });
  
  // Update calendar when initialMonth or initialYear changes
  React.useEffect(() => {
    if (initialMonth !== undefined && initialYear !== undefined) {
      setCurrentMonth(new Date(initialYear, initialMonth, 1));
    }
  }, [initialMonth, initialYear]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    return {
      daysInMonth,
      startingDayOfWeek,
      year,
      month
    };
  };

  const formatDate = (year: number, month: number, day: number): string => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  const isDateSelected = (dateStr: string): boolean => {
    return selectedDates.includes(dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create array of days to render
  const days: (number | null)[] = [];
  
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-[12px]">
        <button
          onClick={goToPreviousMonth}
          className="w-[28px] h-[28px] rounded-[6px] bg-[#f7f6fb] flex items-center justify-center hover:bg-[#eae1ff] transition-colors"
        >
          <ChevronLeft className="w-[16px] h-[16px] text-[#19181d]" strokeWidth={2} />
        </button>
        <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
          {monthNames[month]} {year}
        </p>
        <button
          onClick={goToNextMonth}
          className="w-[28px] h-[28px] rounded-[6px] bg-[#f7f6fb] flex items-center justify-center hover:bg-[#eae1ff] transition-colors"
        >
          <ChevronRight className="w-[16px] h-[16px] text-[#19181d]" strokeWidth={2} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-[4px] mb-[4px]">
        {dayNames.map(name => (
          <div key={name} className="h-[28px] flex items-center justify-center">
            <p className="font-['Poppins:Medium',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[12px]">
              {name}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-[4px]">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-[32px]" />;
          }

          const dateStr = formatDate(year, month, day);
          const selected = isDateSelected(dateStr);

          return (
            <button
              key={day}
              onClick={() => onDateToggle(dateStr)}
              className={`h-[32px] rounded-[6px] flex items-center justify-center transition-colors ${
                selected
                  ? 'text-white'
                  : 'bg-[#f7f6fb] text-[#19181d] hover:bg-[#eae1ff]'
              }`}
              style={selected ? { backgroundColor: color } : {}}
            >
              <p className={`font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] leading-[14px]`}>
                {day}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
