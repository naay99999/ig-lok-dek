import { SessionsDashboard } from "@/components/dashboard/sessions-dashboard"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { type VisitorSessionRecord } from "@/lib/visitor-sessions"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  let sessions: VisitorSessionRecord[] = []
  let errorMessage: string | null = null

  try {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase
      .from("visitor_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)

    if (error) {
      throw error
    }

    sessions = (data ?? []) as VisitorSessionRecord[]
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load visitor sessions."
  }

  return <SessionsDashboard errorMessage={errorMessage} sessions={sessions} />
}
