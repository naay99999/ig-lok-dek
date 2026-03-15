"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/mock-data"
import {
  Home,
  Search,
  Compass,
  PlaySquare,
  Heart,
  Plus,
  Menu,
  LayoutGrid,
  Send,
  Instagram,
} from "lucide-react"

// --- Configuration ---
const navItems = [
  { icon: Home, label: "Home", href: "/", filled: true },
  { icon: PlaySquare, label: "Reels", href: "#" },
  { icon: Send, label: "Messages", href: "#", badge: 6 },
  { icon: Search, label: "Search", href: "#" },
  { icon: Compass, label: "Explore", href: "#" },
  { icon: Heart, label: "Notifications", href: "#", dot: true },
  { icon: Plus, label: "Create", href: "#" },
]

const bottomItems = [
  { icon: Menu, label: "More" },
  { icon: LayoutGrid, label: "Also from Meta" },
]

// --- Reusable Sidebar Item Component ---
function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  isExpanded,
  badge,
  dot,
  filled,
  children
}) {
  const content = (
    <>
      <div className="relative flex items-center justify-center shrink-0 pointer-events-none">
        {Icon && (
          <Icon
            className={cn("h-6 w-6", isActive && filled && "fill-foreground")}
            strokeWidth={isActive ? 2.5 : 1.5}
          />
        )}
        {children}

        {badge && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 box-content items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-background">
            {badge}
          </span>
        )}
        {dot && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 box-content rounded-full bg-red-500 border-2 border-background" />
        )}
      </div>

      <span
        className={cn(
          "ml-4 overflow-hidden whitespace-nowrap transition-all duration-300",
          isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
        )}
      >
        {label}
      </span>
    </>
  )

  const containerClasses = cn(
    "flex items-center rounded-lg px-3 py-2 transition-colors hover:bg-accent w-full text-left",
    isActive && "font-semibold"
  )

  return href ? (
    <Link href={href} className={containerClasses}>
      {content}
    </Link>
  ) : (
    <button className={cn(containerClasses, "py-3")}>
      {content}
    </button>
  )
}

// --- Main Sidebar Component ---
export function LeftSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-full flex-col justify-between bg-background px-3 py-6 transition-all duration-300 ease-in-out md:flex",
        isExpanded ? "w-[220px]" : "w-[72px]"
      )}
    >
      {/* 1. Logo (จะอยู่ชิดขอบบน) */}
      <Link href="/" className="p-3 hover:bg-accent w-fit rounded-lg">
        <Instagram className="h16 w-6" />
      </Link>

      {/* 2. Nav Menu (จะอยู่ตรงกลางหน้าจอ) */}
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <SidebarItem
            key={item.label}
            {...item}
            isActive={pathname === item.href}
            isExpanded={isExpanded}
          />
        ))}

        {/* Profile Item */}
        <SidebarItem href="#" label="Profile" isExpanded={isExpanded}>
          <Avatar className="h-6 w-6">
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
            <AvatarFallback className="text-[10px]">
              {currentUser.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </SidebarItem>
      </nav>

      {/* 3. Bottom Section (จะอยู่ชิดขอบล่าง) */}
      <div className="flex flex-col gap-2">
        {bottomItems.map((item) => (
          <SidebarItem
            key={item.label}
            {...item}
            isExpanded={isExpanded}
          />
        ))}
      </div>
    </aside>
  )
}