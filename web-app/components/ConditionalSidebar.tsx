"use client";

import { usePathname } from "next/navigation";
import { SidebarNavigation } from "./SidebarNavigation";

export function ConditionalSidebar() {
  const pathname = usePathname() || "";
  const publicRoutes = ["/login", "/register"]; // hide sidebar on auth pages
  if (publicRoutes.some((r) => pathname.startsWith(r))) return null;
  return <SidebarNavigation />;
}

export default ConditionalSidebar;
