"use client"

import { useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  Loader2,
  LocateFixed,
  MapPinned,
} from "lucide-react"

import { FeedSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ConsentStatus, SessionIngestPayload } from "@/lib/visitor-sessions"

type GateStatus = "idle" | "requesting-location" | "saving-session"

interface VisitorSessionGateProps {
  onNoticeChange: (notice: string | null) => void
  onReady: () => void
}

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

export function VisitorSessionGate({
  onNoticeChange,
  onReady,
}: VisitorSessionGateProps) {
  const [status, setStatus] = useState<GateStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const hasUnlockedRef = useRef(false)
  const isMountedRef = useRef(true)
  const [geolocationSupported, setGeolocationSupported] = useState<
    boolean | null
  >(null)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (typeof navigator === "undefined") {
      return
    }

    setGeolocationSupported("geolocation" in navigator)
  }, [])

  const unlock = () => {
    if (hasUnlockedRef.current) {
      return
    }

    hasUnlockedRef.current = true
    onReady()
  }

  const submitSession = async (
    consentStatus: ConsentStatus,
    coords?: SessionIngestPayload["coords"],
  ) => {
    if (isMountedRef.current) {
      setStatus("saving-session")
      setErrorMessage(null)
    }
    onNoticeChange(null)

    const controller = new AbortController()
    const requestTimeout = window.setTimeout(() => controller.abort(), 4000)
    const unlockTimeout = window.setTimeout(() => {
      onNoticeChange("Opening the preview while the session save finishes.")
      unlock()
    }, 4500)

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consentStatus,
          coords,
          clientContext: buildClientContext(),
        } satisfies SessionIngestPayload),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error("Session save failed.")
      }

      window.clearTimeout(unlockTimeout)
      onNoticeChange(null)
      unlock()
    } catch {
      window.clearTimeout(unlockTimeout)
      onNoticeChange("We couldn't save this visit. The preview is still available.")
      unlock()
    } finally {
      window.clearTimeout(requestTimeout)
      if (isMountedRef.current) {
        setStatus("idle")
      }
    }
  }

  const handlePreciseLocation = async () => {
    if (geolocationSupported == null) {
      if (isMountedRef.current) {
        setErrorMessage("Checking whether precise location is available. Please try again.")
      }
      return
    }

    if (!geolocationSupported) {
      void submitSession("unsupported")
      return
    }

    if (isMountedRef.current) {
      setStatus("requesting-location")
      setErrorMessage(null)
    }

    try {
      const position = await requestPreciseLocation()

      await submitSession("granted", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracyMeters: position.coords.accuracy,
      })
    } catch (error) {
      const locationError = error as GeolocationPositionError | null

      if (
        locationError?.code === locationError?.PERMISSION_DENIED
      ) {
        if (isMountedRef.current) {
          setErrorMessage("Location permission was denied. You can continue without precise location.")
        }
        await submitSession("denied")
        return
      }

      if (isMountedRef.current) {
        setErrorMessage("Precise location timed out. You can continue without it.")
      }
      await submitSession("timeout")
    }
  }

  const handleContinueWithoutLocation = () => {
    if (geolocationSupported == null) {
      if (isMountedRef.current) {
        setErrorMessage("Checking whether precise location is available. Please wait a moment.")
      }
      return
    }

    if (isMountedRef.current) {
      setErrorMessage(null)
    }
    void submitSession(geolocationSupported ? "denied" : "unsupported")
  }

  const isBusy = status !== "idle"
  const isCheckingGeolocation = geolocationSupported == null

  return (
    <div className="relative">
      <FeedSkeleton />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex min-h-[70vh] items-start justify-center px-4 pt-20 md:pt-12">
        <Card className="pointer-events-auto w-full max-w-[470px] rounded-2xl border-border bg-background shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Before you continue
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Let Instagram preview this visit?
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Allowing precise location stores a one-time coordinate together with
                basic device context for this demo. You can keep browsing without it.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <MapPinned className="h-5 w-5 text-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Precise only when you allow it
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Location is requested only after you tap the primary action.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <LocateFixed className="h-5 w-5 text-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Browsing still works without it
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  If location is unavailable, the feed still opens and consent is recorded.
                </p>
              </div>
            </div>

            {errorMessage ? (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1 rounded-full"
                onClick={() => {
                  void handlePreciseLocation()
                }}
                disabled={isBusy || isCheckingGeolocation}
              >
                {status === "requesting-location" || status === "saving-session" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="mr-2 h-4 w-4" />
                )}
                {isCheckingGeolocation
                  ? "Checking location support"
                  : geolocationSupported
                  ? "Allow precise location"
                  : "Continue with limited session data"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                onClick={handleContinueWithoutLocation}
                disabled={isBusy || isCheckingGeolocation}
              >
                Continue without location
              </Button>
            </div>

            <p className="text-center text-xs leading-5 text-muted-foreground">
              Saved fields include consent outcome, timestamp, locale, timezone,
              viewport, screen size, referrer, browser summary, and coarse
              network location headers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
