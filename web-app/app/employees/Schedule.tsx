import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import type { Employee } from './Employees';
import type { GeneratedSchedule } from '@/models/Schedule';

// Dynamically import MonthScheduleView to avoid SSR issues with react-dnd
const MonthScheduleView = dynamic(() => import('../schedule/MonthScheduleView').then(mod => ({ default: mod.MonthScheduleView })), {
  ssr: false
});

interface EmployeeScheduleProps {
  employees: Employee[];
  roles: Array<{ name: string; color: string; backgroundColor: string }>;
  generatedSchedules?: { [key: string]: GeneratedSchedule };
}

export function EmployeeSchedule({ employees, roles, generatedSchedules = {} }: EmployeeScheduleProps) {
  const [schedule, setSchedule] = useState<GeneratedSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  useEffect(() => {
    loadSchedule();
  }, [selectedYear, selectedMonth, generatedSchedules]);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsYearOpen(false);
      setIsMonthOpen(false);
    };

    if (isYearOpen || isMonthOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isYearOpen, isMonthOpen]);

  const loadSchedule = async () => {
    setIsLoading(true);
    
    try {
      // Check if we have a generated schedule in state
      const storageKey = `${selectedYear}-${selectedMonth + 1}`;
      
      console.log(`📅 Employee Schedule - Looking for: ${storageKey}`);
      console.log('   Available schedules:', Object.keys(generatedSchedules).sort());
      
      if (generatedSchedules[storageKey]) {
        console.log(`   ✅ Found schedule in state for ${storageKey}`);
        setSchedule(generatedSchedules[storageKey]);
      } else {
        console.log(`   ❌ No schedule found for ${storageKey}`);
        setSchedule(null);
      }
    } catch (error) {
      console.error('❌ Error loading schedule:', error);
      setSchedule(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-[32px] w-full">
      {/* Header */}
      <div className="mb-[11px] flex items-center justify-between pr-[24px]">
        <h1 className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-[#19181d] leading-[32px] capitalize">
          Schedule
        </h1>
        
        {/* Month & Year Selectors */}
        <div className="flex gap-[8px]">
          {/* Month Selector */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMonthOpen(!isMonthOpen);
                setIsYearOpen(false);
              }}
              className="bg-white box-border flex gap-[8px] h-[38px] items-center p-[12px] rounded-[8px]"
            >
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                Month
              </p>
              <div className="flex gap-[8px] items-center">
                <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#1f1e30] leading-[16px]">
                  {months[selectedMonth]}
                </p>
                <ChevronDown className="w-[16px] h-[16px] text-[#1f1e30]" strokeWidth={2} />
              </div>
            </button>
            
            {isMonthOpen && (
              <div className="absolute top-[42px] right-0 bg-white border border-[#e6e6ec] rounded-[8px] shadow-lg z-10 min-w-[160px] max-h-[300px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMonth(index);
                      setIsMonthOpen(false);
                    }}
                    className={`w-full text-left px-[12px] py-[8px] hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] leading-[16px] first:rounded-t-[8px] last:rounded-b-[8px] ${
                      selectedMonth === index ? 'bg-[#eae1ff] text-[#7636ff]' : 'text-[#19181d]'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year Selector */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsYearOpen(!isYearOpen);
                setIsMonthOpen(false);
              }}
              className="bg-white box-border flex gap-[8px] h-[38px] items-center p-[12px] rounded-[8px]"
            >
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                Year
              </p>
              <div className="flex gap-[8px] items-center">
                <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#1f1e30] leading-[16px]">
                  {selectedYear}
                </p>
                <ChevronDown className="w-[16px] h-[16px] text-[#1f1e30]" strokeWidth={2} />
              </div>
            </button>
            
            {isYearOpen && (
              <div className="absolute top-[42px] right-0 bg-white border border-[#e6e6ec] rounded-[8px] shadow-lg z-10 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedYear(year);
                      setIsYearOpen(false);
                    }}
                    className={`w-full text-left px-[12px] py-[8px] hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] leading-[16px] first:rounded-t-[8px] last:rounded-b-[8px] ${
                      selectedYear === year ? 'bg-[#eae1ff] text-[#7636ff]' : 'text-[#19181d]'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule View */}
      {isLoading ? (
        <div className="flex items-center justify-center py-[100px]">
          <div className="flex flex-col items-center gap-[16px]">
            <div className="w-[40px] h-[40px] border-4 border-[#e6e6ec] border-t-[#7636ff] rounded-full animate-spin" />
            <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
              Loading schedule...
            </p>
          </div>
        </div>
      ) : schedule ? (
        <MonthScheduleView
          schedule={schedule}
          employees={employees}
          roles={roles}
          year={selectedYear}
          month={selectedMonth}
          readOnly={true}
        />
      ) : (
        <div className="bg-white rounded-[8px] border border-[#e6e6ec] p-[48px] flex items-center justify-center">
          <div className="text-center">
            <p className="font-['Poppins:Medium',_sans-serif] text-[18px] tracking-[-0.36px] text-[#19181d] leading-[18px] mb-[8px]">
              No schedule available
            </p>
            <p className="font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#888796] leading-[14px]">
              No schedule has been generated for {months[selectedMonth]} {selectedYear}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
