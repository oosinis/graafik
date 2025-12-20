import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditShiftAssignmentDialog } from './EditShiftAssignmentDialog';
import type { ScheduleAssignment, GeneratedSchedule } from '@/models/Schedule';

interface MonthScheduleViewProps {
  schedule: GeneratedSchedule | null;
  employees: any[];
  roles: any[];
  onScheduleUpdate?: (schedule: GeneratedSchedule) => void;
  year?: number;
  month?: number;
}

export function MonthScheduleView({ schedule, employees, roles, onScheduleUpdate, year, month }: MonthScheduleViewProps) {
  const [selectedRole, setSelectedRole] = React.useState<string>('All');
  const [selectedShiftType, setSelectedShiftType] = React.useState<string>('All');
  const [currentWeekStart, setCurrentWeekStart] = React.useState(0);
  const [collapsedRoles, setCollapsedRoles] = React.useState<{ [key: string]: boolean }>({});
  const [editingAssignment, setEditingAssignment] = React.useState<ScheduleAssignment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  if (!schedule) {
    return (
      <div className="bg-white relative rounded-[15px] w-[1158px] flex items-center justify-center" style={{ height: 'calc(100vh - 280px)' }}>
        <div aria-hidden="true" className="absolute border border-[#e6e6ec] border-solid inset-0 pointer-events-none rounded-[15px]" />
        <div className="text-center relative z-10">
          <p className="font-['Poppins:Medium',_sans-serif] text-[20px] tracking-[-0.4px] text-[#19181d] leading-[20px] mb-[8px]">
            No Schedule Generated
          </p>
          <p className="font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#888796] leading-[14px]">
            Click "Generate Schedule" to create a new schedule
          </p>
        </div>
      </div>
    );
  }

  // Parse dates and normalize to avoid timezone issues
  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);

  // Normalize to midnight local time
  const normalizedStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const normalizedEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  // Get days in the date range, starting from the Monday of the first week
  const days: Date[] = [];

  // Find the Monday of the week containing the first day of the month
  const firstDayOfMonth = new Date(normalizedStart);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysFromMonday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1; // Convert to days from Monday

  const startFromMonday = new Date(firstDayOfMonth);
  startFromMonday.setDate(firstDayOfMonth.getDate() - daysFromMonday);

  // Find the Sunday after the last day of the month (to complete the last week)
  const lastDayOfMonth = new Date(normalizedEnd);
  const lastDayWeekday = lastDayOfMonth.getDay();
  const daysToSunday = lastDayWeekday === 0 ? 0 : 7 - lastDayWeekday;

  const endOnSunday = new Date(lastDayOfMonth);
  endOnSunday.setDate(lastDayOfMonth.getDate() + daysToSunday);

  // Generate all days from Monday to Sunday (complete weeks)
  const current = new Date(startFromMonday);

  while (current <= endOnSunday) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Debug logging
  React.useEffect(() => {
    const expectedDaysInMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
    const expectedCompleteWeeks = Math.ceil(expectedDaysInMonth / 7) * 7; // Days needed for complete weeks
    const numberOfWeeks = days.length / 7;

    console.log(`📊 MonthScheduleView rendering:`);
    console.log(`   Schedule startDate: ${schedule.startDate}`);
    console.log(`   Schedule endDate: ${schedule.endDate}`);
    console.log(`   Total days to display: ${days.length} (${numberOfWeeks} complete weeks)`);
    console.log(`   Days in month: ${expectedDaysInMonth}`);
    console.log(`   Days array: ${days.length > 0 ? days[0].toISOString().split('T')[0] : 'empty'} to ${days.length > 0 ? days[days.length - 1].toISOString().split('T')[0] : 'empty'}`);

    // Validate that we have complete weeks (should be multiple of 7)
    if (days.length % 7 !== 0) {
      console.error(`❌ ERROR: Displaying ${days.length} days, which is not a complete set of weeks!`);
    } else {
      console.log(`✅ Displaying ${numberOfWeeks} complete weeks (Monday-Sunday) as expected`);
    }
  }, [schedule.startDate, schedule.endDate]);

  // Get current week (7 days starting from currentWeekStart)
  const weekDays = days.slice(currentWeekStart, currentWeekStart + 7);

  // Group employees by role
  const employeesByRole: { [key: string]: any[] } = {};
  employees.forEach(emp => {
    const roleName = emp.role?.name || 'Unassigned';
    if (!employeesByRole[roleName]) {
      employeesByRole[roleName] = [];
    }
    employeesByRole[roleName].push(emp);
  });

  // Filter by selected role
  const filteredRoles = selectedRole === 'All'
    ? Object.keys(employeesByRole)
    : [selectedRole];

  // Get unique shift types from schedule assignments
  const shiftTypes: string[] = React.useMemo(() => {
    if (!schedule || !schedule.assignments) return [];
    const uniqueShiftTypes = new Set<string>();
    schedule.assignments.forEach(assignment => {
      if (assignment.shiftName) {
        uniqueShiftTypes.add(assignment.shiftName);
      }
    });
    return Array.from(uniqueShiftTypes).sort();
  }, [schedule]);

  const formatDate = (date: Date) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert Sunday=0 to Sunday=6, Monday=1 to Monday=0, etc.
    return `${date.getDate()} ${days[dayIndex]}`;
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getAssignmentForEmployeeAndDate = (employeeId: string, date: Date) => {
    const dateKey = formatDateKey(date);
    const assignment = schedule.assignments.find(
      a => a.employeeId === employeeId && a.date === dateKey
    );

    // Filter by shift type if not "All"
    if (assignment && selectedShiftType !== 'All') {
      if (assignment.shiftName !== selectedShiftType) {
        return undefined;
      }
    }

    return assignment;
  };

  const goToPreviousWeek = () => {
    if (currentWeekStart > 0) {
      setCurrentWeekStart(Math.max(0, currentWeekStart - 7));
    }
  };

  const goToNextWeek = () => {
    if (currentWeekStart + 7 < days.length) {
      setCurrentWeekStart(Math.min(days.length - 7, currentWeekStart + 7));
    }
  };

  const toggleRoleCollapse = (roleName: string) => {
    setCollapsedRoles(prev => ({
      ...prev,
      [roleName]: !prev[roleName]
    }));
  };

  // Calculate hours for an employee
  const calculateEmployeeHours = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return { assigned: 0, expected: 0 };

    // Calculate expected hours based on FTE (assuming 170 hours per month for 1.0 FTE)
    const fte = parseFloat(employee.fte || '1.0');
    const expectedHours = Math.round(170 * fte);

    // Calculate assigned hours from schedule
    const employeeAssignments = schedule.assignments.filter(
      a => a.employeeId === employeeId && !a.isDayOff
    );

    const assignedHours = employeeAssignments.reduce((total, assignment) => {
      // Parse time strings (HH:MM format)
      const [startHour, startMin] = assignment.startTime.split(':').map(Number);
      const [endHour, endMin] = assignment.endTime.split(':').map(Number);

      // Calculate duration in hours
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const durationHours = (endMinutes - startMinutes) / 60;

      return total + durationHours;
    }, 0);

    return { assigned: Math.round(assignedHours), expected: expectedHours };
  };

  // Drag and drop handlers
  const handleDropShift = (draggedAssignment: ScheduleAssignment, targetEmployeeId: string, targetDate: Date) => {
    if (!schedule || !onScheduleUpdate) return;

    const targetDateKey = formatDateKey(targetDate);

    // Remove the old assignment
    const updatedAssignments = schedule.assignments.filter(
      a => !(a.employeeId === draggedAssignment.employeeId && a.date === draggedAssignment.date)
    );

    // Check if target slot already has an assignment
    const existingAssignment = updatedAssignments.find(
      a => a.employeeId === targetEmployeeId && a.date === targetDateKey
    );

    if (existingAssignment) {
      alert('This employee already has a shift on this day. Please remove it first.');
      return;
    }

    // Add the new assignment at the target location
    const targetEmployee = employees.find(e => e.id === targetEmployeeId);
    const newAssignment: ScheduleAssignment = {
      ...draggedAssignment,
      employeeId: targetEmployeeId,
      employeeName: targetEmployee?.name || draggedAssignment.employeeName,
      date: targetDateKey
    };

    updatedAssignments.push(newAssignment);

    const updatedSchedule = {
      ...schedule,
      assignments: updatedAssignments
    };

    onScheduleUpdate(updatedSchedule);
  };

  const handleEditAssignment = (assignment: ScheduleAssignment) => {
    setEditingAssignment(assignment);
    setIsEditDialogOpen(true);
  };

  const handleSaveAssignment = (updatedAssignment: ScheduleAssignment) => {
    if (!schedule || !onScheduleUpdate) return;

    const updatedAssignments = schedule.assignments.map(a =>
      a.employeeId === editingAssignment?.employeeId &&
        a.date === editingAssignment?.date &&
        a.shiftId === editingAssignment?.shiftId
        ? updatedAssignment
        : a
    );

    const updatedSchedule = {
      ...schedule,
      assignments: updatedAssignments
    };

    onScheduleUpdate(updatedSchedule);
  };

  const handleDeleteAssignment = () => {
    if (!schedule || !onScheduleUpdate || !editingAssignment) return;

    const updatedAssignments = schedule.assignments.filter(
      a => !(a.employeeId === editingAssignment.employeeId &&
        a.date === editingAssignment.date &&
        a.shiftId === editingAssignment.shiftId)
    );

    const updatedSchedule = {
      ...schedule,
      assignments: updatedAssignments
    };

    onScheduleUpdate(updatedSchedule);
  };

  // Draggable Shift Component
  const DraggableShift = ({ assignment }: { assignment: ScheduleAssignment }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'shift',
      item: assignment,
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }), [assignment]);

    return (
      <div
        ref={drag as unknown as React.Ref<HTMLDivElement>}
        onClick={(e) => {
          e.stopPropagation();
          handleEditAssignment(assignment);
        }}
        className="h-[37px] rounded-[5px] px-[8px] flex flex-col justify-center border relative overflow-hidden cursor-move hover:shadow-lg transition-shadow"
        style={{
          backgroundColor: assignment.shiftBg,
          borderColor: assignment.shiftColor + '4D',
          width: '132px',
          opacity: isDragging ? 0.5 : 1
        }}
      >
        {/* Diagonal line pattern for "Busy" shifts */}
        {assignment.isDayOff && assignment.shiftName.toLowerCase() === 'busy' && (
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 4px,
              ${assignment.shiftColor} 4px,
              ${assignment.shiftColor} 5px
            )`
          }} />
        )}
        <p
          className="font-['Poppins:Regular',_sans-serif] text-[8px] tracking-[-0.16px] leading-[10px] uppercase relative z-[1]"
          style={{ color: assignment.shiftColor, opacity: 0.6 }}
        >
          {assignment.isDayOff ? 'WHOLE DAY' : `${assignment.startTime} - ${assignment.endTime}`}
        </p>
        <p
          className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] leading-[10px] relative z-[1]"
          style={{ color: assignment.shiftColor }}
        >
          {assignment.shiftName}
        </p>
      </div>
    );
  };

  // Droppable Cell Component
  const DroppableCell = ({ employeeId, day, assignment }: { employeeId: string; day: Date; assignment?: ScheduleAssignment }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'shift',
      drop: (item: ScheduleAssignment) => handleDropShift(item, employeeId, day),
      collect: (monitor) => ({
        isOver: monitor.isOver()
      })
    }), [employeeId, day]);

    const isCurrentMonth = day.getMonth() === normalizedStart.getMonth() && day.getFullYear() === normalizedStart.getFullYear();

    return (
      <div
        ref={drop as unknown as React.Ref<HTMLDivElement>}
        className="flex-1 h-full flex items-center justify-center p-[2.5px] border-r border-[#e6e6ec] last:border-r-0 transition-colors"
        style={{
          backgroundColor: isOver
            ? 'rgba(118, 54, 255, 0.1)'
            : !isCurrentMonth
              ? 'rgba(230, 230, 236, 0.3)'
              : 'transparent'
        }}
      >
        {assignment && <DraggableShift assignment={assignment} />}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-[16px]">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[20px] tracking-[-0.4px] text-[#19181d] leading-[16px]">
                  {weekDays[0] && `${weekDays[0].getDate()}. - ${weekDays[weekDays.length - 1]?.getDate()}.${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][startDate.getMonth()].toLowerCase()}`}
                </p>
                <p className="font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#888796] leading-[14px]">
                  (Week {Math.floor(currentWeekStart / 7) + 1} of {Math.ceil(days.length / 7)} • {days.length} days total)
                </p>
              </div>
              <div className="flex gap-[0px]">
                <button
                  onClick={goToPreviousWeek}
                  disabled={currentWeekStart === 0}
                  className="w-[28px] h-[9px] flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-30"
                >
                  <ChevronLeft className="w-[16px] h-[16px] text-[#888796]" strokeWidth={1.5} />
                </button>
                <button
                  onClick={goToNextWeek}
                  disabled={currentWeekStart + 7 >= days.length}
                  className="w-[28px] h-[9px] flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-30"
                >
                  <ChevronRight className="w-[16px] h-[16px] text-[#888796]" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[8px]">
            {/* Role Filter */}
            <div className="bg-white rounded-[8px] h-[38px] px-[12px] flex items-center gap-[8px]">
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                Role
              </p>
              <div className="flex items-center gap-[8px] bg-[#eae1ff] px-[8px] py-[4px] rounded-[6px] relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#7636ff] leading-[16px] bg-transparent border-none outline-none cursor-pointer appearance-none pr-[20px]"
                >
                  <option value="All">All</option>
                  {roles.map(role => (
                    <option key={role.name} value={role.name}>{role.name}</option>
                  ))}
                </select>
                <div className="absolute right-[8px] pointer-events-none">
                  <ChevronDown className="w-[16px] h-[16px] text-[#7636ff]" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Shift Type Filter */}
            <div className="bg-white rounded-[8px] h-[38px] px-[12px] flex items-center gap-[8px]">
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                Shift type
              </p>
              <div className="flex items-center gap-[8px] bg-[#eae1ff] px-[8px] py-[4px] rounded-[6px] relative">
                <select
                  value={selectedShiftType}
                  onChange={(e) => setSelectedShiftType(e.target.value)}
                  className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#7636ff] leading-[16px] bg-transparent border-none outline-none cursor-pointer appearance-none pr-[20px]"
                >
                  <option value="All">All</option>
                  {shiftTypes.map((shiftType: string) => (
                    <option key={shiftType} value={shiftType}>{shiftType}</option>
                  ))}
                </select>
                <div className="absolute right-[8px] pointer-events-none">
                  <ChevronDown className="w-[16px] h-[16px] text-[#7636ff]" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white relative rounded-[15px] overflow-hidden" style={{ width: '1158px', height: 'calc(100vh - 280px)' }}>
          <div aria-hidden="true" className="absolute border border-[#e6e6ec] border-solid inset-0 pointer-events-none rounded-[15px]" />
          <div className="relative h-full">
            {/* Header Row with Number Column */}
            <div className="absolute top-0 left-0 right-0 h-[40px] bg-[#7636ff] flex items-center z-10 rounded-t-[15px]">
              {/* Nr Column */}
              <div className="w-[40px] flex items-center justify-center border-r border-[#9c7aff]">
                <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-white leading-[16px] text-center">
                  Nr
                </p>
              </div>
              {/* Name Column */}
              <div className="w-[159px] flex items-center px-[16px] border-r border-[#9c7aff]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[15px] tracking-[-0.3px] text-white leading-[16px]">
                  Name
                </p>
              </div>
              {/* Day Columns */}
              {weekDays.map((day, idx) => {
                const isCurrentMonth = day.getMonth() === normalizedStart.getMonth() && day.getFullYear() === normalizedStart.getFullYear();
                return (
                  <div key={idx} className="flex-1 flex items-center justify-center border-r border-[#9c7aff] last:border-r-0">
                    <p
                      className="font-['Poppins:Medium',_sans-serif] text-[13px] tracking-[-0.26px] text-white leading-[16px]"
                      style={{ opacity: isCurrentMonth ? 1 : 0.5 }}
                    >
                      {formatDate(day)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Scrollable Content */}
            <div className="absolute top-[40px] left-0 right-0 bottom-0 overflow-y-auto">
              {filteredRoles.map((roleName, roleIdx) => {
                const roleInfo = roles.find(r => r.name === roleName);
                let roleEmployees = employeesByRole[roleName] || [];

                // Filter employees by shift type if a shift type is selected
                if (selectedShiftType !== 'All') {
                  roleEmployees = roleEmployees.filter(emp => {
                    // Check if employee has at least one assignment with the selected shift type
                    return schedule.assignments.some(
                      assignment => assignment.employeeId === emp.id &&
                        assignment.shiftName === selectedShiftType
                    );
                  });
                }

                // Skip rendering this role if no employees match the filters
                if (roleEmployees.length === 0) {
                  return null;
                }

                const isCollapsed = collapsedRoles[roleName];

                return (
                  <div key={roleIdx}>
                    {/* Role Header */}
                    <div
                      className="h-[40px] flex items-center sticky top-0 z-[5] cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: roleInfo?.backgroundColor || '#eae1ff' }}
                      onClick={() => toggleRoleCollapse(roleName)}
                    >
                      <div className="w-[40px] flex items-center justify-center border-r border-[#e6e6ec]">
                        <ChevronDown
                          className={`w-[16px] h-[16px] transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                          style={{ color: roleInfo?.color || '#7636ff' }}
                          strokeWidth={2}
                        />
                      </div>
                      <div className="w-[159px] flex items-center px-[16px] border-r border-[#e6e6ec]">
                        <p
                          className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] leading-[16px] uppercase"
                          style={{ color: roleInfo?.color || '#7636ff' }}
                        >
                          {roleName}
                        </p>
                      </div>
                      {/* Day column separators for role header */}
                      {weekDays.map((_, dayIdx) => (
                        <div key={dayIdx} className="flex-1 border-r border-[#e6e6ec] last:border-r-0 h-full" />
                      ))}
                    </div>

                    {/* Employees */}
                    {!isCollapsed && roleEmployees.map((emp, empIdx) => (
                      <div
                        key={emp.id}
                        className="h-[42px] flex items-center border-t border-[#e6e6ec]"
                      >
                        {/* Number Column */}
                        <div className="w-[40px] flex items-center justify-center border-r border-[#e6e6ec]">
                          <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[16px] text-center">
                            {empIdx + 1}
                          </p>
                        </div>
                        {/* Name Column */}
                        <div className="w-[159px] flex flex-col justify-center px-[16px] bg-[rgba(247,246,251,0)] border-r border-[#e6e6ec] gap-[2px]">
                          <p className="font-['Poppins:Medium',_sans-serif] text-[15px] tracking-[-0.3px] text-[#19181d] leading-[16px]">
                            {emp.name}
                          </p>
                          <p className="font-['Poppins:Regular',_sans-serif] text-[11px] tracking-[-0.22px] text-[#888796] leading-[11px]">
                            {(() => {
                              const hours = calculateEmployeeHours(emp.id);
                              return `${hours.assigned}/${hours.expected}h`;
                            })()}
                          </p>
                        </div>
                        {/* Day Columns */}
                        {weekDays.map((day, dayIdx) => {
                          const assignment = getAssignmentForEmployeeAndDate(emp.id, day);

                          return (
                            <DroppableCell
                              key={dayIdx}
                              employeeId={emp.id}
                              day={day}
                              assignment={assignment}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        {editingAssignment && (
          <EditShiftAssignmentDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingAssignment(null);
            }}
            onSave={handleSaveAssignment}
            onDelete={handleDeleteAssignment}
            assignment={editingAssignment}
            employees={employees}
          />
        )}
      </div>
    </DndProvider>
  );
}
