"use client"

import { useRef, useState } from "react"
import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/session-context"
import type { ConsentStatus, SessionIngestPayload } from "@/lib/visitor-sessions"

function buildClientContext(): SessionIngestPayload["clientContext"] {
  const navigatorWithUAData = navigator as Navigator & {
    userAgentData?: {
      platform?: string
    }
  }

  return {
    locale: navigator.language || "en-US",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    referrer: document.referrer || "",
    platform:
      navigatorWithUAData.userAgentData?.platform ||
      navigator.platform ||
      "unknown",
  }
}

function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    })
  })
}

async function requestPreciseLocation() {
  let lastError: GeolocationPositionError | null = null

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await getCurrentPosition()
    } catch (error) {
      lastError = error as GeolocationPositionError

      if (
        lastError.code === lastError.PERMISSION_DENIED ||
        lastError.code === lastError.POSITION_UNAVAILABLE
      ) {
        break
      }
    }
  }

  throw lastError
}

export function VisitorSessionGate() {
  const { isSessionReady, markSessionReady } = useSession()
  const [isRequesting, setIsRequesting] = useState(false)
  const hasSubmittedRef = useRef(false)

  const submitSession = async (
    consentStatus: ConsentStatus,
    coords?: SessionIngestPayload["coords"]
  ) => {
    if (hasSubmittedRef.current) return
    hasSubmittedRef.current = true

    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consentStatus,
          coords,
          clientContext: buildClientContext(),
        } satisfies SessionIngestPayload),
      })
    } catch {
      // Silently fail - session save is not critical
    }

    markSessionReady()
  }

  const handleAllow = async () => {
    if (!("geolocation" in navigator)) {
      await submitSession("unsupported")
      return
    }

    setIsRequesting(true)

    try {
      const position = await requestPreciseLocation()
      await submitSession("granted", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracyMeters: position.coords.accuracy,
      })
    } catch (error) {
      const locationError = error as GeolocationPositionError | null
      if (locationError?.code === locationError?.PERMISSION_DENIED) {
        await submitSession("denied")
      } else {
        await submitSession("timeout")
      }
    }
  }

  const handleSkip = () => {
    const supported = "geolocation" in navigator
    void submitSession(supported ? "denied" : "unsupported")
  }

  if (isSessionReady) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 rounded-2xl bg-background p-6 shadow-xl duration-200 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600">
            <MapPin className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Allow location access?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This helps personalize your experience
          </p>
        </div>

        <Button
          className="w-full rounded-xl bg-[#0095F6] py-6 text-base font-semibold text-white hover:bg-[#1877F2]"
          onClick={() => void handleAllow()}
          disabled={isRequesting}
        >
          {isRequesting ? "Requesting..." : "Allow"}
        </Button>

        <button
          type="button"
          className="mt-4 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          onClick={handleSkip}
          disabled={isRequesting}
        >
          Continue without location
        </button>
      </div>
    </div>
  )
}
