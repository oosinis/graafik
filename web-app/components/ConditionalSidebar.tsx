// web‑app/components/ConditionalSidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import SidebarNavigation from "./sidebar-navigation";

export function ConditionalSidebar() {
  const pathname = usePathname() || "";

  const publicRoutes = [
    "/login",
    "/register",
    "/register/step3",
    "/register/step4",
  ];

  if (publicRoutes.some(r => pathname.startsWith(r))) {
    return null;
  }
  return <SidebarNavigation />;
}
