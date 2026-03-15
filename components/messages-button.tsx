"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { users } from "@/lib/mock-data"
import { Send } from "lucide-react"

export function MessagesButton() {
  const recentUsers = users.slice(0, 3)

  return (
    <button className="fixed bottom-6 right-6 z-50 hidden items-center gap-4 rounded-full bg-white px-4 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)] lg:flex">
      {/* Notification badge */}
      <div className="relative">
        <Send className="w-6 h-6"/>
        <span className="absolute top-[-8px] right-[-8px] flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
          5
        </span>
      </div>

      <span className="text-normal font-semibold text-foreground">Messages</span>

      {/* Recent users avatars */}
      <div className="flex -space-x-2">
        {recentUsers.map((user, index) => (
          <Avatar
            key={user.id}
            className="h-8 w-8 border-2 border-background"
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
