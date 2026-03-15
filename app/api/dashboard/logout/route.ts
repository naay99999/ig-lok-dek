import { NextRequest, NextResponse } from "next/server"

import {
  DASHBOARD_COOKIE_NAME,
  getDashboardCookieOptions,
} from "@/lib/dashboard-auth"

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/dashboard/login", request.url),
    303,
  )

  response.cookies.set(DASHBOARD_COOKIE_NAME, "", {
    ...getDashboardCookieOptions(),
    maxAge: 0,
  })

  return response
}
