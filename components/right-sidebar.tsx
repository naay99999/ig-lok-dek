"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { RightSidebarSkeleton } from "@/components/skeletons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { currentUser, users } from "@/lib/mock-data"

const highlightCards = [
  {
    title: "Consent-first capture",
    copy: "Location is requested only after an explicit visitor action.",
  },
  {
    title: "Essential telemetry only",
    copy: "Locale, timezone, viewport, referrer, and coarse network headers.",
  },
  {
    title: "Internal review dashboard",
    copy: "Protected by a shared 6-digit PIN with signed HTTP-only cookies.",
  },
]

const suggestedUsers = users.slice(0, 4).map((user, index) => ({
  ...user,
  role: index % 2 === 0 ? "Ops reviewer" : "Session analyst",
}))

export function RightSidebar() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <RightSidebarSkeleton />
  }

  return (
    <aside className="hidden w-[320px] shrink-0 pt-8 xl:block">
      <div className="rounded-[28px] border border-border/70 bg-background/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <Link href="#" className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback>
                {currentUser.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {currentUser.username}
              </span>
              <span className="text-sm text-muted-foreground">
                Internal reviewer
              </span>
            </div>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-primary hover:text-foreground"
          >
            Open dashboard
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {highlightCards.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/70 bg-muted/35 p-4"
            >
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {item.copy}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              Review team
            </span>
            <button className="text-xs font-semibold text-foreground hover:text-muted-foreground">
              See all
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <Link href="#" className="flex items-center gap-4">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {user.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <button className="text-xs font-semibold text-primary hover:text-foreground">
                  Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
