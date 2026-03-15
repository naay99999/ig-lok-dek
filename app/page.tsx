import { Navbar } from "@/components/navbar"
import { Feed } from "@/components/feed"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main content */}
      <main className="pb-16 pt-14 md:pb-8 md:pt-16">
        <div className="mx-auto max-w-[470px] px-0 md:px-4">
          <Feed />
        </div>
      </main>
    </div>
  )
}
