import React from 'react';
import { Search, ChevronDown, Plus, MoreHorizontal, Edit2, Trash2, Calendar, Info } from 'lucide-react';
import { AvailabilityData, AvailabilityDialog } from './AvailabilityDialog';
import type { Shift } from '@/models/Shift';
import type { Employee } from '@/models/Employee';
import type { Role } from '@/models/Role';

interface EmployeesProps {
  onAddEmployee?: () => void;
  onEditEmployee?: (employee: Employee) => void;
  onDeleteEmployee?: (employeeId: string) => void;
  onUpdateAvailability?: (employeeId: string, availability: AvailabilityData) => void;
  employees?: Employee[];
  shifts?: Shift[];
  roles?: Role[];
  isLoading?: boolean;
}

export function Employees({ onAddEmployee, onEditEmployee, onDeleteEmployee, onUpdateAvailability, employees = [], shifts = [], roles = [], isLoading = false }: EmployeesProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<string>('All');
  const [selectedFTE, setSelectedFTE] = React.useState<string>('All');
  const [isRoleOpen, setIsRoleOpen] = React.useState(false);
  const [isFTEOpen, setIsFTEOpen] = React.useState(false);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);

  const getShiftById = (shiftId: string) => shifts.find(s => s.id === shiftId);

  const roleNames = ['All', ...roles.map(r => r.name)];
  const fteOptions = ['All', '1.0', '0.75', '0.5'];

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsRoleOpen(false);
      setIsFTEOpen(false);
      setOpenMenuId(null);
    };

    if (isRoleOpen || isFTEOpen || openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isRoleOpen, isFTEOpen, openMenuId]);

  const toShiftIds = (assigned: Employee["assignedShifts"]): string[] => {
    if (!assigned) return [];
    return assigned.map(s => (typeof s === "string" ? s : s.id));
  };


  const handleEdit = (employee: Employee) => {
    setOpenMenuId(null);
    onEditEmployee?.(employee);
  };

  const handleDelete = (employeeId: string) => {
    setOpenMenuId(null);
    onDeleteEmployee?.(employeeId);
  };

  const handleAvailability = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenMenuId(null);
    setIsAvailabilityDialogOpen(true);
  };

  const handleSaveAvailability = (availability: AvailabilityData) => {
    if (selectedEmployee) {
      onUpdateAvailability?.(selectedEmployee.id, availability);
    }
    setIsAvailabilityDialogOpen(false);
    setSelectedEmployee(null);
  };

  // Filter employees based on search, role, and FTE
  const filteredEmployees = React.useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = searchQuery === '' ||
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'All' || employee.role?.name === selectedRole;
      const matchesFTE = selectedFTE === 'All' || (employee.workLoad?.toString() || '') === selectedFTE;
      return matchesSearch && matchesRole && matchesFTE;
    });
  }, [employees, searchQuery, selectedRole, selectedFTE]);

  return (
    <div className="py-[32px] w-full">
      {/* Header */}
      <div className="mb-[11px] flex items-center justify-between pr-[24px]">
        <h1 className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-[#19181d] leading-[32px] capitalize">
          Employees
        </h1>
        <button
          onClick={onAddEmployee}
          className="bg-[#7636ff] box-border content-stretch flex gap-[8px] h-[38px] items-center justify-center px-[24px] py-[12px] rounded-[8px] cursor-pointer hover:bg-[#6428e0] transition-colors"
        >
          <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-white leading-[16px]">
            Add Employee
          </p>
          <Plus className="w-[24px] h-[24px] text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Filters Bar */}
      <div className="mb-[24px] flex items-center">
        {/* Search */}
        <div className="bg-white box-border content-stretch flex gap-[9px] h-[38px] items-center px-[18px] py-[9px] rounded-[8px] w-[259px]">
          <Search className="w-[16px] h-[14.476px] text-[#888796]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] text-[#19181d] placeholder:text-[#888796] leading-[22px] bg-transparent border-none outline-none flex-1"
          />
        </div>

        {/* Spacer */}
        <div className="w-[671px]" />

        {/* Filters */}
        <div className="flex gap-[8px] pl-[24px] pr-[24px]">
          {/* Role Filter */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRoleOpen(!isRoleOpen);
                setIsFTEOpen(false);
              }}
              className="bg-white box-border flex gap-[8px] h-[38px] items-center p-[12px] rounded-[8px]"
            >
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                Role
              </p>
              <div className="flex gap-[8px] items-center">
                <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#1f1e30] leading-[16px]">
                  {selectedRole}
                </p>
                <ChevronDown className="w-[16px] h-[16px] text-[#1f1e30]" strokeWidth={2} />
              </div>
            </button>

            {isRoleOpen && (
              <div className="absolute top-[42px] left-0 bg-white border border-[#e6e6ec] rounded-[8px] shadow-lg z-10 min-w-[160px]" onClick={(e) => e.stopPropagation()}>
                {roleNames.map((role) => (
                  <button
                    key={role}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRole(role);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left px-[12px] py-[8px] hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] leading-[16px] first:rounded-t-[8px] last:rounded-b-[8px] ${selectedRole === role ? 'bg-[#eae1ff] text-[#7636ff]' : 'text-[#19181d]'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FTE Filter */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFTEOpen(!isFTEOpen);
                setIsRoleOpen(false);
              }}
              className="bg-white box-border flex gap-[8px] h-[38px] items-center p-[12px] rounded-[8px]"
            >
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                FTE
              </p>
              <div className="flex gap-[8px] items-center">
                <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#1f1e30] leading-[16px]">
                  {selectedFTE}
                </p>
                <ChevronDown className="w-[16px] h-[16px] text-[#1f1e30]" strokeWidth={2} />
              </div>
            </button>

            {isFTEOpen && (
              <div className="absolute top-[42px] left-0 bg-white border border-[#e6e6ec] rounded-[8px] shadow-lg z-10 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
                {fteOptions.map((fte) => (
                  <button
                    key={fte}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFTE(fte);
                      setIsFTEOpen(false);
                    }}
                    className={`w-full text-left px-[12px] py-[8px] hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] leading-[16px] first:rounded-t-[8px] last:rounded-b-[8px] ${selectedFTE === fte ? 'bg-[#eae1ff] text-[#7636ff]' : 'text-[#19181d]'
                      }`}
                  >
                    {fte}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-[8px] border border-[#e6e6ec] w-[1145px]">
        {/* Table Header */}
        <div className="flex items-center h-[48px] border-b border-[#e6e6ec]">
          <div className="w-[48px] h-[48px] flex items-center justify-center p-[12px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              #
            </p>
          </div>
          <div className="w-[308px] h-[48px] flex items-center px-[12px] py-[15px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              Name
            </p>
          </div>
          <div className="w-[138px] h-[48px] flex items-center px-[12px] py-[15px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              Role
            </p>
          </div>
          <div className="w-[86px] h-[48px] flex items-center px-[12px] py-[15px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              FTE
            </p>
          </div>
          <div className="w-[343px] h-[48px] flex items-center px-[12px] py-[15px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              Email
            </p>
          </div>
          <div className="w-[174px] h-[48px] flex items-center px-[12px] py-[15px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              Phone
            </p>
          </div>
          <div className="w-[48px] h-[48px]" />
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="p-[48px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-[16px]">
              <div className="w-[40px] h-[40px] border-4 border-[#e6e6ec] border-t-[#7636ff] rounded-full animate-spin" />
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                Loading employees...
              </p>
            </div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-[48px] flex items-center justify-center">
            <div className="text-center">
              <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px] mb-[8px]">
                {employees.length === 0 ? 'No employees yet' : 'No employees match your filters'}
              </p>
              <p className="font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#888796] leading-[20px]">
                {employees.length === 0
                  ? 'Click "Add Employee" to create your first employee'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          </div>
        ) : (
          filteredEmployees.map((employee, index) => (
            <div key={employee.id} className="flex items-center h-[48px] border-b border-[#e6e6ec] last:border-b-0">
              <div className="w-[48px] h-[48px] flex items-center justify-center p-[12px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                  {index + 1}
                </p>
              </div>
              <div className="w-[308px] h-[48px] flex flex-col justify-center px-[12px] py-[8px]">
                <p
                  className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-black leading-[16px] truncate"
                  title={employee.name}
                >
                  {employee.name}
                </p>
                {employee.assignedShifts && employee.assignedShifts.length > 0 && (
                  <div className="flex gap-[4px] mt-[2px] overflow-hidden">
                    {toShiftIds(employee.assignedShifts).map((shiftId) => {
                      const shift = getShiftById(shiftId);
                      return shift ? (
                        <span
                          key={shiftId}
                          className="text-[10px] px-[4px] py-[1px] rounded-[3px] bg-[#eae1ff] text-[#7636ff] font-['Poppins:Medium',_sans-serif] whitespace-nowrap"
                        >
                          {shift.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              <div className="w-[138px] h-[48px] flex items-start px-[12px] py-[13px]">
                <div
                  className="px-[10px] py-[5px] rounded-[4px] border border-solid capitalize"
                  style={{
                    backgroundColor: employee.role?.backgroundColor || employee.roleBg || '#f3f4f6',
                    borderColor: `${employee.role?.color || employee.roleColor || '#374151'}4d`
                  }}
                >
                  <p
                    className="font-['Poppins:Medium',_sans-serif] text-[12px] tracking-[-0.24px] leading-[12px]"
                    style={{ color: employee.role?.color || employee.roleColor || '#374151' }}
                  >
                    {employee.role?.name || 'No Role'}
                  </p>
                </div>
              </div>
              <div className="w-[86px] h-[48px] flex items-center justify-start px-[12px] py-[16px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-black leading-[16px]">
                  {employee.workLoad}
                </p>
              </div>
              <div className="w-[343px] h-[48px] flex items-center px-[12px] py-[16px]">
                <p
                  className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-black leading-[16px] truncate"
                  title={employee.email}
                >
                  {employee.email}
                </p>
              </div>
              <div className="w-[174px] h-[48px] flex items-center px-[12px] py-[16px]">
                <p
                  className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-black leading-[16px] truncate"
                  title={employee.phone}
                >
                  {employee.phone}
                </p>
              </div>
              <div className="w-[48px] h-[48px] flex items-center justify-center p-[12px] relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === employee.id ? null : employee.id);
                  }}
                  className="bg-[#e4d7ff] w-[24px] h-[24px] rounded-[6px] flex items-center justify-center cursor-pointer hover:bg-[#d7c5ff] transition-colors"
                >
                  <MoreHorizontal className="w-[16px] h-[16px] text-white" strokeWidth={2} />
                </button>

                {openMenuId === employee.id && (
                  <div
                    className="absolute right-[12px] top-[40px] bg-white border border-[#e6e6ec] rounded-[8px] shadow-lg z-50 min-w-[140px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(employee);
                      }}
                      className="w-full text-left px-[12px] py-[8px] hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] first:rounded-t-[8px] flex items-center gap-[8px]"
                    >
                      <Edit2 className="w-[14px] h-[14px] text-[#7636ff]" strokeWidth={2} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAvailability(employee);
                      }}
                      className="w-full text-left px-[12px] py-[8px] hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] flex items-center gap-[8px]"
                    >
                      <Calendar className="w-[14px] h-[14px] text-[#7636ff]" strokeWidth={2} />
                      <span>Availability</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(employee.id);
                      }}
                      className="w-full text-left px-[12px] py-[8px] hover:bg-[#fef2f4] font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#d4183d] leading-[14px] last:rounded-b-[8px] flex items-center gap-[8px]"
                    >
                      <Trash2 className="w-[14px] h-[14px] text-[#d4183d]" strokeWidth={2} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )))}
      </div>

      {/* Employee Count */}
      <div className="mt-[24px] flex items-center justify-end w-[1145px]">
        <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
          <span>Showing </span>
          <span className="text-[#19181d]">{filteredEmployees.length}</span>
          <span> {filteredEmployees.length === 1 ? 'employee' : 'employees'}</span>
        </p>
      </div>

      {/* Availability Dialog */}
      <AvailabilityDialog
        isOpen={isAvailabilityDialogOpen}
        onClose={() => {
          setIsAvailabilityDialogOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSave={handleSaveAvailability}
      />
    </div>
  );
}

export default Employees;
