"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function StoriesSkeleton() {
  return (
    <div className="py-2">
      <div className="flex gap-4 overflow-hidden px-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            {/*
              Real: StoryAvatar container = h-[92px] w-[92px] (gradient ring)
              ก่อนหน้า: h-[58px] w-[58px] — เล็กกว่าจริง 34px
            */}
            <Skeleton className="h-[92px] w-[92px] rounded-full" />
            {/*
              Real: username truncate w-[58px]
              ก่อนหน้า: w-12 (48px) — เล็กกว่านิดหน่อย
            */}
            <Skeleton className="h-3 w-[58px]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <article className="bg-background w-[470px]">
      {/* Header — matches PostCard px-1 py-3 */}
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-3">
          {/*
            Real: gradient ring container h-10 w-10 (40px) > Avatar h-8 w-8 (32px)
            ก่อนหน้า: h-9 w-9 (36px) — ไม่ตรงกับ outer container
          */}
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-1">
            {/* username + verified + timestamp row */}
            <Skeleton className="h-4 w-32" />
            {/* location (optional) — ใช้ขนาดเล็กลง */}
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        {/* MoreHorizontal h-5 w-5 */}
        <Skeleton className="h-5 w-5" />
      </div>

      {/* Image — aspect-square, rounded-sm matches real */}
      <Skeleton className="aspect-square w-full rounded-sm" />

      {/* Actions — matches PostCard px-1 pt-3 */}
      <div className="flex items-center justify-between px-1 pt-3">
        <div className="flex items-center gap-4">
          {/* Heart h-6 w-6 */}
          <Skeleton className="h-6 w-6" />
          {/*
            Real: MessageCircle h-6 w-6 + count text beside it
            skeleton รวมทั้ง icon + text ไว้ใน w-16
          */}
          <Skeleton className="h-6 w-16" />
          {/* Send h-6 w-6 */}
          <Skeleton className="h-6 w-6" />
        </div>
        {/* Bookmark h-6 w-6 */}
        <Skeleton className="h-6 w-6" />
      </div>

      {/*
        Likes count — real มี <p> "X likes" ระหว่าง actions กับ caption
        ก่อนหน้า: ขาด section นี้ไปทั้งหมด
      */}
      <div className="px-1 pt-2">
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Caption — matches PostCard px-1 pt-2 */}
      <div className="px-1 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-3/4" />
      </div>

      {/* See translation — matches PostCard px-1 pt-1 */}
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
      {/* matches Feed: max-w-[470px] mx-auto gap-4 pt-4 */}
      <div className="max-w-[470px] flex mx-auto flex-col gap-4 pt-4">
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
      {/* Desktop layout — matches PostDetail exactly */}
      <div className="hidden md:flex md:h-[600px] md:overflow-hidden md:rounded-lg md:border md:border-border md:bg-background">
        {/* Image side */}
        <div className="relative flex-1 bg-black">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Comments panel — w-[340px] matches real */}
        <div className="flex w-[340px] flex-col border-l border-border">
          {/* Header — matches PostDetail p-4 border-b, justify-between */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              {/* Avatar h-8 w-8 matches real */}
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            {/* MoreHorizontal h-5 w-5 */}
            <Skeleton className="h-5 w-5" />
          </div>

          {/* Comments list — flex-1 overflow-y-auto p-4, gap-4 matches CommentList */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                {/* Comment avatar h-8 w-8 matches CommentItem */}
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-2/3" />
                  {/* timestamp + likes + reply row */}
                  <Skeleton className="mt-1 h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>

          {/* Actions + likes + timestamp section */}
          <div className="border-t border-border">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="h-6 w-6" />
            </div>
            {/* likes count text */}
            <div className="px-3 pb-2">
              <Skeleton className="h-4 w-28" />
            </div>
            {/* timestamp */}
            <div className="px-3 pb-3">
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* Comment input — matches real border-t p-3 */}
          <div className="flex items-center gap-3 border-t border-border p-3">
            {/* Smile icon h-6 w-6 */}
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 flex-1" />
            {/* Post button */}
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        {/*
          Real: มี header bar (avatar + username + more) ก่อน image
          ก่อนหน้า: ขาด section นี้ไปทั้งหมด
        */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-5 w-5" />
        </div>

        {/* Image — aspect-square matches real */}
        <div className="relative aspect-square w-full bg-black">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Actions section — matches real bg-background */}
        <div className="bg-background">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="h-6 w-6" />
          </div>
          {/* likes count */}
          <div className="px-3 pb-2">
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Comments section — matches real border-t p-4 */}
        <div className="flex flex-col gap-4 border-t border-border bg-background p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-2/3" />
                <Skeleton className="mt-1 h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* Comment input — sticky bottom-14 matches real */}
        <div className="sticky bottom-14 border-t border-border bg-background">
          <div className="flex items-center gap-3 p-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}