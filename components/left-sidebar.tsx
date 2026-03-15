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
  Film,
  Heart,
  PlusSquare,
  Menu,
  LayoutGrid,
  MessageCircle,
} from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "/", filled: true },
  { icon: Film, label: "Reels", href: "#" },
  { icon: MessageCircle, label: "Messages", href: "#", badge: 6 },
  { icon: Search, label: "Search", href: "#" },
  { icon: Compass, label: "Explore", href: "#" },
  { icon: Heart, label: "Notifications", href: "#", dot: true },
  { icon: PlusSquare, label: "Create", href: "#" },
]

export function LeftSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-full flex-col border-r border-border bg-background px-3 py-6 transition-all duration-300 ease-in-out md:flex",
        isExpanded ? "w-[220px]" : "w-[72px]"
      )}
    >
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center px-3 py-3">
        <svg
          className="h-6 w-6 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="18" cy="6" r="1.5" fill="currentColor" />
        </svg>
        <span
          className={cn(
            "ml-4 overflow-hidden text-xl font-semibold tracking-tight transition-all duration-300",
            isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}
        >
          Pictura
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative flex items-center rounded-lg px-3 py-3 transition-colors hover:bg-accent",
                isActive && "font-semibold"
              )}
            >
              <div className="relative shrink-0">
                <item.icon
                  className={cn(
                    "h-6 w-6",
                    isActive && item.filled && "fill-foreground"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {item.badge && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
                {item.dot && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" />
                )}
              </div>
              <span
                className={cn(
                  "ml-4 overflow-hidden whitespace-nowrap transition-all duration-300",
                  isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Profile */}
        <Link
          href="#"
          className="group flex items-center rounded-lg px-3 py-3 transition-colors hover:bg-accent"
        >
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
            <AvatarFallback className="text-[10px]">
              {currentUser.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "ml-4 overflow-hidden whitespace-nowrap transition-all duration-300",
              isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
          >
            Profile
          </span>
        </Link>
      </nav>

      {/* Bottom section */}
      <div className="mt-auto flex flex-col gap-0.5">
        <button className="group flex items-center rounded-lg px-3 py-3 transition-colors hover:bg-accent">
          <Menu className="h-6 w-6 shrink-0" strokeWidth={1.5} />
          <span
            className={cn(
              "ml-4 overflow-hidden whitespace-nowrap transition-all duration-300",
              isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
          >
            More
          </span>
        </button>
        <button className="group flex items-center rounded-lg px-3 py-3 transition-colors hover:bg-accent">
          <LayoutGrid className="h-6 w-6 shrink-0" strokeWidth={1.5} />
          <span
            className={cn(
              "ml-4 overflow-hidden whitespace-nowrap transition-all duration-300",
              isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
          >
            Also from Meta
          </span>
        </button>
      </div>
    </aside>
  )
}
