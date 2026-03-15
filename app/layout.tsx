import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "maplibre-gl/dist/maplibre-gl.css"
import "./globals.css"

import { SessionProvider } from "@/lib/session-context"
import { VisitorSessionGate } from "@/components/visitor-session-gate"

export const metadata: Metadata = {
  title: "Instagram",
  description:
    "Create an account or log in to Instagram. Share what you're into with the people who get you.",
  generator: "Instagram",
  icons: {
    icon: [
      {
        url: "/instagram-icon.svg",
        type: "image/svg+xml",
      },
      { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/instagram-icon.svg", type: "image/svg+xml" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>
          {children}
          <VisitorSessionGate />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
