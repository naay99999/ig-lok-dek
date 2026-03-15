"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/post-card"
import { Stories } from "@/components/stories"
import { FeedSkeleton, PostCardSkeleton } from "@/components/skeletons"
import { posts } from "@/lib/mock-data"
import { Loader2 } from "lucide-react"

export function Feed() {
  const [isLoading, setIsLoading] = useState(true)
  const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, 3))
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !hasMore) return

      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Load more when user scrolls to bottom (with 200px threshold)
      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoadingMore, hasMore, displayedPosts])

  const loadMore = () => {
    if (displayedPosts.length >= posts.length) {
      setHasMore(false)
      return
    }

    setIsLoadingMore(true)
    // Simulate network delay
    setTimeout(() => {
      const nextPosts = posts.slice(0, displayedPosts.length + 2)
      setDisplayedPosts(nextPosts)
      setIsLoadingMore(false)
      if (nextPosts.length >= posts.length) {
        setHasMore(false)
      }
    }, 1000)
  }

  if (isLoading) {
    return <FeedSkeleton />
  }

  return (
    <div className="flex flex-col">
      <Stories />
      <div className="max-w-[470px] flex mx-auto flex-col gap-4 pt-4">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Loading indicator */}
      {isLoadingMore && (
        <div className="flex flex-col ">
          <PostCardSkeleton />
        </div>
      )}

      {/* End of feed indicator */}
      {!hasMore && (
        <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-muted-foreground">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm font-medium">You&apos;re all caught up</p>
          <p className="text-xs">You&apos;ve seen all new posts</p>
        </div>
      )}

      {/* Loading spinner for infinite scroll */}
      {hasMore && !isLoadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
