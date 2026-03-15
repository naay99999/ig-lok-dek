import Link from "next/link"
import { ChevronDown } from "lucide-react"

const footerLinks = [
  "Meta",
  "About",
  "Blog",
  "Jobs",
  "Help",
  "API",
  "Privacy",
  "Terms",
  "Locations",
  "Instagram Lite",
  "Meta AI",
  "Threads",
  "Contact Uploading & Non-Users",
  "Meta Verified",
]

export function Footer() {
  return (
    <footer className="hidden w-full py-6 lg:block">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {footerLinks.map((link) => (
            <Link
              key={link}
              href="#"
              className="text-xs text-muted-foreground/70 hover:underline"
            >
              {link}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-xs text-muted-foreground/70 hover:underline">
            English
            <ChevronDown className="h-3 w-3" />
          </button>
          <span className="text-xs text-muted-foreground/70">
            © 2026 Pictura from Example
          </span>
        </div>
      </div>
    </footer>
  )
}
