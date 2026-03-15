"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { format } from "date-fns"
import {
  Filter,
  Globe,
  LaptopMinimal,
  LocateFixed,
  LogOut,
  Search,
  ShieldCheck,
} from "lucide-react"

import { SessionMap } from "@/components/dashboard/session-map"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  buildDeviceSummary,
  buildLocationLabel,
  consentStatuses,
  formatConsentLabel,
  formatSessionCode,
  type ConsentStatus,
  type VisitorSessionRecord,
} from "@/lib/visitor-sessions"

interface SessionsDashboardProps {
  errorMessage?: string | null
  sessions: VisitorSessionRecord[]
}

function getConsentBadgeClasses(status: ConsentStatus) {
  switch (status) {
    case "granted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "denied":
      return "border-slate-200 bg-slate-100 text-slate-700"
    case "timeout":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "unsupported":
      return "border-blue-200 bg-blue-50 text-blue-700"
  }
}

function SessionDetail({
  session,
}: {
  session: VisitorSessionRecord | null
}) {
  if (!session) {
    return null
  }

  const detailItems = [
    ["Session code", formatSessionCode(session.id)],
    ["Created at", format(new Date(session.created_at), "PPpp")],
    ["Consent", formatConsentLabel(session.consent_status)],
    ["Locale", session.locale || "Unknown"],
    ["Timezone", session.timezone || "Unknown"],
    ["Viewport", `${session.viewport_width || 0} × ${session.viewport_height || 0}`],
    ["Screen", `${session.screen_width || 0} × ${session.screen_height || 0}`],
    ["Referrer", session.referrer || "Direct / none"],
    ["IP hash", session.ip_hash || "Not available"],
    ["User agent", session.user_agent_summary || "Unavailable"],
  ] as const

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[28px] border-border/60 p-0 sm:max-w-4xl">
      <DialogHeader className="border-b border-border/70 px-6 py-5">
        <DialogTitle className="text-2xl tracking-tight">
          {formatSessionCode(session.id)}
        </DialogTitle>
        <DialogDescription className="text-sm leading-6">
          Review the recorded location, device summary, and request context for
          this visit.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.25fr_0.9fr]">
        <div className="space-y-6">
          <Card className="gap-0 overflow-hidden border-border/70 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle className="text-lg">Location</CardTitle>
              <CardDescription>
                Precise coordinates appear only when the visitor allowed them.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-5">
              {session.latitude != null && session.longitude != null ? (
                <SessionMap
                  accuracyMeters={session.accuracy_meters}
                  latitude={session.latitude}
                  longitude={session.longitude}
                />
              ) : (
                <div className="rounded-[24px] border border-dashed border-border bg-muted/40 px-5 py-8 text-sm text-muted-foreground">
                  No precise coordinate was stored for this session. Coarse
                  location: {buildLocationLabel(session)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="gap-0 overflow-hidden border-border/70 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle className="text-lg">Request and device details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-5 py-5">
              {detailItems.map(([label, value]) => (
                <div key={label} className="grid gap-1 sm:grid-cols-[140px_1fr]">
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </div>
                  <div className="text-sm leading-6 text-foreground break-words">
                    {value}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="gap-0 overflow-hidden border-border/70 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle className="text-lg">Overview</CardTitle>
            <CardDescription>At-a-glance session summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 px-5 py-5">
            <div className="rounded-[24px] bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Location label
              </p>
              <p className="mt-2 text-base font-medium text-foreground">
                {buildLocationLabel(session)}
              </p>
            </div>

            <div className="rounded-[24px] bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Device summary
              </p>
              <p className="mt-2 text-base font-medium text-foreground">
                {buildDeviceSummary(session)}
              </p>
            </div>

            <div className="rounded-[24px] bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Coarse headers
              </p>
              <div className="mt-2 space-y-1 text-sm text-foreground">
                <p>Country: {session.coarse_country || "Unavailable"}</p>
                <p>Region: {session.coarse_region || "Unavailable"}</p>
                <p>City: {session.coarse_city || "Unavailable"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  )
}

export function SessionsDashboard({
  errorMessage,
  sessions,
}: SessionsDashboardProps) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ConsentStatus | "all">("all")
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null)
  const deferredQuery = useDeferredValue(query)

  const filteredSessions = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return sessions.filter((session) => {
      const matchesStatus =
        statusFilter === "all" || session.consent_status === statusFilter
      const searchable = [
        formatSessionCode(session.id).toLowerCase(),
        buildLocationLabel(session).toLowerCase(),
        buildDeviceSummary(session).toLowerCase(),
      ]
      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchable.some((value) => value.includes(normalizedQuery))

      return matchesStatus && matchesQuery
    })
  }, [deferredQuery, sessions, statusFilter])

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) || null

  return (
    <Dialog
      open={selectedSession != null}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedSessionId(null)
        }
      }}
    >
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(31,111,235,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,248,250,0.98))]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
            <Card className="gap-0 overflow-hidden border-border/70 bg-background/90 py-0 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
              <CardHeader className="border-b border-border/70 py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Badge
                      variant="outline"
                      className="rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700"
                    >
                      Internal tool
                    </Badge>
                    <CardTitle className="text-3xl tracking-tight">
                      Visitor session dashboard
                    </CardTitle>
                    <CardDescription className="max-w-2xl text-sm leading-6">
                      Filter saved sessions, inspect consent status, and review
                      precise coordinates only when the visitor explicitly
                      allowed location capture.
                    </CardDescription>
                  </div>

                  <form action="/api/dashboard/logout" method="post">
                    <Button variant="outline" className="rounded-full" type="submit">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </form>
                </div>
              </CardHeader>

              <CardContent className="grid gap-4 px-6 py-6 md:grid-cols-[1fr_200px]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search Session 001, Bangkok, desktop..."
                    className="h-12 rounded-full pl-11"
                  />
                </label>

                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as ConsentStatus | "all")
                  }
                >
                  <SelectTrigger className="h-12 w-full rounded-full">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All consent states</SelectItem>
                    {consentStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatConsentLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              <Card className="gap-0 border-border/70 bg-background/90 py-0">
                <CardContent className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Sessions saved
                      </p>
                      <p className="text-2xl font-semibold">{sessions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-0 border-border/70 bg-background/90 py-0">
                <CardContent className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <LocateFixed className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Precise granted
                      </p>
                      <p className="text-2xl font-semibold">
                        {
                          sessions.filter(
                            (session) => session.consent_status === "granted",
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-0 border-border/70 bg-background/90 py-0">
                <CardContent className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-slate-700">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Filtered rows
                      </p>
                      <p className="text-2xl font-semibold">
                        {filteredSessions.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {errorMessage ? (
            <Card className="border-destructive/20 bg-destructive/5 py-0">
              <CardContent className="px-5 py-4 text-sm text-destructive">
                {errorMessage}
              </CardContent>
            </Card>
          ) : null}

          <Card className="gap-0 overflow-hidden border-border/70 bg-background/90 py-0 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle className="text-xl">Saved sessions</CardTitle>
              <CardDescription>
                Select any row to open the full session detail modal.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 py-0">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Session</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead className="pr-6 text-right">Recorded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session) => (
                      <TableRow
                        key={session.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedSessionId(session.id)}
                      >
                        <TableCell className="pl-6 font-medium">
                          {formatSessionCode(session.id)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`rounded-full ${getConsentBadgeClasses(session.consent_status)}`}
                          >
                            {formatConsentLabel(session.consent_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{buildLocationLabel(session)}</TableCell>
                        <TableCell>{buildDeviceSummary(session)}</TableCell>
                        <TableCell className="pr-6 text-right text-muted-foreground">
                          {format(new Date(session.created_at), "PP p")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {filteredSessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => setSelectedSessionId(session.id)}
                    className="rounded-[24px] border border-border/80 bg-background px-4 py-4 text-left transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{formatSessionCode(session.id)}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {buildLocationLabel(session)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`rounded-full ${getConsentBadgeClasses(session.consent_status)}`}
                      >
                        {formatConsentLabel(session.consent_status)}
                      </Badge>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <LaptopMinimal className="h-4 w-4" />
                        <span>{buildDeviceSummary(session)}</span>
                      </div>
                      <span>{format(new Date(session.created_at), "PP")}</span>
                    </div>
                  </button>
                ))}
              </div>

              {filteredSessions.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                  No sessions match the current search and filter.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <SessionDetail session={selectedSession} />
    </Dialog>
  )
}
