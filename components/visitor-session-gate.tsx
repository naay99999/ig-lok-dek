"use client"

import { useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  Loader2,
  LocateFixed,
  MapPinned,
  ShieldCheck,
} from "lucide-react"

import { FeedSkeleton } from "@/components/skeletons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
      timeout: 5000,
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
  const geolocationSupported =
    typeof navigator !== "undefined" && "geolocation" in navigator

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
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
    if (isMountedRef.current) {
      setErrorMessage(null)
    }
    void submitSession(geolocationSupported ? "denied" : "unsupported")
  }

  const isBusy = status !== "idle"

  return (
    <div className="relative">
      <FeedSkeleton />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex min-h-[70vh] items-center justify-center px-4 py-10">
        <Card className="pointer-events-auto w-full max-w-xl border-border/60 bg-background/96 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Badge
                variant="outline"
                className="rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700"
              >
                Session capture
              </Badge>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                Consent required
              </div>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl tracking-tight">
                Confirm your visit before the preview opens.
              </CardTitle>
              <CardDescription className="max-w-lg text-sm leading-6">
                If you allow precise location, this demo stores a high-accuracy
                coordinate plus limited device context in Supabase. You can also
                continue without precise location.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <MapPinned className="h-5 w-5 text-foreground" />
                <p className="mt-3 text-sm font-medium">Precise coordinate</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Requested only after you choose the primary action.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <ShieldCheck className="h-5 w-5 text-foreground" />
                <p className="mt-3 text-sm font-medium">Thai-law friendly</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Limited telemetry, no persistent fingerprinting, no hidden collection.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <LocateFixed className="h-5 w-5 text-foreground" />
                <p className="mt-3 text-sm font-medium">Fallback path</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  If location is unavailable, the preview still unlocks and the session is marked accordingly.
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
                disabled={isBusy}
              >
                {status === "requesting-location" || status === "saving-session" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="mr-2 h-4 w-4" />
                )}
                {geolocationSupported
                  ? "Allow precise location"
                  : "Continue with limited session data"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                onClick={handleContinueWithoutLocation}
                disabled={isBusy}
              >
                Continue without precise location
              </Button>
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Captured fields: consent outcome, timestamp, locale, timezone,
              viewport, screen size, referrer, coarse network location headers,
              and browser summary.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
