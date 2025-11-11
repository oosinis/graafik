"use client";

import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Shift } from '@/models/Shift';

interface ShiftsProps {
  shifts: Shift[];
  isLoading: boolean;
  onAddShift: () => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string, shiftName: string) => void;
}

export default function Shifts({
  shifts,
  isLoading,
  onAddShift,
  onEditShift,
  onDeleteShift,
}: ShiftsProps) {

  const handleDelete = (s: Shift) =>
    onDeleteShift(s.id, s.name ?? s.type ?? "Shift");

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
          className="bg-[#7636ff] flex gap-[8px] h-[38px] items-center justify-center px-[24px] py-[12px] rounded-[8px] text-white"
        >
          Add Shift
          <Plus className="w-[24px] h-[24px] text-white" />
        </button>
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
              className="bg-white rounded-[8px] p-[24px] border border-[#e6e6ec]"
            >
              <div className="flex justify-between">
                <h2 className="text-[20px] text-[#19181d]">
                  {shift.name ?? shift.type}
                </h2>

                <div className="flex gap-[8px]">
                  <button onClick={() => onEditShift(shift)}>
                    <Edit className="text-[#888796]" />
                  </button>

                  <button onClick={() => handleDelete(shift)}>
                    <Trash2 className="text-[#d4183d]" />
                  </button>
                </div>
              </div>

              <p className="mt-[8px] text-[#888796]">
                {shift.startTime} — {shift.endTime}
              </p>

              <p className="text-[#19181d] mt-[8px]">
                {shift.rules?.length || 0} rules
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
