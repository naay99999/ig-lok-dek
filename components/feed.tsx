"use client"

import { useEffect, useEffectEvent, useState } from "react"
import { Info, Loader2 } from "lucide-react"

import { PostCard } from "@/components/post-card"
import { Stories } from "@/components/stories"
import { PostCardSkeleton } from "@/components/skeletons"
import { VisitorSessionGate } from "@/components/visitor-session-gate"
import { posts } from "@/lib/mock-data"

export function Feed() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [sessionNotice, setSessionNotice] = useState<string | null>(null)
  const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, 3))
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useEffectEvent(() => {
    if (displayedPosts.length >= posts.length) {
      setHasMore(false)
      return
    }

    setIsLoadingMore(true)

    window.setTimeout(() => {
      const nextPosts = posts.slice(0, displayedPosts.length + 2)
      setDisplayedPosts(nextPosts)
      setIsLoadingMore(false)

      if (nextPosts.length >= posts.length) {
        setHasMore(false)
      }
    }, 1000)
  })

  useEffect(() => {
    if (!isUnlocked) {
      return
    }

    const handleScroll = () => {
      if (isLoadingMore || !hasMore) {
        return
      }

      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasMore, isLoadingMore, isUnlocked])

  if (!isUnlocked) {
    return (
      <VisitorSessionGate
        onNoticeChange={setSessionNotice}
        onReady={() => {
          setIsUnlocked(true)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col">
      <Stories />

      {sessionNotice ? (
        <div className="mx-auto mt-4 flex w-full max-w-[470px] items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{sessionNotice}</p>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[470px] flex-col gap-4 pt-4">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {isLoadingMore ? (
        <div className="mx-auto flex max-w-[470px] flex-col gap-4 pt-4">
          <PostCardSkeleton />
        </div>
      ) : null}

      {!hasMore ? (
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
          <p className="text-sm font-medium">Preview complete</p>
          <p className="text-xs">You&apos;ve reached the end of the mock feed.</p>
        </div>
      ) : null}

      {hasMore && !isLoadingMore ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : null}
    </div>
  )
}
