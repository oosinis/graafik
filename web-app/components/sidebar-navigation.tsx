// web‑app/components/sidebar‑navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  ListChecks,
  Users,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { label: "Dashboard",  href: "/dashboard", icon: LayoutDashboard },
  { label: "Schedule",   href: "/schedule",  icon: Calendar         },
  { label: "Shifts",     href: "/shifts",    icon: ListChecks       },
  { label: "Employees",  href: "/employees", icon: Users            },
];

export default function SidebarNavigation() {
  const pathname = usePathname() || "";

  return (
    <nav className="w-64 bg-white border-r">
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold">Graafik</h1>
      </div>
      <ul className="mt-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-r-lg transition-colors",
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
