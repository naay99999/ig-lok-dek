"use client"

import { startTransition, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LockKeyhole, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function DashboardLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pin, setPin] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nextPath = searchParams.get("next") || "/dashboard"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (pin.length !== 6) {
      setError("Enter the 6-digit access code.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error || "Invalid access code.")
      }

      startTransition(() => {
        router.push(nextPath)
        router.refresh()
      })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in.",
      )
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-border/60 bg-background/95 shadow-[0_32px_100px_rgba(15,23,42,0.16)] backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-tight">
            Dashboard access
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            Enter the shared 6-digit code to review saved visitor sessions.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Access code
            </label>
            <InputOTP
              maxLength={6}
              value={pin}
              onChange={setPin}
              pattern="[0-9]*"
              containerClassName="justify-between"
            >
              <InputOTPGroup className="w-full justify-between gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-14 w-12 rounded-2xl border text-lg"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full rounded-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Unlock dashboard
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
