import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Planner", href: "/generator" },
  { label: "Employees", href: "/workers" },
  { label: "Shifts", href: "/shifts" },
  { label: "Schedule Overview", href: "/schedule" },
  { label: "History", href: "/schedule-history" },
];

export const ConditionalSidebar: React.FC = () => {
  const pathname = usePathname() || "";
  return (
    <aside className="hidden md:flex md:flex-col w-60 border-r bg-[#12161c] text-zinc-200">
      <div className="px-5 py-6 text-lg font-semibold tracking-tight text-white">Schedule Planner</div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-600/20 text-white"
                  : "text-zinc-300 hover:bg-zinc-700/40 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-zinc-500">v0.1</div>
    </aside>
  );
};

export default ConditionalSidebar;
