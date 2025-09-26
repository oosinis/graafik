"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PenTool, Users, Clock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "@/components/styles/SidebarNavigation.module.css";
// Auth features temporarily disabled (Auth0 package not installed)

export function SidebarNavigation() {
  const pathname = usePathname()

  const navItems = [
    /*{
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },*/
    {
      name: "Generator",
      href: "/generator",
      icon: PenTool,
    },
    {
      name: "Workers",
      href: "/workers",
      icon: Users,
    },
    {
      name: "Shifts",
      href: "/shifts",
      icon: Clock,
    },
    {
      name: "Schedule",
      href: "/schedule",
      icon: Calendar,
    },
   /* {
      name: "Schedule history",
      href: "/schedule-history",
      icon: Calendar,
    },*/
  ]
  
  return (
    <nav className={styles.nav}>
      <h1 className={styles.title} hidden>Schedule planner</h1>
      <ul className={styles.list}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href} className={styles.item}>
              <Link
                href={item.href}
                className={cn(styles.link, { [styles.active]: isActive })}
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