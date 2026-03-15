"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { PostDetail } from "@/components/post-detail"
import { PostDetailSkeleton } from "@/components/skeletons"
import { getPostById } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"

interface PostPageProps {
  params: Promise<{ id: string }>
}

export default function PostPage({ params }: PostPageProps) {
  const { id } = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const post = getPostById(id)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!post && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[calc(100vh-56px)] items-center justify-center pb-16 pt-14 md:pb-8 md:pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">Post not found</h1>
            <p className="mt-2 text-muted-foreground">This post may have been deleted or the link is incorrect.</p>
            <Link 
              href="/" 
              className="mt-4 inline-block text-primary underline-offset-4 hover:underline"
            >
              Return to feed
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Back button - mobile only */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b border-border bg-background px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <span className="flex-1 text-center font-semibold text-foreground">Photo</span>
        <div className="w-6" /> {/* Spacer for centering */}
      </div>

      {/* Main content */}
      <main className="pb-16 pt-14 md:pb-8 md:pt-20">
        <div className="px-0 md:px-4">
          {isLoading ? (
            <PostDetailSkeleton />
          ) : post ? (
            <PostDetail post={post} />
          ) : null}
        </div>
      </main>
    </div>
  )
}
