import { createHash } from "node:crypto"

import { NextRequest, NextResponse, userAgent } from "next/server"
import { ZodError } from "zod"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { sessionIngestSchema } from "@/lib/visitor-sessions"

function getCoarseLocation(request: NextRequest) {
  return {
    coarse_country: request.headers.get("x-vercel-ip-country"),
    coarse_region: request.headers.get("x-vercel-ip-country-region"),
    coarse_city: request.headers.get("x-vercel-ip-city"),
  }
}

function getHashedIp(request: NextRequest) {
  const rawValue =
    request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip")

  const ip = rawValue?.split(",")[0]?.trim()

  if (!ip) {
    return null
  }

  return createHash("sha256").update(ip).digest("hex").slice(0, 24)
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const payload = sessionIngestSchema.parse(json)
    const { browser, device, os } = userAgent(request)
    const supabase = createSupabaseServerClient()

    const record = {
      consent_status: payload.consentStatus,
      latitude: payload.coords?.lat ?? null,
      longitude: payload.coords?.lng ?? null,
      accuracy_meters:
        payload.coords?.accuracyMeters != null
          ? Math.round(payload.coords.accuracyMeters)
          : null,
      ...getCoarseLocation(request),
      browser_name: browser.name ?? null,
      os_name: os.name ?? null,
      device_type: device.type ?? "desktop",
      user_agent_summary:
        request.headers.get("user-agent")?.slice(0, 512) ?? null,
      locale: payload.clientContext.locale,
      timezone: payload.clientContext.timeZone,
      viewport_width: payload.clientContext.viewportWidth,
      viewport_height: payload.clientContext.viewportHeight,
      screen_width: payload.clientContext.screenWidth,
      screen_height: payload.clientContext.screenHeight,
      referrer: payload.clientContext.referrer || null,
      ip_hash: getHashedIp(request),
    }

    const { data, error } = await supabase
      .from("visitor_sessions")
      .insert(record)
      .select("id, created_at, consent_status")
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ session: data })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid session payload." },
        {
          status: 400,
        },
      )
    }

    const message =
      error instanceof Error ? error.message : "Unable to save session."

    return NextResponse.json(
      { error: message },
      {
        status: 500,
      },
    )
  }
}
