"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/mock-data"

interface PostCardProps {
  post: Post
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
    <article className="border-b border-border bg-background pb-4 md:rounded-lg md:border md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-500 p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background p-[1px]">
              <Avatar className="h-7 w-7">
                <AvatarImage src={post.user.avatar} alt={post.user.username} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                  {post.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{post.user.username}</span>
          </div>
        </div>
        <button className="text-foreground transition-opacity hover:opacity-60">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </button>
      </div>

      {/* Image */}
      <Link href={`/post/${post.id}`}>
        <div className="relative aspect-square w-full cursor-pointer overflow-hidden bg-muted">
          <Image
            src={post.image}
            alt={`Post by ${post.user.username}`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 470px"
          />
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between px-3 pt-3">
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
          <Link href={`/post/${post.id}`} className="transition-transform hover:scale-110">
            <MessageCircle className="h-6 w-6 text-foreground" />
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

      {/* Likes */}
      <div className="px-3 pt-2">
        <p className="text-sm font-semibold text-foreground">
          {likesCount.toLocaleString()} likes
        </p>
      </div>

      {/* Caption */}
      <div className="px-3 pt-1">
        <p className="text-sm text-foreground">
          <span className="font-semibold">{post.user.username}</span>{" "}
          <span className="text-foreground">{post.caption}</span>
        </p>
      </div>

      {/* Comments preview */}
      {post.comments.length > 0 && (
        <div className="px-3 pt-1">
          <Link
            href={`/post/${post.id}`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all {post.comments.length} comments
          </Link>
          <div className="mt-1">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{post.comments[0].user.username}</span>{" "}
              {post.comments[0].text}
            </p>
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="px-3 py-2">
        <time className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {post.timestamp}
        </time>
      </div>
    </article>
  )
}
