import { NextRequest, NextResponse } from "next/server"

import {
  DASHBOARD_COOKIE_NAME,
  verifyDashboardSessionToken,
} from "@/lib/dashboard-auth"

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/dashboard/login"
  const token = request.cookies.get(DASHBOARD_COOKIE_NAME)?.value
  const isAuthenticated = await verifyDashboardSessionToken(token)

  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL("/dashboard/login", request.url)
    loginUrl.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
