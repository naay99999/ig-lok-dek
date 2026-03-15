import test from "node:test"
import assert from "node:assert/strict"

import {
  formatSupabaseError,
  normalizeSupabaseError,
} from "./errors.ts"

test("normalizeSupabaseError handles Postgrest-style plain objects", () => {
  const normalized = normalizeSupabaseError(
    {
      code: "PGRST205",
      details: "Could not find the table 'public.visitor_sessions' in the schema cache",
      hint: "Reload the schema cache",
      message: "Could not find the table 'public.visitor_sessions' in the schema cache",
    },
    "Unable to load visitor sessions.",
  )

  assert.deepEqual(normalized, {
    code: "PGRST205",
    details:
      "Could not find the table 'public.visitor_sessions' in the schema cache",
    hint: "Reload the schema cache",
    message:
      "Supabase REST cannot find public.visitor_sessions. Apply the latest migration and reload the schema cache.",
  })
})

test("normalizeSupabaseError keeps native Error messages", () => {
  const normalized = normalizeSupabaseError(
    new Error("Network down"),
    "Unable to save session.",
  )

  assert.deepEqual(normalized, {
    code: null,
    details: null,
    hint: null,
    message: "Network down",
  })
})

test("formatSupabaseError falls back cleanly for unknown values", () => {
  assert.equal(
    formatSupabaseError(null, "Unable to load visitor sessions."),
    "Unable to load visitor sessions.",
  )
})
