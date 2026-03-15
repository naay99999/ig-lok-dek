"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function StoriesSkeleton() {
  return (
    <div className="py-2">
      <div className="flex gap-4 overflow-hidden px-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Skeleton className="h-[92px] w-[92px] rounded-full" />
            <Skeleton className="h-3 w-[58px]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <article className="border-b border-border bg-background pb-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-5" />
      </div>

      {/* Image */}
      <Skeleton className="aspect-square w-full rounded-sm" />

      {/* Actions */}
      <div className="flex items-center justify-between px-1 pt-3">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-6" />
        </div>
        <Skeleton className="h-6 w-6" />
      </div>

      {/* Caption */}
      <div className="px-1 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-3/4" />
      </div>

      {/* See translation */}
      <div className="px-1 pt-1">
        <Skeleton className="h-3 w-20" />
      </div>
    </article>
  )
}

export function FeedSkeleton() {
  return (
    <div className="flex flex-col">
      <StoriesSkeleton />
      <div className="flex flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function PostDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Desktop layout */}
      <div className="hidden md:flex md:h-[600px] md:overflow-hidden md:rounded-lg md:border md:border-border md:bg-background">
        {/* Image */}
        <div className="flex-1">
          <Skeleton className="h-full w-full" />
        </div>
        {/* Comments panel */}
        <div className="flex w-[340px] flex-col border-l border-border">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border p-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          {/* Comments */}
          <div className="flex-1 space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
          {/* Input */}
          <div className="border-t border-border p-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
