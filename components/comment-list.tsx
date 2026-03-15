"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Comment } from "@/lib/mock-data"

interface CommentItemProps {
  comment: Comment
}

function CommentItem({ comment }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="flex gap-3 group">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={comment.user.avatar} alt={comment.user.username} className="object-cover" />
        <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
          {comment.user.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-semibold">{comment.user.username}</span>{" "}
          {comment.text}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{comment.timestamp}</span>
          <button className="font-semibold transition-colors hover:text-foreground">
            {comment.likes} likes
          </button>
          <button className="font-semibold transition-colors hover:text-foreground">
            Reply
          </button>
        </div>
      </div>
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="shrink-0 self-start pt-1 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Heart
          className={cn(
            "h-3 w-3 transition-colors",
            isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )}
        />
      </button>
    </div>
  )
}

interface CommentListProps {
  comments: Comment[]
  caption?: string
  username?: string
  userAvatar?: string
  timestamp?: string
}

export function CommentList({ 
  comments, 
  caption, 
  username, 
  userAvatar,
  timestamp 
}: CommentListProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Caption as first comment */}
      {caption && username && userAvatar && (
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={userAvatar} alt={username} className="object-cover" />
            <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{username}</span>{" "}
              {caption}
            </p>
            {timestamp && (
              <p className="mt-1 text-xs text-muted-foreground">{timestamp}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Comments */}
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
