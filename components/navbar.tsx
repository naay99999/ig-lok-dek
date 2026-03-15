"use client"

import Link from "next/link"
import {
  Bell,
  Compass,
  Home,
  SearchIcon,
  ShieldEllipsis,
  SquareStack,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { currentUser } from "@/lib/mock-data"

export function MobileNavbar() {
  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldEllipsis className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">Session Lab</p>
            <p className="text-xs text-muted-foreground">Consent-first demo</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <InputGroup className="h-10 rounded-full border-none bg-accent/70 px-2 shadow-none">
            <InputGroupAddon>
              <SearchIcon className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search sessions" />
          </InputGroup>
          <button className="relative text-foreground transition-opacity hover:opacity-60">
            <Bell className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
              2
            </span>
          </button>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
        <Link href="/" className="flex flex-col items-center text-foreground">
          <Home className="h-6 w-6 fill-foreground" />
        </Link>
        <button className="flex flex-col items-center text-foreground">
          <Compass className="h-6 w-6" />
        </button>
        <Link href="/dashboard" className="flex flex-col items-center text-foreground">
          <ShieldEllipsis className="h-6 w-6" />
        </Link>
        <button className="flex flex-col items-center text-foreground">
          <SquareStack className="h-6 w-6" />
        </button>
        <Link href="#" className="flex flex-col items-center">
          <Avatar className="h-7 w-7 ring-2 ring-foreground">
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
            <AvatarFallback>
              {currentUser.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </nav>
    </>
  )
}
