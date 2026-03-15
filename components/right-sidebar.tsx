"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { currentUser, users } from "@/lib/mock-data"
import { RightSidebarSkeleton } from "@/components/skeletons"

const mutualCounts = [3, 5, 2, 8, 4]
const suggestedUsers = users.slice(0, 5).map((user, index) => ({
  ...user,
  followedBy: index % 2 === 0 ? "alex_photo" : "sarah.designs",
  mutualCount: mutualCounts[index],
}))

const footerLinks = [
  "About",
  "Help",
  "Press",
  "API",
  "Jobs",
  "Privacy",
  "Terms",
  "Locations",
  "Language",
  "Meta Verified",
]

export function RightSidebar() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <RightSidebarSkeleton />
  }

  return (
    <aside className="hidden w-[320px] shrink-0 pt-8 xl:block">
      {/* Current user profile */}
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
            <span className="text-sm text-muted-foreground">Your Name</span>
          </div>
        </Link>
        <button className="text-xs font-semibold text-primary hover:text-foreground">
          Switch
        </button>
      </div>

      {/* Suggested for you */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            Suggested for you
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
                    Followed by {user.followedBy} + {user.mutualCount}
                  </span>
                </div>
              </Link>
              <button className="text-xs font-semibold text-primary hover:text-foreground">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
          {footerLinks.map((link, index) => (
            <span key={link} className="text-xs text-muted-foreground/60">
              <Link href="#" className="hover:underline">
                {link}
              </Link>
              {index < footerLinks.length - 1 && " · "}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground/60">
          © 2026 Instagram from Meta
        </p>
      </div>
    </aside>
  )
}
