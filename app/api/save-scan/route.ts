import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const FORM_NAME = "hairscan-lp leads"

type TelecrmResult = {
  status: "synced" | "failed" | "skipped"
  leadIds?: string
  response?: string
}

type DatabaseResult =
  | { status: "saved"; id: number }
  | { status: "duplicate"; response: string }
  | { status: "failed"; response: string }

function getLiveUrl(req: NextRequest, explicitUrl?: unknown) {
  if (typeof explicitUrl === "string" && explicitUrl.trim()) {
    return explicitUrl.trim()
  }

  const referer = req.headers.get("referer")
  if (referer) return referer

  const origin = req.headers.get("origin")
  if (origin) return origin

  const forwardedHost = req.headers.get("x-forwarded-host")
  const host = forwardedHost || req.headers.get("host")
  if (host) {
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https"
    return `${forwardedProto}://${host}`
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  return ""
}

function toShortJson(value: unknown) {
  try {
    return JSON.stringify(value).slice(0, 4000)
  } catch {
    return String(value).slice(0, 4000)
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function syncTelecrmLead(input: {
  name: string
  phone: string
  email: string
  area: string
  problem: string
  sourceUrl: string
}): Promise<TelecrmResult> {
  const apiUrl = process.env.TELECRM_API_URL
  const apiKey = process.env.TELECRM_API_KEY

  if (!apiUrl || !apiKey) {
    return { status: "skipped", response: "TeleCRM API URL or API key is not configured." }
  }

  const formNameField = process.env.TELECRM_FORM_NAME_FIELD || "form_name"
  const liveUrlField = process.env.TELECRM_LIVE_URL_FIELD || "live_url"

  const fields: Record<string, string> = {
    phone: input.phone,
    name: input.name,
    email: input.email,
    area: input.area,
    problem: input.problem,
    [formNameField]: FORM_NAME,
    [liveUrlField]: input.sourceUrl,
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ fields }),
  })

  const payload = await response.json().catch(async () => ({ text: await response.text().catch(() => "") }))
  const responseText = toShortJson(payload)
  const telecrmStatus = typeof payload?.status === "string" ? payload.status.toLowerCase() : ""
  const isSuccess = response.ok && telecrmStatus !== "error"
  const modifiedLeadIds = Array.isArray(payload?.modifiedLeadIds) ? payload.modifiedLeadIds.join(", ") : ""

  return {
    status: isSuccess ? "synced" : "failed",
    leadIds: modifiedLeadIds,
    response: responseText,
  }
}

async function saveLeadToDatabase(input: {
  name: string
  phone: string
  email: string
  area: string
  problem: string
  imageData: string
  sourceUrl: string
}): Promise<DatabaseResult> {
  try {
    const existing = await prisma.scan.findFirst({
      where: { phone: input.phone },
      select: { id: true },
    })

    if (existing) {
      return {
        status: "duplicate",
        response: "This mobile number has already been used to submit a lead.",
      }
    }

    const scan = await prisma.scan.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email,
        area: input.area,
        problem: input.problem,
        imageData: input.imageData,
        sourceUrl: input.sourceUrl,
        formName: FORM_NAME,
      },
    })

    return { status: "saved", id: scan.id }
  } catch (error) {
    return {
      status: "failed",
      response: error instanceof Error ? error.message : "Database save failed",
    }
  }
}

async function updateTelecrmStatus(scanId: number, telecrmResult: TelecrmResult) {
  try {
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        telecrmStatus: telecrmResult.status,
        telecrmLeadIds: telecrmResult.leadIds ?? "",
        telecrmResponse: telecrmResult.response ?? "",
        telecrmSyncedAt: telecrmResult.status === "synced" ? new Date() : null,
      },
    })
  } catch (error) {
    console.error("Failed to update TeleCRM status on scan:", error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, area, location, problem, imageData, sourceUrl } = await req.json()

    const normalizedPhone = String(phone ?? "").trim()
    const normalizedName = String(name ?? "").trim()
    const normalizedEmail = String(email ?? "").trim()
    const normalizedArea = String(area ?? location ?? "").trim()
    const normalizedProblem = String(problem ?? "").trim()

    if (!normalizedName || !normalizedPhone || !normalizedEmail || !normalizedArea || !normalizedProblem || !imageData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 })
    }

    const liveUrl = getLiveUrl(req, sourceUrl)

    const databaseResult = await saveLeadToDatabase({
      name: normalizedName,
      phone: normalizedPhone,
      email: normalizedEmail,
      area: normalizedArea,
      problem: normalizedProblem,
      imageData,
      sourceUrl: liveUrl,
    })

    if (databaseResult.status === "duplicate") {
      return NextResponse.json(
        { error: databaseResult.response },
        { status: 409 },
      )
    }

    const telecrmResult = await syncTelecrmLead({
      name: normalizedName,
      phone: normalizedPhone,
      email: normalizedEmail,
      area: normalizedArea,
      problem: normalizedProblem,
      sourceUrl: liveUrl,
    }).catch((error) => ({
      status: "failed" as const,
      response: error instanceof Error ? error.message : "TeleCRM sync failed",
    }))

    if (databaseResult.status === "saved") {
      await updateTelecrmStatus(databaseResult.id, telecrmResult)
    }

    const databaseSaved = databaseResult.status === "saved"
    const telecrmAccepted = telecrmResult.status === "synced"
    const telecrmUnavailable = telecrmResult.status === "failed" || telecrmResult.status === "skipped"

    if (!databaseSaved && telecrmUnavailable) {
      return NextResponse.json(
        {
          error: "Failed to submit lead to database and TeleCRM.",
          databaseStatus: databaseResult.status,
          databaseResponse: databaseResult.response,
          telecrmStatus: telecrmResult.status,
          telecrmResponse: telecrmResult.response,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      id: databaseResult.status === "saved" ? databaseResult.id : null,
      databaseStatus: databaseResult.status,
      telecrmStatus: telecrmResult.status,
    })
  } catch (error) {
    console.error("Failed to save scan:", error)
    const message =
      error instanceof Error && process.env.NODE_ENV !== "production"
        ? `Failed to save scan: ${error.message}`
        : "Failed to save scan"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
