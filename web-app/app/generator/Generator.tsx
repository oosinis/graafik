'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import type { Employee } from '@/models/Employee';
import type { Shift } from '@/models/Shift';
import { ScheduleService } from '@/services/scheduleService';
import type { ScheduleRequest } from '@/models/ScheduleRequest';
import type { ScheduleResponse } from '@/models/ScheduleResponse';

interface GeneratorProps {
  employees: Employee[];
  shifts: Shift[];
  roles: Array<{ name: string; color: string; backgroundColor: string }>;
  onUpdateEmployee: (employee: Employee) => void;
  accessToken?: string;
  onScheduleGenerated?: (
    scheduleResponse: ScheduleResponse,
    year: number,
    month: number
  ) => void;
  generatedSchedules?: { [key: string]: any };
}

export function Generator({
  employees,
  shifts,
  roles,
  onUpdateEmployee,
  accessToken,
  onScheduleGenerated,
  generatedSchedules = {},
}: GeneratorProps) {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [fullTimeHours, setFullTimeHours] = useState('170');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [assigningEmployeeId, setAssigningEmployeeId] = useState<string | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 2 + i
  );

  // Normalize assignedShifts into an array of shift IDs
  const toShiftIds = (assigned: Employee['assignedShifts']): string[] => {
    if (!assigned) return [];
    return assigned.map((s) => (typeof s === 'string' ? s : s.id));
  };

  const handleAssignShift = (employeeId: string, shiftId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    const currentShifts = toShiftIds(employee.assignedShifts);

    if (currentShifts.includes(shiftId)) return;

    const updatedEmployee: Employee = {
      ...employee,
      assignedShifts: [...currentShifts, shiftId], // ✅ always ID strings
    };

    onUpdateEmployee(updatedEmployee);
    setAssigningEmployeeId(null);
  };

  const handleRemoveShift = (employeeId: string, shiftId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    const updatedEmployee: Employee = {
      ...employee,
      assignedShifts: toShiftIds(employee.assignedShifts).filter(
        (id) => id !== shiftId
      ),
    };

    onUpdateEmployee(updatedEmployee);
  };

  const getShiftById = (shiftId: string) =>
    shifts.find((s) => s.id === shiftId);

  const handleRetrieveLastMonth = () => {
    // Future: Implement logic to retrieve data from last month
    alert('This feature will retrieve configuration from the previous month');
  };

  const handleGenerateSchedule = async () => {
    // Validation
    if (employees.length === 0 || shifts.length === 0) {
      alert('Please add employees and shifts before generating a schedule.');
      return;
    }

    // Check if employees have assigned shifts
    const employeesWithoutShifts = employees.filter((emp) => {
      const assignedShifts = toShiftIds(emp.assignedShifts);
      return assignedShifts.length === 0;
    });

    if (employeesWithoutShifts.length > 0) {
      const names = employeesWithoutShifts.map((e) => e.name).join(', ');
      alert(
        `The following employees have no assigned shifts: ${names}\n\nPlease assign shifts to all employees before generating a schedule.`
      );
      return;
    }

    // Check if shifts have rules
    const shiftsWithoutRules = shifts.filter((shift) => {
      return !shift.rules || shift.rules.length === 0;
    });

    if (shiftsWithoutRules.length > 0) {
      const names = shiftsWithoutRules.map((s) => s.name).join(', ');
      alert(
        `The following shifts have no rules configured: ${names}\n\nEvery shift must have at least one rule. Please configure shift rules before generating a schedule.`
      );
      return;
    }

    setIsGenerating(true);

    try {
      // Build ScheduleRequest payload
      const scheduleRequest: ScheduleRequest = {
        employees: employees,
        shifts: shifts,
        month: selectedMonth + 1, // Convert 0-11 to 1-12
        year: selectedYear,
        fullTimeMinutes: parseInt(fullTimeHours) * 60, // Convert hours to minutes
      };

      console.log('📤 Sending schedule generation request:', {
        employeesCount: employees.length,
        shiftsCount: shifts.length,
        month: selectedMonth + 1,
        monthName: months[selectedMonth],
        year: selectedYear,
        fullTimeMinutes: scheduleRequest.fullTimeMinutes,
      });

      // Call backend API
      const scheduleResponse = await ScheduleService.create(scheduleRequest);

      console.log('✅ Schedule generated successfully:', {
        month: scheduleResponse.month,
        year: scheduleResponse.year,
        score: scheduleResponse.score,
        daySchedulesCount: scheduleResponse.daySchedules?.length || 0,
      });

      // Call the callback to navigate
      if (onScheduleGenerated) {
        onScheduleGenerated(scheduleResponse, selectedYear, selectedMonth);
      }
    } catch (error: any) {
      console.error('❌ Error generating schedule:', error);
      const errorMessage = error.message || 'Failed to generate schedule';

      // Provide user-friendly error messages
      let userMessage = errorMessage;
      if (errorMessage.includes('Every shift must have at least one rule')) {
        userMessage =
          'Every shift must have at least one rule configured. Please add rules to all shifts before generating a schedule.';
      } else if (errorMessage.includes('No shifts provided')) {
        userMessage =
          'No shifts provided. Please add shifts before generating a schedule.';
      } else if (errorMessage.includes('No employees provided')) {
        userMessage =
          'No employees provided. Please add employees before generating a schedule.';
      } else if (errorMessage.includes('no valid schedule produced')) {
        userMessage =
          'Could not generate a valid schedule with the current configuration. Please check:\n- All employees have assigned shifts\n- All shifts have rules configured\n- Employee work loads and constraints are valid';
      }

      alert(
        `Failed to generate schedule: ${userMessage}\n\nPlease check your data and try again.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="py-[32px] w-full">
      {/* Header */}
      <div className="mb-[32px] pr-[24px]">
        <h1 className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-[#19181d] leading-[32px] capitalize">
          Schedule Generator
        </h1>
        <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[20px] mt-[8px]">
          Configure parameters and assign shifts to employees before generating
          the schedule
        </p>
      </div>

      {/* Month & Hours Section */}
      <div className="bg-white rounded-[8px] p-[24px] w-[930px] mb-[24px]">
        <div className="mb-[16px] flex items-center justify-between">
          <div>
            <p className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-[#19181d] leading-[24px] capitalize mb-[4px]">
              Month & Hours
            </p>
            <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
              Choose the year and month, add the full-time working hours of the
              month
            </p>
          </div>
          <button
            onClick={handleRetrieveLastMonth}
            className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#7636ff] leading-[14px] underline hover:text-[#6428e0] transition-colors"
          >
            Retrieve data from last month
          </button>
        </div>

        <div className="bg-[#f7f6fb] rounded-[8px] p-[24px] mt-[24px]">
          {/* Month Selection */}
          <div className="mb-[24px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] mb-[12px]">
              Select month
            </p>
            <div className="flex gap-[18px]">
              {/* Year Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsYearOpen(!isYearOpen)}
                  className="bg-white box-border content-stretch flex gap-[20px] h-[32px] items-center px-[16px] py-[12px] rounded-[8px] w-[108px] hover:bg-[#f7f6fb] transition-colors"
                >
                  <p className="font-['Poppins:Regular',_sans-serif] leading-[22px] text-[17px] text-black tracking-[-0.34px]">
                    {selectedYear}
                  </p>
                  <ChevronDown
                    className={`w-[16px] h-[16px] text-[#888796] transition-transform ${
                      isYearOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isYearOpen && (
                  <div className="absolute top-[36px] left-0 bg-white rounded-[8px] shadow-lg border border-[#e6e6ec] z-10 w-[108px]">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setIsYearOpen(false);
                        }}
                        className="w-full px-[16px] py-[8px] text-left hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[17px] text-black tracking-[-0.34px] first:rounded-t-[8px] last:rounded-b-[8px]"
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
                  onClick={() => setIsMonthOpen(!isMonthOpen)}
                  className="bg-white box-border content-stretch flex h-[32px] items-center justify-between px-[16px] py-[12px] rounded-[8px] w-[296px] hover:bg-[#f7f6fb] transition-colors"
                >
                  <p className="font-['Poppins:Regular',_sans-serif] leading-[22px] text-[17px] text-black tracking-[-0.34px]">
                    {months[selectedMonth]}
                  </p>
                  <ChevronDown
                    className={`w-[16px] h-[16px] text-[#888796] transition-transform ${
                      isMonthOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isMonthOpen && (
                  <div className="absolute top-[36px] left-0 bg-white rounded-[8px] shadow-lg border border-[#e6e6ec] z-10 w-[296px] max-h-[240px] overflow-y-auto">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => {
                          setSelectedMonth(index);
                          setIsMonthOpen(false);
                        }}
                        className="w-full px-[16px] py-[8px] text-left hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[17px] text-black tracking-[-0.34px] first:rounded-t-[8px] last:rounded-b-[8px]"
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full-time Hours */}
          <div>
            <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] mb-[12px]">
              Full-time monthly hours
            </p>
            <input
              type="number"
              value={fullTimeHours}
              onChange={(e) => setFullTimeHours(e.target.value)}
              className="bg-white h-[32px] px-[12px] py-[5px] rounded-[8px] font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] text-black leading-[22px] border-none outline-none w-[151px]"
            />
          </div>

          {/* Month Days Info */}
          {(() => {
            const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            const isLeapYear =
              (selectedYear % 4 === 0 && selectedYear % 100 !== 0) ||
              selectedYear % 400 === 0;
            if (selectedMonth === 1 && isLeapYear) monthDays[1] = 29;
            const expectedDays = monthDays[selectedMonth];

            return (
              <div className="mt-[16px] bg-[#e8f5e9] border border-[#4caf50] rounded-[8px] p-[12px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[13px] tracking-[-0.26px] text-[#2e7d32] leading-[16px]">
                  📅 {months[selectedMonth]} {selectedYear} has {expectedDays}{' '}
                  days
                  {selectedMonth === 1 && isLeapYear && ' (Leap Year)'}
                </p>
              </div>
            );
          })()}

          {/* Schedule Exists Warning */}
          {(() => {
            const key = `${selectedYear}-${selectedMonth + 1}`;
            const scheduleExists = generatedSchedules[key];
            if (scheduleExists) {
              return (
                <div className="mt-[8px] bg-[#fff3cd] border border-[#ffc107] rounded-[8px] p-[12px]">
                  <p className="font-['Poppins:Medium',_sans-serif] text-[13px] tracking-[-0.26px] text-[#856404] leading-[16px]">
                    ⚠️ A schedule already exists for {months[selectedMonth]}{' '}
                    {selectedYear}
                  </p>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#856404] leading-[14px] mt-[4px]">
                    Generating a new schedule will overwrite the existing one.
                  </p>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-[16px] mb-[24px]">
        <div className="bg-white rounded-[8px] p-[16px] border border-[#e6e6ec] min-w-[180px]">
          <p className="font-['Poppins:Regular',_sans-serif] text-[13px] tracking-[-0.26px] text-[#888796] leading-[13px] mb-[8px]">
            Total Employees
          </p>
          <p className="font-['Poppins:Medium',_sans-serif] text-[28px] tracking-[-0.56px] text-[#19181d] leading-[28px]">
            {employees.length}
          </p>
        </div>
        <div className="bg-white rounded-[8px] p-[16px] border border-[#e6e6ec] min-w-[180px]">
          <p className="font-['Poppins:Regular',_sans-serif] text-[13px] tracking-[-0.26px] text-[#888796] leading-[13px] mb-[8px]">
            Available Roles
          </p>
          <p className="font-['Poppins:Medium',_sans-serif] text-[28px] tracking-[-0.56px] text-[#19181d] leading-[28px]">
            {roles.length}
          </p>
        </div>
        <div className="bg-white rounded-[8px] p-[16px] border border-[#e6e6ec] min-w-[180px] mr-[24px]">
          <p className="font-['Poppins:Regular',_sans-serif] text-[13px] tracking-[-0.26px] text-[#888796] leading-[13px] mb-[8px]">
            Shift Types
          </p>
          <p className="font-['Poppins:Medium',_sans-serif] text-[28px] tracking-[-0.56px] text-[#19181d] leading-[28px]">
            {shifts.length}
          </p>
        </div>
      </div>

      {/* Assign Employees Section */}
      <div className="bg-white rounded-[8px] p-[24px] w-[930px] mb-[24px]">
        <div className="mb-[20px]">
          <p className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-[#19181d] leading-[24px] capitalize mb-[4px]">
            Assign Employees
          </p>
          <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
            Assign shift types to each employee. These assignments will be used
            during schedule generation.
          </p>
        </div>

        {employees.length === 0 ? (
          <div className="bg-[#f7f6fb] rounded-[8px] p-[32px] text-center">
            <p className="font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#888796] leading-[20px]">
              No employees found. Add employees to start assigning shifts.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="bg-[#f7f6fb] rounded-[8px] p-[16px]"
              >
                <div className="flex items-center justify-between mb-[12px]">
                  <div className="flex items-center gap-[12px]">
                    <div
                      className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: employee.roleColor }}
                    >
                      <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] leading-[14px]">
                        {employee.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
                        {employee.name}
                      </p>
                      <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[12px]">
                        {employee.role?.name || 'No role'} • FTE{' '}
                        {employee.workLoad || 0}
                      </p>
                    </div>
                  </div>
                  {assigningEmployeeId !== employee.id && (
                    <button
                      onClick={() => setAssigningEmployeeId(employee.id)}
                      className="bg-[#7636ff] flex gap-[6px] h-[28px] items-center justify-center px-[12px] py-[6px] rounded-[6px] hover:bg-[#6428e0] transition-colors"
                    >
                      <Plus
                        className="w-[14px] h-[14px] text-white"
                        strokeWidth={2}
                      />
                      <p className="font-['Poppins:Medium',_sans-serif] text-[13px] tracking-[-0.26px] text-white leading-[13px]">
                        Assign Shift
                      </p>
                    </button>
                  )}
                </div>

                {/* Assigned Shifts */}
                <div className="flex flex-wrap gap-[8px] mb-[8px]">
                  {toShiftIds(employee.assignedShifts).map((shiftId) => {
                    const shift = getShiftById(shiftId);
                    if (!shift) return null;

                    return (
                      <div
                        key={shiftId}
                        className="bg-white rounded-[6px] px-[10px] py-[6px] flex items-center gap-[6px] border border-[#e6e6ec]"
                      >
                        <p className="font-['Poppins:Regular',_sans-serif] text-[13px] tracking-[-0.26px] text-[#19181d] leading-[13px]">
                          {shift.name}
                        </p>
                        <button
                          onClick={() =>
                            handleRemoveShift(employee.id, shiftId)
                          }
                          className="hover:bg-[#fef2f4] rounded-[3px] p-[2px] transition-colors"
                        >
                          <X
                            className="w-[12px] h-[12px] text-[#d4183d]"
                            strokeWidth={2}
                          />
                        </button>
                      </div>
                    );
                  })}
                  {(!employee.assignedShifts ||
                    employee.assignedShifts.length === 0) &&
                    assigningEmployeeId !== employee.id && (
                      <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[12px] italic">
                        No shifts assigned
                      </p>
                    )}
                </div>

                {/* Shift Selection */}
                {assigningEmployeeId === employee.id && (
                  <div className="bg-white rounded-[6px] p-[12px] border border-[#7636ff]">
                    <p className="font-['Poppins:Medium',_sans-serif] text-[13px] tracking-[-0.26px] text-[#19181d] leading-[13px] mb-[8px]">
                      Select shift to assign:
                    </p>
                    <div className="flex flex-wrap gap-[6px] mb-[8px]">
                      {shifts.map((shift) => (
                        <button
                          key={shift.id}
                          onClick={() =>
                            handleAssignShift(employee.id, shift.id)
                          }
                          disabled={toShiftIds(
                            employee.assignedShifts
                          ).includes(shift.id)}
                          className={`px-[10px] py-[6px] rounded-[6px] font-['Poppins:Regular',_sans-serif] text-[13px] tracking-[-0.26px] leading-[13px] transition-colors ${
                            toShiftIds(employee.assignedShifts).includes(
                              shift.id
                            )
                              ? 'bg-[#e6e6ec] text-[#888796] cursor-not-allowed'
                              : 'bg-[#7636ff] text-white hover:bg-[#6428e0] cursor-pointer'
                          }`}
                        >
                          {shift.name}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setAssigningEmployeeId(null)}
                      className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[12px] hover:text-[#19181d] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="pr-[24px]">
        <button
          onClick={handleGenerateSchedule}
          disabled={
            employees.length === 0 || shifts.length === 0 || isGenerating
          }
          className="bg-[#7636ff] h-[48px] px-[32px] py-[16px] rounded-[8px] font-['Poppins:Medium',_sans-serif] text-[18px] tracking-[-0.36px] text-white leading-[18px] hover:bg-[#6428e0] transition-colors disabled:bg-[#e6e6ec] disabled:text-[#888796] disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating & Saving...' : 'Generate Schedule'}
        </button>
        {isGenerating && (
          <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#7636ff] leading-[12px] mt-[8px]">
            Please wait... Creating schedule and saving to database
          </p>
        )}
        {!isGenerating && (employees.length === 0 || shifts.length === 0) && (
          <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[12px] mt-[8px]">
            Add employees and shifts before generating the schedule
          </p>
        )}
      </div>
    </div>
  );
}

export default Generator;
