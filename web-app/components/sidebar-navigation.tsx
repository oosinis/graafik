"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PenTool, Users, Clock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@auth0/nextjs-auth0"
import { useUserRoles } from '@/hooks/useUserRoles';

export function SidebarNavigation() {
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  const navItems = [
    {
      name: "Töölaud",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Planeerija",
      href: "/generator",
      icon: PenTool,
    },
    {
      name: "Töötajad",
      href: "/workers",
      icon: Users,
    },
    {
      name: "Vahetused",
      href: "/shifts",
      icon: Clock,
    },
    {
      name: "Graafiku Ülevaade",
      href: "/schedule",
      icon: Calendar,
    },
    {
      name: "Graafikute Ajalugu",
      href: "/schedule-history",
      icon: Calendar,
    },
  ]

  if (isLoading) return null

  return (
    <nav className="w-48 bg-gray-800 text-white p-4 h-full">
      <h1 className="text-xl font-bold mb-6">Graafiku Planeerija</h1>
      <ul className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 py-2 px-3 rounded transition-colors duration-200",
                  isActive ? "bg-gray-700 text-white" : "hover:text-gray-300 hover:bg-gray-700",
                )}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}