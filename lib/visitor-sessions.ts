import { z } from "zod"

export const consentStatuses = [
  "granted",
  "denied",
  "timeout",
  "unsupported",
] as const

export type ConsentStatus = (typeof consentStatuses)[number]

export const clientContextSchema = z.object({
  locale: z.string().trim().min(1).max(64),
  timeZone: z.string().trim().min(1).max(100),
  viewportWidth: z.number().int().min(0).max(10000),
  viewportHeight: z.number().int().min(0).max(10000),
  screenWidth: z.number().int().min(0).max(10000),
  screenHeight: z.number().int().min(0).max(10000),
  referrer: z.string().trim().max(2000),
  platform: z.string().trim().max(128),
})

export const sessionIngestSchema = z.object({
  consentStatus: z.enum(consentStatuses),
  coords: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      accuracyMeters: z.number().min(0).max(100000),
    })
    .optional(),
  clientContext: clientContextSchema,
})

export type SessionIngestPayload = z.infer<typeof sessionIngestSchema>

export interface VisitorSessionRecord {
  id: number
  created_at: string
  consent_status: ConsentStatus
  latitude: number | null
  longitude: number | null
  accuracy_meters: number | null
  coarse_country: string | null
  coarse_region: string | null
  coarse_city: string | null
  browser_name: string | null
  os_name: string | null
  device_type: string | null
  user_agent_summary: string | null
  locale: string | null
  timezone: string | null
  viewport_width: number | null
  viewport_height: number | null
  screen_width: number | null
  screen_height: number | null
  referrer: string | null
  ip_hash: string | null
}

export function formatSessionCode(id: number) {
  return `Session ${String(id).padStart(3, "0")}`
}

export function formatConsentLabel(status: ConsentStatus) {
  switch (status) {
    case "granted":
      return "Precise location"
    case "denied":
      return "Skipped precise location"
    case "timeout":
      return "Location timed out"
    case "unsupported":
      return "Location unavailable"
  }
}

export function buildLocationLabel(session: VisitorSessionRecord) {
  const parts = [
    session.coarse_city,
    session.coarse_region,
    session.coarse_country,
  ].filter(Boolean)

  if (parts.length > 0) {
    return parts.join(", ")
  }

  if (session.latitude != null && session.longitude != null) {
    return `${session.latitude.toFixed(5)}, ${session.longitude.toFixed(5)}`
  }

  return "No location available"
}

export function buildDeviceSummary(session: VisitorSessionRecord) {
  return [
    session.browser_name,
    session.os_name,
    session.device_type,
  ]
    .filter(Boolean)
    .join(" · ") || "Unknown device"
}

export function getMapStyleUrl() {
  return (
    process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
    "https://demotiles.maplibre.org/style.json"
  )
}
