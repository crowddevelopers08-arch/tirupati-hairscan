"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Script from "next/script"
import { ArrowLeft, Download, FileText, Loader2, Phone } from "lucide-react"
import { HairReportDetails, type HairProblemKey } from "@/components/hair-report-details"

type SkinProblemKey =
  | "acne"
  | "pigmentation"
  | "dullness"
  | "tanning"
  | "uneven-skin-tone"
  | "open-pores"

type ReportState =
  | {
      type: "hair"
      problem: HairProblemKey
      name: string
      phone: string
      capturedImage?: string | null
    }
  | {
      type: "skin"
      problem: SkinProblemKey
      name: string
      phone: string
      capturedImage?: string | null
    }

type SkinReport = {
  title: string
  detected: string
  summary: string[]
  guidance: string[]
}

const skinReports: Record<SkinProblemKey, SkinReport> = {
  acne: {
    title: "Acne Skin Report",
    detected: "Acne",
    summary: [
      "Visible signs suggest acne-related skin concerns that may be linked to oil imbalance, clogged pores, lifestyle, or irritation.",
      "Understanding the root concern helps avoid random products and improves treatment decisions.",
    ],
    guidance: ["Doctor-guided skincare routine", "Deep cleansing support", "Chemical Peel guidance", "Acne management options"],
  },
  pigmentation: {
    title: "Pigmentation Skin Report",
    detected: "Pigmentation",
    summary: [
      "Visible uneven pigment may be related to sun exposure, post-acne marks, hormonal changes, or skin sensitivity.",
      "A proper skin assessment helps match the right care instead of trial-and-error product use.",
    ],
    guidance: ["Sun protection guidance", "Pigmentation care plan", "Chemical Peel support", "Laser-based treatment direction"],
  },
  dullness: {
    title: "Dullness Skin Report",
    detected: "Dullness",
    summary: [
      "Dullness can be influenced by dehydration, dead skin buildup, stress, or inconsistent skincare habits.",
      "With the right guidance, skin clarity and glow can often improve with a structured routine.",
    ],
    guidance: ["Glow care support", "Hydra Facial guidance", "Doctor-guided home care", "Lifestyle correction tips"],
  },
  tanning: {
    title: "Tanning Skin Report",
    detected: "Tanning",
    summary: [
      "Visible tanning may be connected to frequent sun exposure and uneven melanin response.",
      "Guided care can help support tone recovery while protecting the skin barrier.",
    ],
    guidance: ["Sun care essentials", "Brightening support", "Hydra Facial guidance", "Professional treatment direction"],
  },
  "uneven-skin-tone": {
    title: "Uneven Skin Tone Report",
    detected: "Uneven Skin Tone",
    summary: [
      "Uneven tone may be related to tanning, pigmentation, post-acne marks, or skin sensitivity.",
      "Scientific guidance helps identify whether routine care or professional support is more suitable.",
    ],
    guidance: ["Tone-correction guidance", "Routine improvement tips", "Pigmentation support", "Doctor-guided treatment direction"],
  },
  "open-pores": {
    title: "Open Pores Skin Report",
    detected: "Open Pores",
    summary: [
      "Visible pores may be influenced by excess oil, texture changes, or congestion.",
      "Right-care planning can help improve skin texture without over-treating the skin.",
    ],
    guidance: ["Oil-control support", "Texture care guidance", "Deep cleansing direction", "Doctor-guided skincare routine"],
  },
}

function isReportState(value: unknown): value is ReportState {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<ReportState>
  return (
    (candidate.type === "hair" || candidate.type === "skin") &&
    typeof candidate.problem === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.phone === "string"
  )
}

