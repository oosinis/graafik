import type { Role } from '@/models/Role';
import { Check } from 'lucide-react';

interface AddRoleProps {
  onSave: (role: Partial<Role>) => void;
  onDiscard: () => void;
  editingRole?: Role;
}

const handleSave = () => {
  const payload: Partial<Role> = {
    //TODO: populate with actual data from form inputs
  };

  // debug: confirm payload and that parent handler is called
  console.log('Creating shift payload:', payload);

  //onSave(payload);
};

export function AddRole({ onSave, onDiscard, editingRole }: AddRoleProps) {
  return (
    <div className="p-4 w-full">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center pr-6">
        <h1 className="text-[24px] font-medium">
          {editingRole ? 'Edit Role' : 'Add New Role'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={onDiscard}
            className="text-[#7636ff] px-4 py-2 rounded hover:bg-[#f7f6fb]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-[#7636ff] text-white px-6 py-2 rounded-lg flex gap-2 items-center hover:bg-[#6428e0]"
          >
            <Check size={18} />
            {editingRole ? 'Save Changes' : 'Save Role'}
          </button>
        </div>
      </div>
    </div>
  );
}
