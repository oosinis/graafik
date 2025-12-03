'use client';

import { useState } from 'react';
import type { Role } from '@/models/Role';
import { Check, X } from 'lucide-react';
import { RoleColor } from './RoleColors';

interface AddRoleProps {
  onSave: (role: Partial<Role>) => void;
  onDiscard: () => void;
  editingRole?: Role;
}

export function AddRole({ onSave, onDiscard, editingRole }: AddRoleProps) {
  const [roleName, setRoleName] = useState<string>(editingRole?.name ?? '');

  // Find the initial selected color ID based on the editingRole's color/bg
  const initialSelectedId = editingRole
    ? RoleColor.find(c => c.dot === editingRole.color && c.bg === editingRole.backgroundColor)?.id
    : undefined;

  const [selected, setSelected] = useState<string | undefined>(initialSelectedId);

  const inputClass =
    'bg-[#f7f6fb] h-[40px] px-[14px] rounded-[8px] text-[15px] w-full outline-none';

  const handleSave = () => {
    if (!roleName.trim()) {
      alert('Please enter a role name');
      return;
    }

    const selectedColor = RoleColor.find((c) => c.id === selected);

    const payload: Partial<Role> = {
      name: roleName.trim(),
      ...(selectedColor ? {
        color: selectedColor.dot,
        backgroundColor: selectedColor.bg
      } : {}),
    };

    console.log('Creating role payload:', payload);
    onSave(payload);
  };

  return (
    <div className="p-4 w-full">
      <div className="mb-8 flex justify-between items-center pr-6">
        <h1 className="text-[24px] font-medium">
          {editingRole ? 'Edit Role' : 'Add New Role'}
        </h1>
        <div>
          <button
            onClick={onDiscard}
            className="p-2 rounded hover:bg-[#f7f6fb]"
          >
            <X />
          </button>
        </div>
      </div>
      <hr className="h-px bg-[#E6E6EC] w-full" />

      <div className="m-6">
        <label className="text-[14px] font-medium">Role Name</label>
        <input
          value={roleName}
          placeholder="e.g., Manager, Barista, Cashier"
          onChange={(e) => setRoleName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="m-6 grid grid-cols-4 gap-3">
        <label className="text-[14px] font-medium col-span-4">Role Color</label>
        {RoleColor.map((color) => {
          const isActive = selected === color.id;
          return (
            <button
              key={color.id}
              onClick={() => setSelected(color.id)}
              className={[
                'rounded-xl p-4 flex flex-col items-center gap-2 border transition',
                isActive
                  ? 'border-[#7636ff] ring-2 ring-indigo-500'
                  : 'border-gray-200',
              ].join(' ')}
              style={{ backgroundColor: color.bg }}
              type="button"
            >
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color.dot }}
              />
              <span className="font-medium" style={{ color: color.dot }}>
                {color.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="m-6 flex flex-col gap-2">
        <label className="text-[14px] font-medium">Preview</label>
        <div className="flex items-center gap-[12px] p-[16px] bg-[#f7f6fb] rounded-[8px]">
          <div
            className="inline-block p-2 rounded-md font-small mt-1"
            style={{
              backgroundColor:
                RoleColor.find((c) => c.id === selected)?.bg || '#888796',
              color: RoleColor.find((c) => c.id === selected)?.dot || '#ffffff',
            }}
          >
            {roleName || 'Role Name'}
          </div>
        </div>
      </div>

      <hr className="h-px bg-[#E6E6EC] w-full" />

      <div className="p-4 w-full justify-end flex mt-6">
        <div className="flex gap-2">
          <button
            onClick={onDiscard}
            className="text-[#7636ff] px-4 py-2 rounded hover:bg-[#f7f6fb]"
            type="button"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-[#7636ff] text-white px-6 py-2 rounded-lg flex gap-2 items-center hover:bg-[#6428e0]"
            type="button"
          >
            <Check size={18} />
            {editingRole ? 'Save Changes' : 'Save Role'}
          </button>
        </div>
      </div>
    </div>
  );
}
