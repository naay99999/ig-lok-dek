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
      <div className="lg:pl-[72px]">
        <main className="mx-auto flex max-w-[935px] justify-center pb-16 pt-14 lg:pb-8 lg:pt-0">
          {/* Feed column */}
          <div className="w-full max-w-[470px] px-0 lg:px-0 lg:pt-8">
            <Feed />
            <Footer />
          </div>

          {/* Right Sidebar - Desktop XL only */}
          <RightSidebar />
        </main>
      </div>

      {/* Floating Messages Button */}
      <MessagesButton />
    </div>
  )
}
