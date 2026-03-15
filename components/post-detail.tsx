"use client"

import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { CommentList } from "@/components/comment-list"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/mock-data"

interface PostDetailProps {
  post: Post
}

export function PostDetail({ post }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false)
  const [isSaved, setIsSaved] = useState(post.isSaved ?? false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [commentText, setCommentText] = useState("")

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      // In a real app, this would add the comment to the database
      setCommentText("")
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Desktop layout */}
      <div className="hidden md:flex md:h-[600px] md:overflow-hidden md:rounded-lg md:border md:border-border md:bg-background">
        {/* Image */}
        <div className="relative flex-1 bg-black">
          <Image
            src={post.image}
            alt={`Post by ${post.user.username}`}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
          />
        </div>

        {/* Comments panel */}
        <div className="flex w-[340px] flex-col border-l border-border">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user.avatar} alt={post.user.username} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                  {post.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-foreground">{post.user.username}</span>
            </div>
            <button className="text-foreground transition-opacity hover:opacity-60">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-4">
            <CommentList
              comments={post.comments}
              caption={post.caption}
              username={post.user.username}
              userAvatar={post.user.avatar}
              timestamp={post.timestamp}
            />
          </div>

          {/* Actions */}
          <div className="border-t border-border">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Heart
                    className={cn(
                      "h-6 w-6 transition-colors",
                      isLiked ? "fill-red-500 text-red-500" : "text-foreground"
                    )}
                  />
                </button>
                <button className="transition-transform hover:scale-110">
                  <MessageCircle className="h-6 w-6 text-foreground" />
                </button>
                <button className="transition-transform hover:scale-110">
                  <Send className="h-6 w-6 text-foreground" />
                </button>
              </div>
              <button
                onClick={handleSave}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Bookmark
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isSaved ? "fill-foreground text-foreground" : "text-foreground"
                  )}
                />
              </button>
            </div>
            <p className="px-3 pb-2 text-sm font-semibold text-foreground">
              {likesCount.toLocaleString()} likes
            </p>
            <time className="block px-3 pb-3 text-[10px] uppercase tracking-wide text-muted-foreground">
              {post.timestamp}
            </time>
          </div>

          {/* Comment input */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-3 border-t border-border p-3">
            <button type="button" className="text-foreground">
              <Smile className="h-6 w-6" />
            </button>
            <Input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={cn(
                "text-sm font-semibold transition-opacity",
                commentText.trim() ? "text-primary" : "text-primary/40"
              )}
            >
              Post
            </button>
          </form>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.user.avatar} alt={post.user.username} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                {post.user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-foreground">{post.user.username}</span>
          </div>
          <button className="text-foreground transition-opacity hover:opacity-60">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Image */}
        <div className="relative aspect-square w-full bg-black">
          <Image
            src={post.image}
            alt={`Post by ${post.user.username}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Actions */}
        <div className="bg-background">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Heart
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isLiked ? "fill-red-500 text-red-500" : "text-foreground"
                  )}
                />
              </button>
              <button className="transition-transform hover:scale-110">
                <MessageCircle className="h-6 w-6 text-foreground" />
              </button>
              <button className="transition-transform hover:scale-110">
                <Send className="h-6 w-6 text-foreground" />
              </button>
            </div>
            <button
              onClick={handleSave}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Bookmark
                className={cn(
                  "h-6 w-6 transition-colors",
                  isSaved ? "fill-foreground text-foreground" : "text-foreground"
                )}
              />
            </button>
          </div>
          <p className="px-3 pb-2 text-sm font-semibold text-foreground">
            {likesCount.toLocaleString()} likes
          </p>
        </div>

        {/* Comments section */}
        <div className="border-t border-border bg-background p-4">
          <CommentList
            comments={post.comments}
            caption={post.caption}
            username={post.user.username}
            userAvatar={post.user.avatar}
            timestamp={post.timestamp}
          />
        </div>

        {/* Comment input */}
        <div className="sticky bottom-14 border-t border-border bg-background">
          <form onSubmit={handleSubmitComment} className="flex items-center gap-3 p-3">
            <button type="button" className="text-foreground">
              <Smile className="h-6 w-6" />
            </button>
            <Input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={cn(
                "text-sm font-semibold transition-opacity",
                commentText.trim() ? "text-primary" : "text-primary/40"
              )}
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
