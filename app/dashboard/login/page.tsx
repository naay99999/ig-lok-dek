import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { DashboardLoginForm } from "@/components/dashboard/login-form"
import {
  DASHBOARD_COOKIE_NAME,
  verifyDashboardSessionToken,
} from "@/lib/dashboard-auth"

export default async function DashboardLoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(DASHBOARD_COOKIE_NAME)?.value

  if (await verifyDashboardSessionToken(token)) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(31,111,235,0.12),transparent_35%),linear-gradient(180deg,rgba(248,250,252,1),rgba(241,245,249,1))] px-4 py-10">
      <DashboardLoginForm />
    </main>
  )
}
