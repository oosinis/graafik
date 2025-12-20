// app/schedule/page.tsx
"use client"

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LayoutGrid, Calendar, ChevronDown } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { EmployeeService } from "@/services/employeeService";
import { RoleService } from "@/services/roleService";
import type { Employee } from "@/models/Employee";
import type { Role } from "@/services/roleService";
import type { GeneratedSchedule } from "@/models/Schedule";

// Dynamically import MonthScheduleView to avoid SSR issues with react-dnd
const MonthScheduleView = dynamic(() => import("./MonthScheduleView").then(mod => ({ default: mod.MonthScheduleView })), {
  ssr: false
});

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Wrapper component to provide Suspense boundary for useSearchParams
export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="text-center py-8"><p className="text-gray-500 text-lg">Loading...</p></div>}>
      <SchedulePageContent />
    </Suspense>
  );
}

function SchedulePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = new Date();

  // Get month/year from URL params or use current date
  const urlMonth = searchParams.get('month');
  const urlYear = searchParams.get('year');

  const [selectedMonth, setSelectedMonth] = useState(
    urlMonth ? parseInt(urlMonth, 10) : currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(
    urlYear ? parseInt(urlYear, 10) : currentDate.getFullYear()
  );
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [schedule, setSchedule] = useState<GeneratedSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate years array (current year ± 2 years)
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  // Update month/year when URL params change
  useEffect(() => {
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    if (month) setSelectedMonth(parseInt(month, 10));
    if (year) setSelectedYear(parseInt(year, 10));
  }, [searchParams]);

  // Close dropdowns when clicking outside
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

        // Fetch employees, roles, and schedule in parallel
        const [employeesData, rolesData, scheduleRes] = await Promise.all([
          EmployeeService.getAll(),
          RoleService.getAll(),
          fetch(`${apiUrl}/schedules/latest?month=${selectedMonth}&year=${selectedYear}`)
        ]);

        setEmployees(employeesData);
        setRoles(rolesData);

        if (scheduleRes.status === 404) {
          // No schedule found for this month/year - this is normal
          setSchedule(null);
        } else if (scheduleRes.ok) {
          try {
            const contentType = scheduleRes.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const scheduleData: GeneratedSchedule = await scheduleRes.json();
              // Validate that we got valid schedule data
              if (scheduleData && scheduleData.startDate && scheduleData.endDate) {
                setSchedule(scheduleData);
              } else {
                console.error("Invalid schedule data received:", scheduleData);
                setSchedule(null);
              }
            } else {
              console.error("Unexpected content type:", contentType);
              setSchedule(null);
            }
          } catch (parseError) {
            console.error("Failed to parse schedule data:", parseError);
            setSchedule(null);
          }
        } else {
          // Handle other error statuses
          const errorText = await scheduleRes.text().catch(() => 'Unknown error');
          console.error("Failed to fetch schedule:", scheduleRes.status, errorText);
          setSchedule(null);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedMonth, selectedYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setIsYearOpen(false);
    router.push(`/schedule?year=${year}&month=${selectedMonth}`);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    setIsMonthOpen(false);
    router.push(`/schedule?year=${selectedYear}&month=${month}`);
  };

  const handleScheduleUpdate = (updatedSchedule: GeneratedSchedule) => {
    setSchedule(updatedSchedule);
  };

  return (
    <RoleGuard allowedRoles={['Admin', 'Manager']}>
      <div className="max-w-full mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-[#19181d] leading-[32px]">
            Schedule
          </h1>

          <div className="flex items-center gap-[6px]">
            {/* Week/Month View Toggle */}
            <div className="bg-white h-[28px] rounded-[6px] border border-[#e6e6ec] flex items-center overflow-hidden">
              <button
                onClick={() => setViewMode('week')}
                className={`h-full px-[8px] flex items-center gap-[4px] transition-colors ${viewMode === 'week'
                    ? 'bg-[#7636ff] text-white'
                    : 'bg-white text-[#888796] hover:bg-[#f7f6fb]'
                  }`}
              >
                <LayoutGrid className="w-[12px] h-[12px]" strokeWidth={2} />
                <span className="font-['Poppins:Medium',_sans-serif] text-[12px] tracking-[-0.24px] leading-[12px]">
                  Week
                </span>
              </button>
              <div className="w-[1px] h-[16px] bg-[#e6e6ec]"></div>
              <button
                onClick={() => setViewMode('month')}
                disabled={true}
                className={`h-full px-[8px] flex items-center gap-[4px] transition-colors ${viewMode === 'month'
                    ? 'bg-[#7636ff] text-white'
                    : 'bg-white text-[#888796] hover:bg-[#f7f6fb]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Calendar className="w-[12px] h-[12px]" strokeWidth={2} />
                <span className="font-['Poppins:Medium',_sans-serif] text-[12px] tracking-[-0.24px] leading-[12px]">
                  Month
                </span>
              </button>
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsYearOpen(!isYearOpen);
                  setIsMonthOpen(false);
                }}
                className="bg-white h-[28px] px-[8px] rounded-[6px] border border-[#e6e6ec] flex items-center gap-[4px] hover:border-[#7636ff] transition-colors min-w-[75px]"
              >
                <span className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#19181d] leading-[12px]">
                  {selectedYear}
                </span>
                <ChevronDown className="w-[12px] h-[12px] text-[#888796]" strokeWidth={2} />
              </button>

              {isYearOpen && (
                <div
                  className="absolute top-[32px] right-0 bg-white border border-[#e6e6ec] rounded-[6px] shadow-lg z-50 min-w-[75px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleYearChange(year);
                      }}
                      className={`w-full text-left px-[8px] py-[6px] hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] leading-[12px] first:rounded-t-[6px] last:rounded-b-[6px] ${selectedYear === year ? 'bg-[#eae1ff] text-[#7636ff]' : 'text-[#19181d]'
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Month Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMonthOpen(!isMonthOpen);
                  setIsYearOpen(false);
                }}
                className="bg-white h-[28px] px-[8px] rounded-[6px] border border-[#e6e6ec] flex items-center gap-[4px] hover:border-[#7636ff] transition-colors min-w-[100px]"
              >
                <span className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#19181d] leading-[12px]">
                  {monthNames[selectedMonth - 1]}
                </span>
                <ChevronDown className="w-[12px] h-[12px] text-[#888796]" strokeWidth={2} />
              </button>

              {isMonthOpen && (
                <div
                  className="absolute top-[32px] right-0 bg-white border border-[#e6e6ec] rounded-[6px] shadow-lg z-50 min-w-[100px] max-h-[300px] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {monthNames.map((month, index) => (
                    <button
                      key={month}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMonthChange(index + 1);
                      }}
                      className={`w-full text-left px-[8px] py-[6px] hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] leading-[12px] first:rounded-t-[6px] last:rounded-b-[6px] ${selectedMonth === index + 1 ? 'bg-[#eae1ff] text-[#7636ff]' : 'text-[#19181d]'
                        }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Loading schedule…</p>
          </div>
        ) : (
          <MonthScheduleView
            schedule={schedule}
            employees={employees}
            roles={roles}
            year={selectedYear}
            month={selectedMonth}
            onScheduleUpdate={handleScheduleUpdate}
          />
        )}
      </div>
    </RoleGuard>
  );
}