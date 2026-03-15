"use client"

import Link from "next/link"
import { Home, Search, Heart, MessageCircle, PlusSquare, User } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Navbar() {
  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden h-16 border-b border-border bg-background md:block">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
            Pictura
          </Link>

          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search"
              className="h-9 bg-secondary pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-1"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <Link href="/" className="text-foreground transition-opacity hover:opacity-60">
              <Home className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Link>
            <button className="text-foreground transition-opacity hover:opacity-60">
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Messages</span>
            </button>
            <button className="text-foreground transition-opacity hover:opacity-60">
              <PlusSquare className="h-6 w-6" />
              <span className="sr-only">Create</span>
            </button>
            <button className="text-foreground transition-opacity hover:opacity-60">
              <Heart className="h-6 w-6" />
              <span className="sr-only">Notifications</span>
            </button>
            <Link href="/" className="text-foreground transition-opacity hover:opacity-60">
              <User className="h-6 w-6" />
              <span className="sr-only">Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          Pictura
        </Link>
        <div className="flex items-center gap-4">
          <button className="text-foreground transition-opacity hover:opacity-60">
            <Heart className="h-6 w-6" />
          </button>
          <button className="text-foreground transition-opacity hover:opacity-60">
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border bg-background md:hidden">
        <Link href="/" className="flex flex-col items-center text-foreground">
          <Home className="h-6 w-6" />
        </Link>
        <button className="flex flex-col items-center text-foreground">
          <Search className="h-6 w-6" />
        </button>
        <button className="flex flex-col items-center text-foreground">
          <PlusSquare className="h-6 w-6" />
        </button>
        <Link href="/" className="flex flex-col items-center text-foreground">
          <User className="h-6 w-6" />
        </Link>
      </nav>
    </>
  )
}
