export const DASHBOARD_COOKIE_NAME = "dashboard_session"
const DASHBOARD_COOKIE_MAX_AGE = 60 * 60 * 12
const encoder = new TextEncoder()

function getDashboardSecret() {
  const secret = process.env.DASHBOARD_AUTH_SECRET

  if (!secret || secret.length < 16) {
    throw new Error(
      "DASHBOARD_AUTH_SECRET must be set and at least 16 characters long.",
    )
  }

  return secret
}

export function getDashboardPin() {
  const pin = process.env.DASHBOARD_PIN

  if (!pin || !/^\d{6}$/.test(pin)) {
    throw new Error("DASHBOARD_PIN must be set to exactly 6 digits.")
  }

  return pin
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

async function createSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getDashboardSecret()),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  )
}

async function signValue(value: string) {
  const key = await createSigningKey()
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value))
  return bytesToHex(new Uint8Array(signature))
}

export async function createDashboardSessionToken() {
  const issuedAt = Date.now().toString()
  const signature = await signValue(issuedAt)
  return `${issuedAt}.${signature}`
}

export async function verifyDashboardSessionToken(token: string | undefined) {
  if (!token) {
    return false
  }

  const [issuedAt, signature] = token.split(".")

  if (!issuedAt || !signature) {
    return false
  }

  const issuedAtNumber = Number(issuedAt)

  if (!Number.isFinite(issuedAtNumber)) {
    return false
  }

  const expected = await signValue(issuedAt)
  const isFresh = Date.now() - issuedAtNumber < DASHBOARD_COOKIE_MAX_AGE * 1000

  return expected === signature && isFresh
}

export function getDashboardCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: DASHBOARD_COOKIE_MAX_AGE,
  }
}
