"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Bell,
  Compass,
  FolderKanban,
  Home,
  LayoutGrid,
  type LucideIcon,
  Menu,
  MessageCircle,
  Search,
  ShieldEllipsis,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/mock-data"

const navItems = [
  { icon: Home, label: "Home", href: "/", filled: true },
  { icon: FolderKanban, label: "Collections", href: "#" },
  { icon: MessageCircle, label: "Messages", href: "#" },
  { icon: Search, label: "Search", href: "#" },
  { icon: Compass, label: "Explore", href: "#" },
  { icon: Bell, label: "Alerts", href: "#", dot: true },
  { icon: ShieldEllipsis, label: "Dashboard", href: "/dashboard" },
]

const bottomItems = [
  { icon: Menu, label: "More" },
  { icon: LayoutGrid, label: "Workspaces" },
]

function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  isExpanded,
  dot,
  filled,
  children,
}: {
  icon?: LucideIcon
  label: string
  href?: string
  isActive?: boolean
  isExpanded: boolean
  dot?: boolean
  filled?: boolean
  children?: ReactNode
}) {
  const content = (
    <>
      <div className="relative flex shrink-0 items-center justify-center pointer-events-none">
        {Icon ? (
          <Icon
            className={cn("h-6 w-6", isActive && filled && "fill-foreground")}
            strokeWidth={isActive ? 2.4 : 1.7}
          />
        ) : null}
        {children}
        {dot ? (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-red-500" />
        ) : null}
      </div>
      <span
        className={cn(
          "ml-4 overflow-hidden whitespace-nowrap transition-all duration-300",
          isExpanded ? "w-auto opacity-100" : "w-0 opacity-0",
        )}
      >
        {label}
      </span>
    </>
  )

  const classes = cn(
    "flex w-full items-center rounded-xl px-3 py-2 text-left transition-colors hover:bg-accent",
    isActive && "font-semibold",
  )

  return href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <button className={classes}>{content}</button>
  )
}

export function LeftSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-full flex-col justify-between border-r border-border/60 bg-background/95 px-3 py-6 backdrop-blur md:flex",
        isExpanded ? "w-[220px]" : "w-[74px]",
      )}
    >
      <div className="space-y-10">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldEllipsis className="h-5 w-5" />
          </div>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              isExpanded ? "w-auto opacity-100" : "w-0 opacity-0",
            )}
          >
            <p className="text-sm font-semibold tracking-wide">Session Lab</p>
            <p className="text-xs text-muted-foreground">Consent-first demo</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.label}
              {...item}
              isActive={pathname === item.href}
              isExpanded={isExpanded}
            />
          ))}

          <SidebarItem href="#" label="Profile" isExpanded={isExpanded}>
            <Avatar className="h-6 w-6">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback className="text-[10px]">
                {currentUser.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </SidebarItem>
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        {bottomItems.map((item) => (
          <SidebarItem key={item.label} {...item} isExpanded={isExpanded} />
        ))}
      </div>
    </aside>
  )
}
