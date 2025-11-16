import React from 'react';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import type { Employee } from '@/models/Employee';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RolesProps {
  onAddRole?: () => void;
  onDeleteRole?: (roleName: string) => void;
  employees?: Employee[];
  roles?: Array<{
    name: string;
    color: string;
    backgroundColor: string;
  }>;
  isLoading?: boolean;
}

export function Roles({ onAddRole, onDeleteRole, employees = [], roles: rolesProp = [], isLoading = false }: RolesProps) {
  // Use roles from props and count employees for each role
  const roles = React.useMemo(() => {
    // Deduplicate roles by name to prevent duplicate keys
    const uniqueRoles = rolesProp.reduce((acc, role) => {
      const existing = acc.find(r => r.name === role.name);
      if (!existing) {
        acc.push(role);
      }
      return acc;
    }, [] as typeof rolesProp);
    
    return uniqueRoles.map((role, index) => {
      const employeeCount = employees.filter(emp => emp.role === role.name).length;
      return {
        id: `${role.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        name: role.name,
        color: role.color,
        backgroundColor: role.backgroundColor,
        employeeCount
      };
    });
  }, [rolesProp, employees]);

  return (
    <div className="py-[32px] w-full">
      {/* Header */}
      <div className="mb-[11px] flex items-center justify-between pr-[24px]">
        <h1 className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-[#19181d] leading-[32px] capitalize">
          Roles
        </h1>
        <button 
          onClick={onAddRole}
          className="bg-[#7636ff] box-border content-stretch flex gap-[8px] h-[38px] items-center justify-center px-[24px] py-[12px] rounded-[8px] cursor-pointer hover:bg-[#6428e0] transition-colors"
        >
          <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-white leading-[16px]">
            Add New Role
          </p>
          <Plus className="w-[24px] h-[24px] text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-[8px] border border-[#e6e6ec] overflow-hidden w-[1145px] mt-[35px]">
        {/* Table Header */}
        <div className="flex items-center h-[48px] border-b border-[#e6e6ec]">
          <div className="w-[48px] h-[48px] flex items-center justify-center p-[12px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              #
            </p>
          </div>
          <div className="w-[400px] h-[48px] flex items-center px-[12px] py-[15px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              Role Name
            </p>
          </div>
          <div className="w-[250px] h-[48px] flex items-center px-[12px] py-[15px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              Color Preview
            </p>
          </div>
          <div className="w-[397px] h-[48px] flex items-center px-[12px] py-[15px]">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
              Employees
            </p>
          </div>
          <div className="w-[50px] h-[48px] flex items-center justify-center">
            {/* Actions column header */}
          </div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="flex flex-col items-center gap-[16px]">
              <div className="w-[40px] h-[40px] border-4 border-[#e6e6ec] border-t-[#7636ff] rounded-full animate-spin" />
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                Loading roles...
              </p>
            </div>
          </div>
        ) : roles.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
              No roles found. Add a new role to get started.
            </p>
          </div>
        ) : (
          roles.map((role, index) => (
            <div key={role.id} className="flex items-center h-[56px] border-b border-[#e6e6ec] last:border-b-0">
              <div className="w-[48px] h-[56px] flex items-center justify-center p-[12px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                  {index + 1}
                </p>
              </div>
              <div className="w-[400px] h-[56px] flex items-center px-[12px] py-[16px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-black leading-[16px]">
                  {role.name}
                </p>
              </div>
              <div className="w-[250px] h-[56px] flex items-center px-[12px] py-[16px]">
                <div
                  className="px-[10px] py-[5px] rounded-[4px] border border-solid capitalize"
                  style={{
                    backgroundColor: role.backgroundColor,
                    borderColor: `${role.color}4d`
                  }}
                >
                  <p
                    className="font-['Poppins:Medium',_sans-serif] text-[12px] tracking-[-0.24px] leading-[12px]"
                    style={{ color: role.color }}
                  >
                    {role.name}
                  </p>
                </div>
              </div>
              <div className="w-[397px] h-[56px] flex items-center px-[12px] py-[16px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-black leading-[16px]">
                  {role.employeeCount} {role.employeeCount === 1 ? 'employee' : 'employees'}
                </p>
              </div>
              <div className="w-[50px] h-[56px] flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center hover:bg-[#f7f6fb] transition-colors">
                      <MoreVertical className="w-[20px] h-[20px] text-[#888796]" strokeWidth={2} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                      onClick={() => onDeleteRole?.(role.name)}
                      className="text-[#dc2626] focus:text-[#dc2626] cursor-pointer"
                    >
                      <Trash2 className="w-[16px] h-[16px] mr-[8px]" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Role Count */}
      <div className="mt-[24px] flex items-center justify-end w-[1145px]">
        <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
          <span>Showing </span>
          <span className="text-[#19181d]">{roles.length}</span>
          <span> {roles.length === 1 ? 'role' : 'roles'}</span>
        </p>
      </div>
    </div>
  );
}

export default Roles;