async function downloadSkinGuide(problem: SkinProblemKey, name: string) {
  const params = new URLSearchParams({ problem, name })
  const response = await fetch(`/api/skin-guide?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to generate PDF")
  }

  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = blobUrl
  link.download = `${skinReports[problem].title.replace(/\s+/g, "_")}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(blobUrl)
}

function SkinReportDetails({ report, name, scannedImage }: { report: SkinReport; name: string; scannedImage?: string | null }) {
  return (
    <section style={{ border: "1px solid rgba(221,185,90,0.22)", borderRadius: 22, background: "linear-gradient(145deg, #10141d, #090d15)", overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,0.32)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between", padding: "28px 30px", borderBottom: "1px solid rgba(221,185,90,0.18)", background: "linear-gradient(135deg, rgba(221,185,90,0.12), rgba(221,185,90,0.03))" }}>
        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          <p style={{ display: "inline-flex", alignItems: "center", gap: 8, margin: "0 0 10px", color: "#ddb95a", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <FileText style={{ width: 15, height: 15 }} />
            Personalized Report
          </p>
          <h2 style={{ margin: "0 0 10px", color: "#f6f1e8", fontSize: "clamp(1.45rem, 4vw, 2rem)", fontWeight: 900, lineHeight: 1.12 }}>{report.title}</h2>
          <p style={{ margin: 0, color: "#bdb8ae", fontSize: "0.95rem", lineHeight: 1.7 }}>
            <strong style={{ color: "#f6f1e8" }}>Problem Detected:</strong> {report.detected}
            {name && <span> | Prepared for <strong style={{ color: "#ddb95a" }}>{name}</strong></span>}
          </p>
        </div>
        {scannedImage && (
          <div style={{ width: 132, maxWidth: "100%", aspectRatio: "1 / 1", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(221,185,90,0.25)", background: "#080b12", flex: "0 0 auto" }}>
            <img src={scannedImage} alt="User scanned skin image" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
          </div>
        )}
      </div>

      <div style={{ padding: "26px 30px 30px", display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 10 }}>
          {report.summary.map((line) => (
            <p key={line} style={{ margin: 0, color: "#c9c2b7", lineHeight: 1.72 }}>{line}</p>
          ))}
        </div>

        <div>
          <h3 style={{ margin: "0 0 14px", color: "#f6f1e8", fontSize: "1.02rem", fontWeight: 900 }}>Suggested Direction</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            {report.guidance.map((item) => (
              <div key={item} style={{ border: "1px solid rgba(221,185,90,0.16)", borderRadius: 16, background: "rgba(255,255,255,0.04)", padding: 18, color: "#d8d1c7", fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.55 }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px dashed rgba(221,185,90,0.28)", borderRadius: 14, background: "rgba(221,185,90,0.06)", padding: "14px 16px", color: "#bdb8ae", fontSize: "0.9rem", lineHeight: 1.6 }}>
          This guide is informational and supports your next-step understanding. Final treatment decisions should be based on doctor guidance.
        </div>
      </div>
    </section>
  )
}

export default function ReportPage() {
  const [reportState, setReportState] = useState<ReportState | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("adgro-report")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (isReportState(parsed)) {
          setReportState(parsed)
        }
      } catch {
        setReportState(null)
      }
    }
    setLoading(false)
  }, [])

  const handleDownload = async () => {
    if (!reportState || reportState.type !== "skin") return
    setDownloading(true)
    try {
      await downloadSkinGuide(reportState.problem, reportState.name)
    } finally {
      setDownloading(false)
    }
  }

  const isSkin = reportState?.type === "skin"
  const pageBg = isSkin ? "#080b12" : "#f8f8f8"
  const textColor = isSkin ? "#f2f0eb" : "#1a1a1a"
  const accent = isSkin ? "#ddb95a" : "#ea2424"

  return (
    <>
      <Script id="meta-pixel-report-submit-application" strategy="afterInteractive">
        {`fbq('track', 'SubmitApplication');`}
      </Script>
      <main style={{ minHeight: "100vh", background: pageBg, color: textColor, fontFamily: "var(--font-outfit, 'Outfit', sans-serif)" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: isSkin ? "rgba(8,11,18,0.92)" : "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${isSkin ? "rgba(221,185,90,0.14)" : "rgba(234,36,36,0.1)"}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <Link href={isSkin ? "/skin" : "/"} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: isSkin ? "#bdb8ae" : "#6b6b6b", textDecoration: "none", fontSize: "0.875rem", fontWeight: 700 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to Home
          </Link>
          <img src="/adgrologo.png" alt="Adgro Hair Tirupati" style={{ height: 36, width: "auto", objectFit: "contain" }} />
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 16px 80px" }}>
        {loading ? (
          <div style={{ minHeight: 360, display: "grid", placeItems: "center", color: accent }}>
            <Loader2 style={{ width: 32, height: 32, animation: "spin 1s linear infinite" }} />
          </div>
        ) : !reportState ? (
          <div style={{ border: `1px solid ${isSkin ? "rgba(221,185,90,0.22)" : "rgba(234,36,36,0.16)"}`, borderRadius: 22, padding: 30, background: isSkin ? "#10141d" : "#fff", textAlign: "center" }}>
            <FileText style={{ width: 36, height: 36, color: accent, margin: "0 auto 12px" }} />
            <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 900 }}>No report found</h1>
            <p style={{ margin: "0 auto 20px", maxWidth: 460, color: isSkin ? "#bdb8ae" : "#6b6b6b", lineHeight: 1.7 }}>
              Please complete a scan first, then open the report from the results screen.
            </p>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: accent, color: isSkin ? "#080b12" : "#fff", borderRadius: 999, padding: "12px 22px", fontSize: "0.92rem", fontWeight: 800, textDecoration: "none" }}>
              Start a Scan
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18, flexWrap: "wrap", marginBottom: 18 }}>
              <div>
                <p style={{ margin: "0 0 8px", color: accent, fontSize: 11, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" }}>Your AI scan report</p>
                <h1 style={{ margin: 0, fontSize: "clamp(1.65rem, 4vw, 2.35rem)", fontWeight: 900, letterSpacing: "-0.02em" }}>
                  {reportState.type === "skin" ? skinReports[reportState.problem].title : "Hair Analysis Report"}
                </h1>
              </div>

              {reportState.type === "skin" && (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 44, background: accent, color: "#080b12", border: "none", borderRadius: 999, padding: "12px 22px", fontSize: "0.92rem", fontWeight: 800, cursor: downloading ? "not-allowed" : "pointer", opacity: downloading ? 0.7 : 1 }}
                >
                  {downloading ? <Loader2 style={{ width: 17, height: 17, animation: "spin 1s linear infinite" }} /> : <Download style={{ width: 17, height: 17 }} />}
                  {downloading ? "Preparing PDF" : "Download PDF"}
                </button>
              )}
            </div>

            {reportState.type === "hair" ? (
              <HairReportDetails problem={reportState.problem} scannedImage={reportState.capturedImage} />
            ) : (
              <SkinReportDetails report={skinReports[reportState.problem]} name={reportState.name} scannedImage={reportState.capturedImage} />
            )}

            <div style={{ marginTop: 18, border: `1px solid ${isSkin ? "rgba(221,185,90,0.15)" : "#eee"}`, borderRadius: 20, padding: "24px 26px", background: isSkin ? "linear-gradient(145deg, #10141d, #0a0d15)" : "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontWeight: 800 }}>Speak with a Specialist</p>
                <p style={{ margin: 0, color: isSkin ? "#bdb8ae" : "#6b6b6b", fontSize: "0.88rem", lineHeight: 1.6 }}>Get expert advice for your condition. Book a free consultation now.</p>
              </div>
              <a href="tel:+918940056789" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: accent, color: isSkin ? "#080b12" : "#fff", borderRadius: 999, padding: "12px 24px", fontSize: "0.95rem", fontWeight: 800, textDecoration: "none" }}>
                <Phone style={{ width: 17, height: 17 }} />
                Book Consultation
              </a>
            </div>
          </>
        )}
      </div>
      </main>
    </>
  )
}


