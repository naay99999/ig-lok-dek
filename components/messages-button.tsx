"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { users } from "@/lib/mock-data"

export function MessagesButton() {
  const recentUsers = users.slice(0, 3)

  return (
    <button className="fixed bottom-6 right-6 z-50 hidden items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 shadow-lg transition-shadow hover:shadow-xl lg:flex">
      {/* Notification badge */}
      <div className="relative">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
          5
        </span>
      </div>

      <span className="text-sm font-semibold text-foreground">Messages</span>

      {/* Recent users avatars */}
      <div className="flex -space-x-2">
        {recentUsers.map((user, index) => (
          <Avatar
            key={user.id}
            className="h-6 w-6 border-2 border-background"
            style={{ zIndex: recentUsers.length - index }}
          >
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="text-[8px]">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </button>
  )
}
