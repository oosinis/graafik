"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PenTool, Users, Clock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@auth0/nextjs-auth0"

export function SidebarNavigation() {
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  const roles: string[] = user?.["https://grafikapp.dev/claims/roles"] || []
  console.log("USER:", user)
  console.log("ROLES:", roles)
  
  const navItems = [
    {
      name: "Töölaud",
      href: "/",
      icon: LayoutDashboard,
      requiredRoles: ["admin", "Manager"],
    },
    {
      name: "Planeerija",
      href: "/generator",
      icon: PenTool,
      requiredRoles: ["admin", "Manager"],
    },
    {
      name: "Töötajad",
      href: "/workers",
      icon: Users,
      requiredRoles: ["admin"],
    },
    {
      name: "Vahetused",
      href: "/shifts",
      icon: Clock,
      requiredRoles: ["admin", "Manager"],
    },
    {
      name: "Graafiku Ülevaade",
      href: "/schedule",
      icon: Calendar,
      requiredRoles: ["admin", "Manager"],
    },
    {
      name: "Graafikute Ajalugu",
      href: "/schedule-history",
      icon: Calendar,
      requiredRoles: ["admin"],
    },
  ]

  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredRoles) return true // no restriction
    return roles.some((role) => item.requiredRoles!.includes(role))
  })

  if (isLoading) return null

  return (
    <nav className="w-48 bg-gray-800 text-white p-4 h-full">
      <h1 className="text-xl font-bold mb-6">Graafiku Planeerija</h1>
      <ul className="space-y-2">
        {filteredNavItems.map((item) => {
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
