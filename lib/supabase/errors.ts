interface SupabaseErrorShape {
  code?: unknown
  details?: unknown
  hint?: unknown
  message?: unknown
}

export interface NormalizedSupabaseError {
  code: string | null
  details: string | null
  hint: string | null
  message: string
}

function isSupabaseErrorShape(value: unknown): value is SupabaseErrorShape {
  return typeof value === "object" && value !== null
}

function getStringValue(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null
}

function getSupabaseErrorMessage(code: string | null, fallbackMessage: string) {
  if (code === "PGRST205") {
    return "Supabase REST cannot find public.visitor_sessions. Apply the latest migration and reload the schema cache."
  }

  return fallbackMessage
}

export function normalizeSupabaseError(
  error: unknown,
  fallbackMessage: string,
): NormalizedSupabaseError {
  if (error instanceof Error) {
    return {
      code: null,
      details: null,
      hint: null,
      message: error.message || fallbackMessage,
    }
  }

  if (isSupabaseErrorShape(error)) {
    const code = getStringValue(error.code)
    const details = getStringValue(error.details)
    const hint = getStringValue(error.hint)
    const message =
      getStringValue(error.message) ??
      getSupabaseErrorMessage(code, fallbackMessage)

    return {
      code,
      details,
      hint,
      message: code === "PGRST205" ? getSupabaseErrorMessage(code, message) : message,
    }
  }

  return {
    code: null,
    details: null,
    hint: null,
    message: fallbackMessage,
  }
}

export function formatSupabaseError(
  error: unknown,
  fallbackMessage: string,
) {
  const normalized = normalizeSupabaseError(error, fallbackMessage)
  const parts = [normalized.message]

  if (normalized.code) {
    parts.push(`Code: ${normalized.code}.`)
  }

  if (normalized.details) {
    parts.push(`Details: ${normalized.details}.`)
  }

  if (normalized.hint) {
    parts.push(`Hint: ${normalized.hint}.`)
  }

  return parts.join(" ")
}
