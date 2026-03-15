import { Feed } from "@/components/feed"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { MobileNavbar } from "@/components/navbar"
import { MessagesButton } from "@/components/messages-button"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Left Sidebar - Desktop only */}
      <LeftSidebar />

      {/* Mobile Navigation */}
      <MobileNavbar />

      {/* Main content area */}
      <main className="flex mx-auto justify-center gap-0 md:gap-16 pb-16 pt-14 md:pb-8 md:pt-0">
        {/* Feed column */}
        <div className="w-full max-w-[630px] lg:pt-4">
          <Feed />
          <Footer />
        </div>

        {/* Right Sidebar - Desktop XL only */}
        <RightSidebar />
      </main>

      {/* Floating Messages Button */}
      <MessagesButton />
    </div>
  )
}
