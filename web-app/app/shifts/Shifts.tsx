'use client';

import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Shift } from '@/models/Shift';
import { Rule } from '@/models/Rule';
import { daysOfTheWeek } from '@/lib/utils';

interface ShiftsProps {
  shifts: Shift[];
  isLoading: boolean;
  onAddShift: () => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string, shiftName: string) => void;
}

const priorityClass = (p: Rule['priority']) => {
  switch (p) {
    case 'high':
      return 'bg-[#fff1f2] text-[#d4183d] border border-[#ffd8dc]';
    case 'medium':
      return 'bg-[#fff8e1] text-[#b36d00] border border-[#ffecd1]';
    case 'low':
      return 'bg-[#ecfdf5] text-[#0b8a5f] border border-[#dff6ea]';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function Shifts({
  shifts,
  isLoading,
  onAddShift,
  onEditShift,
  onDeleteShift,
}: ShiftsProps) {
  const handleDelete = (s: Shift) =>
    onDeleteShift(s.id, s.name ?? s.name ?? 'Shift');

  return (
    <div className="py-[32px] w-full">
      {/* Header */}
      <div className="mb-[24px] flex items-center justify-between pr-[24px]">
        <h1 className="font-['Poppins:Medium',_sans-serif] text-[24px] text-[#19181d]">
          Shifts
        </h1>

        <button
          onClick={onAddShift}
          disabled={isLoading}
          className="bg-[#7636ff] flex gap-[8px] h-[38px] items-center justify-center px-[24px] py-[12px] rounded-lg text-white"
        >
          Add Shift
          <Plus className="w-[24px] h-[24px] text-white" />
        </button>
      </div>
      <div className="m-[12px]">
        <h2 className="text-[16px] text-[#888796]">
          {shifts.length} {shifts.length === 1 ? 'Shift' : 'Shifts'}
        </h2>
      </div>

      {/* List */}
      <div className="flex flex-col gap-[16px] pr-[24px]">
        {isLoading && (
          <div className="bg-white rounded-[8px] p-[48px] text-center">
            Loading shifts...
          </div>
        )}

        {!isLoading && shifts.length === 0 && (
          <div className="bg-white rounded-[8px] p-[48px] text-center text-[#888796]">
            No shifts yet. Click **Add Shift**
          </div>
        )}

        {!isLoading &&
          shifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white rounded-[8px] p-[24px] border border-[#e6e6ec] hover:border-[#7636ff] transition"
            >
              <div className="flex justify-between">
                <h2 className="text-[20px] text-[#19181d]">{shift.name}</h2>

                <div className="flex gap-[8px]">
                  <button onClick={() => onEditShift(shift)}>
                    <Edit className="text-[#888796]" />
                  </button>

                  <button onClick={() => handleDelete(shift)}>
                    <Trash2 className="text-[#d4183d]" />
                  </button>
                </div>
              </div>
              <div className="flex gap-[48px]">
                <div>
                  <h3 className="text-[#888796] text-[12px] mt-[6px] mb-[6px]">
                    Time
                  </h3>
                  <span className="text-[#19181d] mt-[8px]">
                    {shift.startTime} — {shift.endTime}
                  </span>
                </div>
                <div className="mb-[12px]">
                  <h3 className="text-[#888796] text-[12px] mt-[6px] mb-[6px]">
                    Rules
                  </h3>
                  <p className="text-[#19181d] mt-[8px]">
                    {shift.rules?.length || 0} configured
                  </p>
                </div>
              </div>

              <hr className="h-px bg-[#E6E6EC]"></hr>

              <div className="mt-[12px]">
                <h3 className="text-[#888796] text-[14px] mb-[6px]">
                  Shift Rules:
                </h3>
                <div>
                  {shift.rules && shift.rules.length > 0 ? (
                    <ul className="list-disc text-[#19181d]">
                      {shift.rules.map((rule) => (
                        <ul
                          key={rule.id}
                          className=" bg-[#f7f6fb] p-4 rounded-lg mb-2"
                        >
                          <div>
                            <span className="font-medium">{rule.name}</span>
                            <span
                              className={`ml-2 px-2 py-0.5 rounded-full text-[12px] font-medium ${priorityClass(
                                rule.priority
                              )}`}
                              aria-label={`priority ${rule.priority}`}
                            >
                              {rule.priority}
                            </span>
                          </div>
                          <div>
                            <div>
                              <span className="text-sm text-[#888796]">
                                {rule.daysApplied.length > 0
                                  ? rule.daysApplied
                                      .map(daysOfTheWeek)
                                      .join(', ')
                                  : 'None'}{' '}
                                • {rule.perDay} shifts/day •{' '}
                                {rule.continuousDays} max days • {rule.restDays}{' '}
                                days off
                              </span>
                            </div>
                          </div>
                        </ul>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#19181d]">
                      No specific rules configured.
                    </p>
                  )}{' '}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
