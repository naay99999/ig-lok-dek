"use client"

import { createContext, useContext, useEffect, useState } from "react"

const SESSION_KEY = "ig-session-prompted"

type SessionContextType = {
  isSessionReady: boolean
  markSessionReady: () => void
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isSessionReady, setIsSessionReady] = useState(false)

  useEffect(() => {
    // Check if already prompted in this session
    const alreadyPrompted = sessionStorage.getItem(SESSION_KEY)
    if (alreadyPrompted) {
      setIsSessionReady(true)
    }
  }, [])

  const markSessionReady = () => {
    sessionStorage.setItem(SESSION_KEY, "true")
    setIsSessionReady(true)
  }

  return (
    <SessionContext.Provider value={{ isSessionReady, markSessionReady }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
