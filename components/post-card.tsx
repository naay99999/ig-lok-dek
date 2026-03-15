"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/mock-data"

interface PostCardProps {
  post: Post
}

function formatCount(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K"
  }
  return num.toString()
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false)
  const [isSaved, setIsSaved] = useState(post.isSaved ?? false)
  const [likesCount, setLikesCount] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  return (
    <article className="bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-500 p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background p-[1px]">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user.avatar} alt={post.user.username} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                  {post.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">{post.user.username}</span>
              {post.isVerified && (
                <BadgeCheck className="h-4 w-4 fill-primary text-primary-foreground" />
              )}
              <span className="text-sm text-muted-foreground">· {post.timestamp}</span>
            </div>
            {post.location && (
              <span className="text-xs text-foreground">{post.location}</span>
            )}
          </div>
        </div>
        <button className="text-foreground transition-opacity hover:opacity-60">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </button>
      </div>

      {/* Image */}
      <Link href={`/post/${post.id}`}>
        <div className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-sm bg-muted">
          <Image
            src={post.image}
            alt={`Post by ${post.user.username}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 470px"
          />
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between px-1 pt-3">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="transition-transform hover:scale-110 active:scale-95"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={cn(
                "h-6 w-6 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-foreground"
              )}
            />
          </button>
          <Link href={`/post/${post.id}`} className="flex items-center gap-1 transition-transform hover:scale-110">
            <MessageCircle className="h-6 w-6 text-foreground" />
            {post.comments.length > 0 && (
              <span className="text-sm text-foreground">{formatCount(post.comments.length * 800)}</span>
            )}
            <span className="sr-only">Comment</span>
          </Link>
          <button className="transition-transform hover:scale-110">
            <Send className="h-6 w-6 text-foreground" />
            <span className="sr-only">Share</span>
          </button>
        </div>
        <button
          onClick={handleSave}
          className="transition-transform hover:scale-110 active:scale-95"
          aria-label={isSaved ? "Unsave" : "Save"}
        >
          <Bookmark
            className={cn(
              "h-6 w-6 transition-colors",
              isSaved ? "fill-foreground text-foreground" : "text-foreground"
            )}
          />
        </button>
      </div>

      {/* Caption */}
      <div className="px-1 pt-2">
        <p className="text-sm text-foreground">
          <span className="font-semibold">{post.user.username}</span>
          {post.isVerified && (
            <BadgeCheck className="ml-1 inline h-4 w-4 fill-primary text-primary-foreground" />
          )}
          {" "}
          <span className="text-foreground">{post.caption}</span>
        </p>
      </div>

      {/* See translation link */}
      <div className="px-1 pt-1">
        <button className="text-sm font-medium text-muted-foreground hover:text-foreground">
          See translation
        </button>
      </div>
    </article>
  )
}
