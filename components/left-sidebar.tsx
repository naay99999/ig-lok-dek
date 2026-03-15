"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Compass,
  Heart,
  Home,
  Instagram,
  LayoutGrid,
  type LucideIcon,
  Menu,
  PlaySquare,
  Plus,
  Search,
  Send,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/mock-data"

const navItems = [
  { icon: Home, label: "Home", href: "/", filled: true },
  { icon: PlaySquare, label: "Reels", href: "#" },
  { icon: Send, label: "Messages", href: "#" },
  { icon: Search, label: "Search", href: "#" },
  { icon: Compass, label: "Explore", href: "#" },
  { icon: Heart, label: "Notifications", href: "#", dot: true },
  { icon: Plus, label: "Create", href: "#" },
]

const bottomItems = [
  { icon: Menu, label: "More" },
  { icon: LayoutGrid, label: "Also from Meta" },
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
      <div className="pointer-events-none relative flex shrink-0 items-center justify-center">
        {Icon ? (
          <Icon
            className={cn("h-6 w-6", isActive && filled && "fill-foreground")}
            strokeWidth={isActive ? 2.5 : 1.5}
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
    "flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent",
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
        "fixed left-0 top-0 z-40 hidden h-full flex-col justify-between bg-background px-3 py-6 transition-all duration-300 ease-in-out md:flex",
        isExpanded ? "w-[220px]" : "w-[72px]",
      )}
      >
      <div className="space-y-10">
        <Link href="/" className="p-3 hover:bg-accent">
          <Instagram />
        </Link>

        <nav className="flex flex-col gap-3">
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
