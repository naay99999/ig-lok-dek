"use client"

import Link from "next/link"
import { Home, Search, Heart, MessageCircle, PlusSquare, Compass, Film } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { currentUser } from "@/lib/mock-data"

export function MobileNavbar() {
  return (
    <>
      {/* Mobile Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
          Pictura
        </Link>
        <div className="flex items-center gap-4">
          <button className="relative text-foreground transition-opacity hover:opacity-60">
            <Heart className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
              3
            </span>
          </button>
          <button className="relative text-foreground transition-opacity hover:opacity-60">
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
              5
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border bg-background lg:hidden">
        <Link href="/" className="flex flex-col items-center text-foreground">
          <Home className="h-6 w-6 fill-foreground" />
        </Link>
        <button className="flex flex-col items-center text-foreground">
          <Search className="h-6 w-6" />
        </button>
        <button className="flex flex-col items-center text-foreground">
          <PlusSquare className="h-6 w-6" />
        </button>
        <button className="flex flex-col items-center text-foreground">
          <Film className="h-6 w-6" />
        </button>
        <Link href="#" className="flex flex-col items-center">
          <Avatar className="h-7 w-7 ring-2 ring-foreground">
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
            <AvatarFallback>{currentUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
      </nav>
    </>
  )
}
