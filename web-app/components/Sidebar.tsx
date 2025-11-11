import { LayoutDashboard, Calendar, Users, Clock, ShieldCheck, Sparkles, UserCog } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
  onLogout?: () => void;
  onNavigate?: (item: string) => void;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ activeItem = 'dashboard', onLogout, onNavigate, userName, userEmail }: SidebarProps) {
  // Check if user is admin
  const adminEmails = ['kart.annus@grafikapp.com', 'kartannus@gmail.com'];
  const isAdmin = adminEmails.includes(userEmail || '');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'shifts', label: 'Shifts', icon: Clock },
    { id: 'roles', label: 'Roles', icon: ShieldCheck },
    { id: 'generator', label: 'Generator', icon: Sparkles },
  ];

  // Add admin menu item if user is admin
  if (isAdmin) {
    menuItems.push({ id: 'admin-signups', label: 'User Signups', icon: UserCog });
  }

  return (
    <div className="bg-white h-full w-[246px] flex flex-col fixed left-0 top-0">
      {/* User Info */}
      <div className="px-[24px] py-[24px] border-b border-[#f7f6fb]">
        <div className="flex items-center gap-[12px]">
          <div className="size-[36px] bg-[#eae1ff] rounded-full flex items-center justify-center">
            <span className="font-['Poppins:Medium',_sans-serif] text-[14px] text-[#7636ff]">
              {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </span>
          </div>
          <div>
            <p className="font-['Poppins:Medium',_sans-serif] text-[14px] text-[#19181d] leading-[14px]">
              {userName || 'User'}
            </p>
            <p className="font-['Poppins:Regular',_sans-serif] text-[12px] text-[#888796] leading-[12px] mt-[4px]">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-[24px] py-[32px] overflow-y-auto">
        <ul className="space-y-[16px]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate?.(item.id)}
                  className={`
                    w-full flex items-center gap-[12px] px-[14px] py-[9px] rounded-[8px] transition-colors
                    ${isActive 
                      ? 'bg-[#eae1ff] text-[#7636ff]' 
                      : 'text-[#888796] hover:bg-[#f7f6fb]'
                    }
                  `}
                >
                  <Icon className="w-[16px] h-[16px]" strokeWidth={1.5} />
                  <span className={`font-['Poppins:${isActive ? 'Medium' : 'Regular'}',_sans-serif] text-[16px] tracking-[-0.32px] leading-[16px]`}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <div className="px-[24px] py-[24px] border-t border-[#f7f6fb]">
          <button
            onClick={onLogout}
            className="w-full px-[14px] py-[9px] rounded-[8px] font-['Poppins:Medium',_sans-serif] text-[14px] text-[#888796] hover:bg-[#f7f6fb] transition-colors text-left"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
