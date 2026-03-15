"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { users } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface StoryAvatarProps {
  username: string
  avatar: string
  hasStory?: boolean
}

function StoryAvatar({ username, avatar, hasStory = true }: StoryAvatarProps) {
  return (
    <button className="flex flex-col items-center gap-1">
      <div className="relative">
        <div
          className={cn(
            "flex h-[92px] w-[92px] items-center justify-center rounded-full p-[3px]",
            hasStory
              ? "bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-500"
              : "bg-transparent"
          )}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-background p-[2px]">
            <Avatar className="h-[80px] w-[80px]">
              <AvatarImage src={avatar} alt={username} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <span className="w-[58px] truncate text-center text-xs text-foreground">
        {username}
      </span>
    </button>
  )
}

export function Stories() {
  return (
    <div className="py-2">
      <ScrollArea className="w-full">
        <div className="flex gap-4 px-1">
          {users.map((user) => (
            <StoryAvatar
              key={user.id}
              username={user.username}
              avatar={user.avatar}
              hasStory={user.hasStory}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}