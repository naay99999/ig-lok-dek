import "server-only"

import { createClient } from "@supabase/supabase-js"

function getSupabaseServerEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server environment variables are missing.")
  }

  return { url, serviceRoleKey }
}

export function createSupabaseServerClient() {
  const { url, serviceRoleKey } = getSupabaseServerEnv()

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
