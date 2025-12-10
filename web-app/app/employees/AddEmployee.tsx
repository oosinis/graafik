import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Shift } from '@/models/Shift';
import { Employee } from '@/models/Employee';
import { EmployeeService } from '@/services/employeeService';
import { Role } from '@/models/Role';

interface AddEmployeeProps {
  onSave: (employee: Employee) => void;
  onDiscard: () => void;
  editingEmployee?: Employee;
  roles?: Role[];
  shifts?: Shift[];
}

export function AddEmployee({ onSave, onDiscard, editingEmployee, roles = [], shifts = [] }: AddEmployeeProps) {
  const [isSaving, setIsSaving] = React.useState(false);

  // Parse employee data if editing
  const getInitialFormData = () => {
    if (editingEmployee) {
      const [firstName, ...lastNameParts] = editingEmployee.name.split(' ');
      return {
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email: editingEmployee.email || '',
        phone: editingEmployee.phone !== 'N/A' ? editingEmployee.phone : '',
        notes: editingEmployee.notes || '',
        primaryRole: editingEmployee.role?.name || '',
        secondaryRole: editingEmployee.secondaryRole?.name || '',
        fte: editingEmployee.workLoad?.toString() || '',
        preferredShifts: editingEmployee.preferredShifts || [],
        preferredWorkdays: editingEmployee.preferredWorkdays || [],
        assignedShifts: (editingEmployee.assignedShifts || []).map(s => typeof s === 'string' ? s : s.id)
      };
    }
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
      primaryRole: '',
      secondaryRole: '',
      fte: '',
      preferredShifts: [] as string[],
      preferredWorkdays: [] as string[],
      assignedShifts: [] as string[]
    };
  };

  const [formData, setFormData] = React.useState(getInitialFormData());

  const [isPrimaryRoleOpen, setIsPrimaryRoleOpen] = React.useState(false);
  const [isSecondaryRoleOpen, setIsSecondaryRoleOpen] = React.useState(false);

  const roleNames = roles.map(r => r.name);
  const fteOptions = ['1.0', '0.75', '0.5', '0.25', 'Other'];
  const preferredShiftTypes = ['Morning', 'Day', 'Evening', 'None'];
  const workdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsPrimaryRoleOpen(false);
      setIsSecondaryRoleOpen(false);
    };

    if (isPrimaryRoleOpen || isSecondaryRoleOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isPrimaryRoleOpen, isSecondaryRoleOpen]);

  const toggleShift = (shift: string) => {
    setFormData(prev => ({
      ...prev,
      preferredShifts: prev.preferredShifts.includes(shift)
        ? prev.preferredShifts.filter(s => s !== shift)
        : [...prev.preferredShifts, shift]
    }));
  };

  const toggleWorkday = (day: string) => {
    setFormData(prev => ({
      ...prev,
      preferredWorkdays: prev.preferredWorkdays.includes(day)
        ? prev.preferredWorkdays.filter(d => d !== day)
        : [...prev.preferredWorkdays, day]
    }));
  };

  const toggleAssignedShift = (shiftId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedShifts: prev.assignedShifts.includes(shiftId)
        ? prev.assignedShifts.filter(s => s !== shiftId)
        : [...prev.assignedShifts, shiftId]
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.primaryRole || !formData.fte) {
      alert('Please fill out the required fields');
      return;
    }

    // Validate that primary and secondary roles are different
    if (formData.secondaryRole && formData.primaryRole === formData.secondaryRole) {
      alert('Primary role and secondary role cannot be the same. Please select different roles.');
      return;
    }

    setIsSaving(true);
    try {
      let savedEmployee: Employee;
      if (editingEmployee) {
        // For update, send the DTO expected by UpdateEmployeeRequest
        const updatePayload = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone || 'N/A',
          employeeRole: formData.primaryRole,
          secondaryRole: formData.secondaryRole,
          workLoad: parseFloat(formData.fte),
          notes: formData.notes,
          preferredShifts: formData.preferredShifts,
          preferredWorkdays: formData.preferredWorkdays,
          assignedShifts: formData.assignedShifts // Send IDs directly
        };
        savedEmployee = await EmployeeService.update(editingEmployee.id, updatePayload);
      } else {
        // For create, keep using the Employee object structure (or ensure backend handles it)
        // Existing logic used full objects for roles/shifts.
        // If Create works, we leave it. Usage of this form for CREATE implies it might also need IDs if backend expects objects but gets IDs? 
        // But backend `createEmployee` takes `Employee` entity directly.
        // Frontend was sending objects: `assignedShifts: formData.assignedShifts.map(id => ({ id } as Shift))`
        // This is valid for Entity deserialization if ID is present.

        const employeeData: Partial<Employee> = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone || 'N/A',
          role: roles.find(r => r.name === formData.primaryRole),
          secondaryRole: roles.find(r => r.name === formData.secondaryRole),
          workLoad: parseFloat(formData.fte),
          notes: formData.notes,
          preferredShifts: formData.preferredShifts,
          preferredWorkdays: formData.preferredWorkdays,
          assignedShifts: formData.assignedShifts.map(id => ({ id } as Shift))
        };
        savedEmployee = await EmployeeService.create(employeeData);
      }

      onSave(savedEmployee);
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert('Failed to save employee. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-[32px] w-full">
      {/* Header */}
      <div className="mb-[43px] flex items-center justify-between pr-[24px]">
        <h1 className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-[#19181d] leading-[32px] capitalize">
          {editingEmployee ? 'Edit employee' : 'Add a new employee'}
        </h1>
        <div className="flex gap-[8px] items-center pl-[24px]">
          <button
            onClick={onDiscard}
            disabled={isSaving}
            className="box-border content-stretch flex gap-[8px] h-[38px] items-center justify-center px-[24px] py-[12px] rounded-[8px] disabled:opacity-50"
          >
            <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#7636ff] leading-[16px]">
              Discard
            </p>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#7636ff] box-border content-stretch flex gap-[8px] h-[38px] items-center justify-center px-[24px] py-[12px] rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-white leading-[16px]">
              {isSaving ? 'Saving...' : (editingEmployee ? 'Save Changes' : 'Save & Add')}
            </p>
          </button>
        </div>
      </div>

      <div className="flex gap-[24px]">
        {/* Personal Info - 558x560 */}
        <div className="flex flex-col gap-[24px] w-[558px]">
          {/* Personal Info Card */}
          <div className="bg-white rounded-[8px] p-[24px] h-[372px]">
            <div className="flex flex-col gap-[32px]">
              {/* Header */}
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[20px] tracking-[-0.4px] text-[#19181d] leading-[20px] capitalize">
                  Personal info
                </p>
                <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[12px]">
                  General details about the employee
                </p>
              </div>

              {/* First Name & Last Name */}
              <div className="flex gap-[16px] h-[64px]">
                <div className="flex flex-col gap-[18px] w-[247px]">
                  <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                    First Name<span className="text-[#d4183d]">*</span>
                  </p>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Type here..."
                    className="bg-[#f7f6fb] h-[32px] px-[16px] py-[12px] rounded-[8px] font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] text-[#19181d] placeholder:text-[#888796] leading-[22px] border-none outline-none"
                  />
                </div>
                <div className="flex flex-col gap-[18px] w-[247px]">
                  <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                    Last Name<span className="text-[#d4183d]">*</span>
                  </p>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Type here..."
                    className="bg-[#f7f6fb] h-[32px] px-[16px] py-[12px] rounded-[8px] font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] text-[#19181d] placeholder:text-[#888796] leading-[22px] border-none outline-none"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="flex flex-col gap-[18px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                  Work Email<span className="text-[#d4183d]">*</span>
                </p>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Type here..."
                  className="bg-[#f7f6fb] h-[32px] px-[16px] py-[12px] rounded-[8px] font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] text-[#19181d] placeholder:text-[#888796] leading-[22px] border-none outline-none w-full"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-[18px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                  Phone number
                </p>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Type here..."
                  className="bg-[#f7f6fb] h-[32px] px-[16px] py-[12px] rounded-[8px] font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] text-[#19181d] placeholder:text-[#888796] leading-[22px] border-none outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes Card */}
          <div className="bg-white rounded-[8px] p-[24px] h-[164px]">
            <div className="flex flex-col gap-[18px]">
              <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                Additional notes
              </p>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Type here..."
                className="bg-[#f7f6fb] h-[80px] px-[16px] py-[12px] rounded-[8px] font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] text-[#19181d] placeholder:text-[#888796] leading-[22px] border-none outline-none w-full resize-none"
              />
            </div>
          </div>
        </div>

        {/* Employment Details - 558x512 */}
        <div className="bg-white rounded-[8px] p-[24px] w-[558px] h-[632px]">
          <div className="flex flex-col gap-[32px]">
            {/* Header */}
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Poppins:Medium',_sans-serif] text-[20px] tracking-[-0.4px] text-[#19181d] leading-[20px] capitalize">
                Employment details
              </p>
              <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[12px]">
                Role and employment type to match with the shifts
              </p>
            </div>

            {/* Primary & Secondary Role */}
            <div className="flex gap-[18px]">
              <div className="flex flex-col gap-[18px] w-[251px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                  Primary Role<span className="text-[#d4183d]">*</span>
                </p>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPrimaryRoleOpen(!isPrimaryRoleOpen);
                      setIsSecondaryRoleOpen(false);
                    }}
                    className="bg-[#f7f6fb] w-full h-[32px] px-[16px] py-[12px] rounded-[8px] flex items-center justify-between"
                  >
                    <p className="font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] leading-[22px] text-left" style={{ color: formData.primaryRole ? '#19181d' : '#888796' }}>
                      {formData.primaryRole || 'Select'}
                    </p>
                    <ChevronDown className="w-[24px] h-[24px] text-[#888796]" strokeWidth={2} />
                  </button>
                  {isPrimaryRoleOpen && (
                    <div className="absolute top-[36px] left-0 bg-white border border-[#e6e6ec] rounded-[8px] shadow-lg z-10 w-full max-h-[200px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      {roleNames.length === 0 ? (
                        <div className="px-[12px] py-[8px] text-center text-[#888796] font-['Poppins:Regular',_sans-serif] text-[14px]">
                          No roles available. Please add roles first.
                        </div>
                      ) : (
                        roleNames.map((role) => (
                          <button
                            key={role}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => {
                                // If changing primary role and it matches secondary, clear secondary
                                const newData = { ...prev, primaryRole: role };
                                if (prev.secondaryRole === role) {
                                  newData.secondaryRole = '';
                                }
                                return newData;
                              });
                              setIsPrimaryRoleOpen(false);
                            }}
                            className="w-full text-left px-[12px] py-[8px] hover:bg-[#f7f6fb] font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px] first:rounded-t-[8px] last:rounded-b-[8px]"
                          >
                            {role}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-[18px] w-[251px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                  Secondary Role
                </p>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSecondaryRoleOpen(!isSecondaryRoleOpen);
                      setIsPrimaryRoleOpen(false);
                    }}
                    className="bg-[#f7f6fb] w-full h-[32px] px-[16px] py-[12px] rounded-[8px] flex items-center justify-between"
                  >
                    <p className="font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] leading-[22px] text-left" style={{ color: formData.secondaryRole ? '#19181d' : '#888796' }}>
                      {formData.secondaryRole || 'Select'}
                    </p>
                    <ChevronDown className="w-[24px] h-[24px] text-[#888796]" strokeWidth={2} />
                  </button>
                  {isSecondaryRoleOpen && (
                    <div className="absolute top-[36px] left-0 bg-white border border-[#e6e6ec] rounded-[8px] shadow-lg z-10 w-full max-h-[200px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      {roleNames.length === 0 ? (
                        <div className="px-[12px] py-[8px] text-center text-[#888796] font-['Poppins:Regular',_sans-serif] text-[14px]">
                          No roles available. Please add roles first.
                        </div>
                      ) : (
                        roleNames.map((role) => {
                          const isSameAsPrimary = role === formData.primaryRole;
                          return (
                            <button
                              key={role}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSameAsPrimary) {
                                  alert('Secondary role cannot be the same as primary role. Please select a different role.');
                                  return;
                                }
                                setFormData(prev => ({ ...prev, secondaryRole: role }));
                                setIsSecondaryRoleOpen(false);
                              }}
                              disabled={isSameAsPrimary}
                              className={`w-full text-left px-[12px] py-[8px] font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] leading-[16px] first:rounded-t-[8px] last:rounded-b-[8px] ${isSameAsPrimary
                                ? 'text-[#d1d1d9] bg-[#fafafa] cursor-not-allowed'
                                : 'text-[#19181d] hover:bg-[#f7f6fb] cursor-pointer'
                                }`}
                            >
                              {role}
                              {isSameAsPrimary && (
                                <span className="ml-[8px] font-['Poppins:Regular',_sans-serif] text-[12px] text-[#888796]">
                                  (Same as primary)
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Employment Type */}
            <div className="flex flex-col gap-[18px]">
              <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                Employment type<span className="text-[#d4183d]">*</span>
              </p>
              <div className="flex gap-[8px]">
                {fteOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, fte: option }))}
                    className={`h-[32px] px-[16px] py-[12px] rounded-[8px] flex items-center justify-center font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] leading-[22px] transition-colors ${formData.fte === option ? 'bg-[#7636ff] text-white' : 'bg-[#f7f6fb] text-[#888796]'
                      }`}
                  >
                    {option === 'Other' ? option : `${option} FTE`}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Shifts */}
            <div className="flex flex-col gap-[18px]">
              <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                Preferred Shifts
              </p>
              <div className="flex gap-[8px]">
                {preferredShiftTypes.map((shift) => (
                  <button
                    key={shift}
                    onClick={() => toggleShift(shift)}
                    className={`h-[32px] px-[16px] py-[12px] rounded-[8px] flex items-center justify-center font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] leading-[22px] transition-colors ${formData.preferredShifts.includes(shift) ? 'bg-[#7636ff] text-white' : 'bg-[#f7f6fb] text-[#888796]'
                      }`}
                  >
                    {shift}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Workdays */}
            <div className="flex flex-col gap-[18px]">
              <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize">
                Preferred Workdays
              </p>
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[8px]">
                  {workdays.slice(0, 4).map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleWorkday(day)}
                      className={`h-[32px] px-[16px] py-[12px] rounded-[8px] flex items-center justify-center font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] leading-[22px] transition-colors ${formData.preferredWorkdays.includes(day) ? 'bg-[#7636ff] text-white' : 'bg-[#f7f6fb] text-[#888796]'
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="flex gap-[8px]">
                  {workdays.slice(4).map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleWorkday(day)}
                      className={`h-[32px] px-[16px] py-[12px] rounded-[8px] flex items-center justify-center font-['Poppins:Regular',_sans-serif] text-[17px] tracking-[-0.34px] leading-[22px] transition-colors ${formData.preferredWorkdays.includes(day) ? 'bg-[#7636ff] text-white' : 'bg-[#f7f6fb] text-[#888796]'
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Assigned Shifts */}
            <div className="flex flex-col gap-[18px]">
              <div>
                <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] capitalize mb-[4px]">
                  Assigned Shifts
                </p>
                <p className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[16px]">
                  Select which shift types this employee can work
                </p>
              </div>
              <div className="flex flex-wrap gap-[8px]">
                {shifts.length === 0 ? (
                  <p className="font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#888796] leading-[14px] italic">
                    No shifts available. Create shifts first.
                  </p>
                ) : (
                  shifts.map((shift) => (
                    <button
                      key={shift.id}
                      onClick={() => toggleAssignedShift(shift.id)}
                      className={`h-[32px] px-[16px] py-[12px] rounded-[8px] flex items-center gap-[6px] justify-center font-['Poppins:Regular',_sans-serif] text-[15px] tracking-[-0.30px] leading-[15px] transition-colors ${formData.assignedShifts.includes(shift.id) ? 'bg-[#7636ff] text-white' : 'bg-[#f7f6fb] text-[#888796]'
                        }`}
                    >
                      {shift.name}
                      {formData.assignedShifts.includes(shift.id) && (
                        <span className="font-['Poppins:Regular',_sans-serif] text-[11px]">
                          ({shift.startTime}-{shift.endTime})
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
