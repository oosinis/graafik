// web-app/components/ConditionalSidebar.tsx
"use client"

import { usePathname } from "next/navigation"
import { SidebarNavigation } from "./sidebar-navigation"

export function ConditionalSidebar() {
  const pathname = usePathname() || ""
  // any routes where you *don’t* want the sidebar:
  const publicRoutes = ["/login", "/register"]
  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    return null
  }
  return <SidebarNavigation />
}
