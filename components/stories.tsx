"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { users, currentUser } from "@/lib/mock-data"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StoryAvatarProps {
  username: string
  avatar: string
  hasStory?: boolean
  isCurrentUser?: boolean
}

function StoryAvatar({ username, avatar, hasStory = true, isCurrentUser = false }: StoryAvatarProps) {
  return (
    <button className="flex flex-col items-center gap-1.5">
      <div className="relative">
        {/* Gradient border ring */}
        <div
          className={cn(
            "flex h-[66px] w-[66px] items-center justify-center rounded-full p-[2px]",
            hasStory && !isCurrentUser
              ? "bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-500"
              : "bg-transparent"
          )}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-background p-[2px]">
            <Avatar className="h-14 w-14">
              <AvatarImage src={avatar} alt={username} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        {/* Add story button for current user */}
        {isCurrentUser && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
            <Plus className="h-3 w-3" />
          </div>
        )}
      </div>
      <span className="w-16 truncate text-center text-xs text-foreground">
        {isCurrentUser ? "Your story" : username}
      </span>
    </button>
  )
}

export function Stories() {
  return (
    <div className="border-b border-border bg-background py-4 md:rounded-lg md:border">
      <ScrollArea className="w-full">
        <div className="flex gap-4 px-4">
          {/* Current user's story */}
          <StoryAvatar
            username={currentUser.username}
            avatar={currentUser.avatar}
            hasStory={false}
            isCurrentUser={true}
          />
          {/* Other users' stories */}
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
