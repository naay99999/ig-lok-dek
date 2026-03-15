"use client"

import { useEffect, useRef } from "react"
import { ExternalLink, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getMapStyleUrl } from "@/lib/visitor-sessions"

interface SessionMapProps {
  accuracyMeters: number | null
  latitude: number
  longitude: number
}

export function SessionMap({
  accuracyMeters,
  latitude,
  longitude,
}: SessionMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let isDisposed = false
    let mapInstance: import("maplibre-gl").Map | null = null

    const setup = async () => {
      const maplibre = await import("maplibre-gl")

      if (isDisposed || !containerRef.current) {
        return
      }

      mapInstance = new maplibre.Map({
        container: containerRef.current,
        style: getMapStyleUrl(),
        center: [longitude, latitude],
        zoom: accuracyMeters != null && accuracyMeters < 100 ? 15 : 11,
        attributionControl: false,
      })

      mapInstance.addControl(
        new maplibre.NavigationControl({
          showCompass: false,
        }),
        "top-right",
      )

      new maplibre.Marker({
        color: "#1f6feb",
      })
        .setLngLat([longitude, latitude])
        .addTo(mapInstance)
    }

    void setup()

    return () => {
      isDisposed = true
      mapInstance?.remove()
    }
  }, [accuracyMeters, latitude, longitude])

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="h-[320px] w-full overflow-hidden rounded-[24px] border border-border bg-muted"
      />
      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
            {accuracyMeters != null ? ` • ±${Math.round(accuracyMeters)} m` : ""}
          </span>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <a
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in map
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
