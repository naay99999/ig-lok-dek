import { NextRequest, NextResponse } from "next/server"

import {
  DASHBOARD_COOKIE_NAME,
  createDashboardSessionToken,
  getDashboardCookieOptions,
  getDashboardPin,
} from "@/lib/dashboard-auth"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { pin?: string }
    const expectedPin = getDashboardPin()

    if (body.pin !== expectedPin) {
      return NextResponse.json(
        { error: "Invalid access code." },
        {
          status: 401,
        },
      )
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(
      DASHBOARD_COOKIE_NAME,
      await createDashboardSessionToken(),
      getDashboardCookieOptions(),
    )

    return response
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to sign in to the dashboard.",
      },
      {
        status: 500,
      },
    )
  }
}
