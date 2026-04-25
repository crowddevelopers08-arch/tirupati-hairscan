import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const problemLabels: Record<string, string> = {
  "hair-fall": "Hair Fall",
  "crown-thinning": "Crown Thinning",
  "frontal-hair-loss": "Frontal Hair Loss",
  "dandruff-scalp-issues": "Dandruff / Scalp Issues",
  "low-hair-density": "Low Hair Density",
  acne: "Acne",
  pigmentation: "Pigmentation",
  dullness: "Dullness",
  tanning: "Tanning",
  "uneven-skin-tone": "Uneven Skin Tone",
  "open-pores": "Open Pores",
}

const hairProblems = [
  "hair-fall",
  "crown-thinning",
  "frontal-hair-loss",
  "dandruff-scalp-issues",
  "low-hair-density",
]

const skinProblems = [
  "acne",
  "pigmentation",
  "dullness",
  "tanning",
  "uneven-skin-tone",
  "open-pores",
]

const telecrmLabels: Record<string, string> = {
  pending: "Pending",
  synced: "Synced",
  failed: "Failed",
  skipped: "Skipped",
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function matchesDateFilter(scanDate: Date, dateFrom: string, dateTo: string) {
  const scanDay = new Date(scanDate)
  scanDay.setHours(0, 0, 0, 0)

  if (dateFrom) {
    const from = new Date(dateFrom)
    from.setHours(0, 0, 0, 0)
    if (scanDay < from) return false
  }

  if (dateTo) {
    const to = new Date(dateTo)
    to.setHours(23, 59, 59, 999)
    if (scanDay > to) return false
  }

  return true
}

function leadType(problem: string) {
  if (hairProblems.includes(problem)) return "Hair"
  if (skinProblems.includes(problem)) return "Skin"
  return "Other"
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const query = searchParams.get("q")?.trim().toLowerCase() ?? ""
  const selectedProblem = searchParams.get("problem") ?? ""
  const selectedArea = searchParams.get("area")?.trim().toLowerCase() ?? ""
  const selectedDateFrom = searchParams.get("dateFrom") ?? ""
  const selectedDateTo = searchParams.get("dateTo") ?? ""

  const scans = await prisma.scan.findMany({
    orderBy: { createdAt: "desc" },
  })

  const filteredScans = scans.filter((scan) => {
    const matchesQuery =
      !query ||
      scan.name.toLowerCase().includes(query) ||
      scan.phone.toLowerCase().includes(query) ||
      scan.email.toLowerCase().includes(query) ||
      scan.area.toLowerCase().includes(query)

    const matchesProblem = !selectedProblem || scan.problem === selectedProblem
    const matchesArea = !selectedArea || scan.area.toLowerCase().includes(selectedArea)
    const matchesDate = matchesDateFilter(scan.createdAt, selectedDateFrom, selectedDateTo)

    return matchesQuery && matchesProblem && matchesArea && matchesDate
  })

  const headers = [
    "ID",
    "Lead Type",
    "Name",
    "Phone",
    "Email",
    "Area",
    "Concern",
    "TeleCRM Status",
    "TeleCRM Lead IDs",
    "Form Name",
    "Source URL",
    "Created At",
  ]

  const rows = filteredScans.map((scan) => [
    scan.id,
    leadType(scan.problem),
    scan.name,
    scan.phone,
    scan.email,
    scan.area,
    problemLabels[scan.problem] ?? scan.problem,
    telecrmLabels[scan.telecrmStatus] ?? scan.telecrmStatus,
    scan.telecrmLeadIds,
    scan.formName,
    scan.sourceUrl,
    formatDate(scan.createdAt),
  ])

  const table = `
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows
              .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `.trim()

  const dateStamp = new Date().toISOString().slice(0, 10)

  return new NextResponse(table, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="adgro-leads-${dateStamp}.xls"`,
      "Cache-Control": "no-store",
    },
  })
}
