import React from 'react';
import type { ScheduleAssignment } from '@/models/Schedule';

interface EditShiftAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: ScheduleAssignment) => void;
  onDelete: () => void;
  assignment: ScheduleAssignment;
  employees: any[];
}

export function EditShiftAssignmentDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  assignment,
  employees,
}: EditShiftAssignmentDialogProps) {
  const [shiftName, setShiftName] = React.useState(assignment.shiftName);
  const [startTime, setStartTime] = React.useState(assignment.startTime);
  const [endTime, setEndTime] = React.useState(assignment.endTime);

  React.useEffect(() => {
    setShiftName(assignment.shiftName);
    setStartTime(assignment.startTime);
    setEndTime(assignment.endTime);
  }, [assignment]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave({
      ...assignment,
      shiftName,
      startTime,
      endTime,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const employeeName = employees.find(emp => emp.id === assignment.employeeId)?.name || assignment.employeeName;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-[16px]">
      <div className="w-full max-w-[420px] bg-white rounded-[18px] shadow-xl border border-[#e6e6ec] overflow-hidden">
        <div className="px-[24px] py-[20px] border-b border-[#e6e6ec]">
          <p className="font-['Poppins:Medium',_sans-serif] text-[20px] tracking-[-0.4px] text-[#19181d] leading-[24px]">
            Edit shift
          </p>
          <p className="font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#888796] leading-[18px] mt-[4px]">
            {employeeName} — {assignment.date}
          </p>
        </div>
        <div className="px-[24px] py-[20px] space-y-[16px]">
          <div>
            <label className="block text-[12px] font-['Poppins:Medium',_sans-serif] text-[#888796] tracking-[-0.24px] mb-[6px]">
              Shift name
            </label>
            <input
              type="text"
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
              className="w-full border border-[#e6e6ec] rounded-[8px] px-[12px] py-[10px] font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d]"
            />
          </div>
          <div className="flex gap-[12px]">
            <div className="flex-1">
              <label className="block text-[12px] font-['Poppins:Medium',_sans-serif] text-[#888796] tracking-[-0.24px] mb-[6px]">
                Start time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-[#e6e6ec] rounded-[8px] px-[12px] py-[10px] font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-['Poppins:Medium',_sans-serif] text-[#888796] tracking-[-0.24px] mb-[6px]">
                End time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-[#e6e6ec] rounded-[8px] px-[12px] py-[10px] font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d]"
              />
            </div>
          </div>
        </div>
        <div className="px-[24px] py-[16px] border-t border-[#e6e6ec] flex items-center justify-between gap-[12px]">
          <button
            onClick={onClose}
            className="flex-1 border border-[#e6e6ec] bg-white rounded-[10px] py-[12px] font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] hover:border-[#7636ff] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 border border-[#ff6d6d] bg-white rounded-[10px] py-[12px] font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#ff6d6d] hover:bg-[#ff6d6d]/10 transition-colors"
          >
            Remove shift
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#7636ff] rounded-[10px] py-[12px] font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-white hover:bg-[#5b27d7] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

