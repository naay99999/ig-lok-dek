import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "maplibre-gl/dist/maplibre-gl.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "Visitor Sessions Demo",
  description: "Consent-based visitor session capture with an internal review dashboard.",
  generator: "Codex",
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
