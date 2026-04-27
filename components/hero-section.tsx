"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BadgeCheck, Building2, Camera, CreditCard, FlipHorizontal, Headphones, HeartHandshake, Phone, Scan, ShieldCheck, Sparkles } from "lucide-react"

interface HeroSectionProps {
  onCapture: (imageData: string) => void
}

export function HeroSection({ onCapture }: HeroSectionProps) {
  const [heroCameraError, setHeroCameraError] = useState("")
  const [heroFacingMode, setHeroFacingMode] = useState<"user" | "environment">("user")
  const [heroStreaming, setHeroStreaming] = useState(false)
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const heroStreamRef = useRef<MediaStream | null>(null)

  const stopHeroCamera = useCallback(() => {
    heroStreamRef.current?.getTracks().forEach((track) => track.stop())
    heroStreamRef.current = null
    if (heroVideoRef.current) {
      heroVideoRef.current.srcObject = null
    }
    setHeroStreaming(false)
  }, [])

  const startHeroCamera = useCallback(async (mode: "user" | "environment") => {
    try {
      stopHeroCamera()
      setHeroCameraError("")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      })

      heroStreamRef.current = stream
      if (heroVideoRef.current) {
        heroVideoRef.current.srcObject = stream
      }
      setHeroStreaming(true)
    } catch {
      setHeroCameraError("Unable to access camera. Please allow camera permissions.")
      setHeroStreaming(false)
    }
  }, [stopHeroCamera])

  useEffect(() => {
    startHeroCamera(heroFacingMode)
    return () => stopHeroCamera()
  }, [heroFacingMode, startHeroCamera, stopHeroCamera])

  const handleHeroFlipCamera = () => {
    setHeroFacingMode((current) => (current === "user" ? "environment" : "user"))
  }

  const handleHeroCapture = () => {
    if (!heroVideoRef.current || !heroCanvasRef.current || !heroStreaming) return
    const video = heroVideoRef.current
    const canvas = heroCanvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    setCapturedPreview(canvas.toDataURL("image/jpeg", 0.8))
  }

  const handleHeroRetake = () => {
    setCapturedPreview(null)
  }

  const handleHeroUsePhoto = () => {
    if (!capturedPreview) return
    onCapture(capturedPreview)
  }

  const stats = [
    { icon: HeartHandshake, value: "5+", label: "Years Experience" },
    { icon: CreditCard, value: "AI", label: "Powered Analysis" },
    { icon: Building2, value: "FDA", label: "Approved Solutions" },
  ]

  return (
    <>
      {/* ══════════════════════════════════════════
          STICKY NAVBAR
      ══════════════════════════════════════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(234,36,36,0.1)",
        boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "11px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src="/adgrologo.png" alt="Adgro Hair Tirupati" style={{ height: 42, width: "auto", objectFit: "contain" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b6b6b", fontWeight: 500, display: "none" }} className="sm:block">Free AI Hair Analysis</span>
            <a href="tel:+918940056789" style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: "linear-gradient(135deg,#ea2424,#c91f1f)", color: "#fff",
              borderRadius: "100px", padding: "9px 20px",
              fontSize: "0.875rem", fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(234,36,36,0.3)",
              transition: "all 0.2s",
            }}>
              <Phone style={{ width: 14, height: 14 }} />
              +91 89400 56789
            </a>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="hair-hero-bg" style={{ position: "relative", overflow: "hidden", padding: "30px 20px 72px", background: "#fff", fontFamily: "var(--font-outfit,'Outfit',sans-serif)" }}>
        <style>{`
          .hero-shell { display:grid; grid-template-columns:minmax(0,1.05fr) minmax(340px,0.95fr); gap:42px; align-items:center; max-width:1200px; margin:0 auto; }
          .hero-copy { text-align:left; max-width:640px; display:flex; flex-direction:column; align-items:flex-start; }
          .hero-logo { display:flex; justify-content:flex-start; margin:0 0 24px; }
          .hero-copy-intro { display:flex; flex-direction:column; align-items:flex-start; gap:12px; margin:0 0 18px; }
          .hero-copy-kicker { display:inline-flex; align-items:center; gap:8px; padding:8px 14px; border-radius:999px; background:rgba(234,36,36,0.08); border:1px solid rgba(234,36,36,0.16); color:#b52525; font-size:0.78rem; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; }
          .hero-copy-title { margin:0; font-size:clamp(1.95rem,4vw,3.1rem); font-weight:900; line-height:1.04; letter-spacing:-0.045em; color:#1a1a1a; }
          .hero-copy-title-accent { display:block; margin-top:8px; background:linear-gradient(135deg,#ea2424 0%,#ff6b6b 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; padding-bottom:0.15em; }
          .hero-copy-divider { width:84px; height:4px; border-radius:999px; background:linear-gradient(90deg,#ea2424,rgba(234,36,36,0.18)); }
          .hero-stats-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; width:100%; max-width:100%; margin:0; }
          .hero-stat-card { min-height:146px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; padding:22px 14px; text-align:center; border-radius:20px; border:1px solid rgba(234,36,36,0.16); background:linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,245,241,0.82)); box-shadow:0 18px 54px rgba(83,27,20,0.10), inset 0 1px 0 rgba(255,255,255,0.92); backdrop-filter:blur(14px); transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; position:relative; overflow:hidden; }
          .hero-stat-card::before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 20% 0%,rgba(234,36,36,0.10),transparent 7rem), radial-gradient(circle at 90% 100%,rgba(13,148,136,0.08),transparent 7rem); pointer-events:none; }
          .hero-stat-card:hover { transform:translateY(-5px); border-color:rgba(234,36,36,0.28); box-shadow:0 26px 68px rgba(83,27,20,0.16), 0 0 0 4px rgba(234,36,36,0.04); }
          .hero-stat-icon { position:relative; width:46px; height:46px; border-radius:16px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,rgba(234,36,36,0.12),rgba(255,255,255,0.84)); border:1px solid rgba(234,36,36,0.18); box-shadow:0 12px 28px rgba(234,36,36,0.12); flex-shrink:0; }
          .hero-stat-value { position:relative; margin:2px 0 0; font-size:clamp(1.15rem,2vw,1.45rem); font-weight:900; line-height:1; color:#161313; font-variant-numeric:tabular-nums; overflow-wrap:anywhere; }
          .hero-stat-label { position:relative; margin:0; min-height:2.2em; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:800; line-height:1.18; color:#6b5f5a; text-transform:uppercase; letter-spacing:0.06em; }
          .hero-preview-card { position:relative; width:100%; max-width:500px; margin-left:auto; padding:16px 24px 22px; border-radius:34px; border:1px solid rgba(234,36,36,0.16); background:linear-gradient(160deg,rgba(255,255,255,0.96),rgba(255,245,242,0.9)); box-shadow:0 34px 90px rgba(83,27,20,0.16), 0 0 0 4px rgba(234,36,36,0.03); overflow:hidden; }
          .hero-preview-card::before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 82% 12%,rgba(234,36,36,0.12),transparent 22%), linear-gradient(180deg,rgba(255,255,255,0.18),transparent 24%); pointer-events:none; }
          .hero-preview-frame { position:relative; margin:0 0 18px; aspect-ratio:1 / 0.86; border-radius:28px; overflow:hidden; background:#1f1f1f; box-shadow:0 20px 46px rgba(0,0,0,0.18); }
          .hero-preview-frame video, .hero-preview-frame img { width:100%; height:100%; object-fit:cover; display:block; filter:saturate(0.95) contrast(1.03); }
          .hero-preview-ring { position:absolute; width:68%; aspect-ratio:1 / 1; top:50%; left:50%; transform:translate(-50%,-50%); border-radius:50%; border:3px solid rgba(255,63,63,0.65); box-shadow:0 0 0 1px rgba(255,63,63,0.08); }
          .hero-preview-corner { position:absolute; width:26px; height:26px; border:4px solid #ff3030; }
          .hero-preview-corner.tl { top:16%; left:16%; border-right:none; border-bottom:none; border-top-left-radius:12px; }
          .hero-preview-corner.tr { top:16%; right:16%; border-left:none; border-bottom:none; border-top-right-radius:12px; }
          .hero-preview-corner.bl { bottom:16%; left:16%; border-right:none; border-top:none; border-bottom-left-radius:12px; }
          .hero-preview-corner.br { bottom:16%; right:16%; border-left:none; border-top:none; border-bottom-right-radius:12px; }
          .hero-preview-live { position:absolute; top:16px; left:16px; display:flex; align-items:center; gap:8px; padding:8px 14px; border-radius:999px; background:#f44336; color:#fff; box-shadow:0 12px 20px rgba(244,67,54,0.28); }
          .hero-preview-live-dot { width:8px; height:8px; border-radius:999px; background:#fff; }
          .hero-preview-flip { position:absolute; right:18px; bottom:18px; width:54px; height:54px; border:none; border-radius:50%; background:rgba(255,255,255,0.94); display:flex; align-items:center; justify-content:center; box-shadow:0 12px 24px rgba(0,0,0,0.16); }
          .hero-preview-scanline { position:absolute; left:50%; transform:translateX(-50%); width:68%; height:2px; background:linear-gradient(90deg,transparent,#ff3030,transparent); box-shadow:0 0 16px #ff3030; opacity:0.8; animation:heroPreviewScan 2.8s ease-in-out infinite; }
          .hero-preview-empty { height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:24px; text-align:center; color:#6b6b6b; background:linear-gradient(180deg,rgba(245,245,245,0.98),rgba(249,244,243,0.95)); }
          .hero-preview-button { width:100%; display:flex; align-items:center; justify-content:center; gap:10px; border:none; border-radius:18px; padding:15px 24px; background:linear-gradient(135deg,#f42020,#d91f1f); color:#fff; font-size:1.02rem; font-weight:800; box-shadow:0 20px 40px rgba(234,36,36,0.24); }
          @keyframes heroPreviewScan { 0% { top:18%; } 50% { top:78%; } 100% { top:18%; } }
          @media (max-width:1080px) { .hero-shell { grid-template-columns:1fr; gap:34px; } .hero-copy { text-align:center; max-width:860px; margin:0 auto; align-items:center; } .hero-logo, .hero-copy-intro { justify-content:center; align-items:center; } .hero-preview-card { margin:0 auto; } .hero-stats-grid { max-width:820px; margin:0 auto; } }
          @media (max-width:760px) { .hero-stats-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; max-width:520px; margin:0 auto; } .hero-stat-card { min-height:132px; padding:18px 10px; border-radius:18px; } .hero-stat-card:last-child { grid-column:1 / -1; justify-self:center; width:calc(50% - 6px); } .hero-preview-card { padding:22px 18px 20px; border-radius:28px; } }
          @media (max-width:380px) { .hero-stats-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; } .hero-stat-card { min-height:112px; padding:14px 8px; } .hero-stat-card:last-child { grid-column:1 / -1; justify-self:center; width:calc(50% - 6px); } }
        `}</style>

        {/* ── BG LAYER 1: Large mesh gradient base ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 60% at 70% -10%, rgba(234,36,36,0.09) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 110%, rgba(234,36,36,0.06) 0%, transparent 55%)",
        }} />

        {/* ── BG LAYER 2: Dot grid ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(234,36,36,0.18) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.5,
        }} />

        {/* ── BG LAYER 3: Large decorative concentric rings (top-right) ── */}
        <div style={{ position: "absolute", top: "-120px", right: "-120px", pointerEvents: "none" }}>
          {[300, 420, 540, 660].map((size, i) => (
            <div key={i} style={{
              position: "absolute",
              width: size, height: size,
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              border: `1px solid rgba(234,36,36,${0.12 - i * 0.025})`,
            }} />
          ))}
          {/* Filled core glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 180, height: 180, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,36,36,0.14) 0%, transparent 70%)",
            filter: "blur(24px)",
          }} />
        </div>

        {/* ── BG LAYER 4: Decorative rings (bottom-left) ── */}
        <div style={{ position: "absolute", bottom: "-80px", left: "-80px", pointerEvents: "none" }}>
          {[200, 300, 400].map((size, i) => (
            <div key={i} style={{
              position: "absolute",
              width: size, height: size,
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              border: `1px solid rgba(234,36,36,${0.09 - i * 0.025})`,
            }} />
          ))}
        </div>

        {/* ── BG LAYER 5: Morphing red blob top-right ── */}
        <div className="animate-morph animate-drift" style={{
          position: "absolute", top: "-60px", right: "5%",
          width: 340, height: 340, pointerEvents: "none",
          background: "radial-gradient(circle, rgba(234,36,36,0.1) 0%, rgba(234,36,36,0.04) 50%, transparent 70%)",
          filter: "blur(40px)",
        }} />

        {/* ── BG LAYER 6: Morphing blob bottom-left ── */}
        <div className="animate-morph animate-drift2" style={{
          position: "absolute", bottom: "0px", left: "0%",
          width: 260, height: 260, pointerEvents: "none",
          background: "radial-gradient(circle, rgba(234,36,36,0.07) 0%, transparent 65%)",
          filter: "blur(32px)",
          animationDelay: "4s",
        }} />

        {/* ── BG LAYER 7: Orbiting small dot top-right ── */}
        <div style={{ position: "absolute", top: "18%", right: "12%", pointerEvents: "none" }}>
          <div className="animate-orbit" style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#ea2424", opacity: 0.5,
            boxShadow: "0 0 12px rgba(234,36,36,0.6)",
          }} />
        </div>
        <div style={{ position: "absolute", top: "60%", left: "8%", pointerEvents: "none" }}>
          <div className="animate-orbit-rev" style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#ea2424", opacity: 0.35,
            boxShadow: "0 0 8px rgba(234,36,36,0.5)",
          }} />
        </div>

        {/* ── BG LAYER 8: Floating geometric shapes ── */}
        {/* Top-left square rotated */}
        <div className="animate-float" style={{
          position: "absolute", top: "10%", left: "5%", pointerEvents: "none",
          width: 48, height: 48, borderRadius: "10px",
          border: "1.5px solid rgba(234,36,36,0.18)",
          transform: "rotate(20deg)",
          background: "rgba(234,36,36,0.04)",
        }} />
        {/* Small triangle-ish shape */}
        <div className="animate-float-delayed" style={{
          position: "absolute", top: "20%", right: "18%", pointerEvents: "none",
          width: 32, height: 32, borderRadius: "6px",
          border: "1.5px solid rgba(234,36,36,0.15)",
          transform: "rotate(-15deg)",
          background: "rgba(234,36,36,0.04)",
        }} />
        {/* Bottom-right square */}
        <div className="animate-drift" style={{
          position: "absolute", bottom: "18%", right: "8%", pointerEvents: "none",
          width: 56, height: 56, borderRadius: "14px",
          border: "1.5px solid rgba(234,36,36,0.12)",
          transform: "rotate(10deg)",
          background: "rgba(234,36,36,0.03)",
        }} />
        {/* Small circle mid-left */}
        <div className="animate-drift2" style={{
          position: "absolute", top: "50%", left: "3%", pointerEvents: "none",
          width: 22, height: 22, borderRadius: "50%",
          background: "rgba(234,36,36,0.12)",
          boxShadow: "0 0 16px rgba(234,36,36,0.2)",
        }} />

        {/* ── BG LAYER 9: Spinning large ring outline ── */}
        <div className="animate-spin-slow" style={{
          position: "absolute", top: "50%", left: "50%",
          width: 900, height: 900,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          border: "1px dashed rgba(234,36,36,0.06)",
          pointerEvents: "none",
        }} />
        <div className="animate-spin-slow-rev" style={{
          position: "absolute", top: "50%", left: "50%",
          width: 700, height: 700,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          border: "1px dashed rgba(234,36,36,0.05)",
          pointerEvents: "none",
        }} />

        {/* ── BG LAYER 10: SVG wave bottom ── */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: 80, display: "block" }}>
            <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z" fill="rgba(234,36,36,0.04)" />
            <path d="M0,60 C200,20 400,80 600,50 C800,20 1000,70 1200,50 C1300,40 1380,55 1440,60 L1440,80 L0,80 Z" fill="rgba(234,36,36,0.03)" />
          </svg>
        </div>

        {/* ── BG LAYER 11: Horizontal light sweep ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,245,245,0.4) 0%, transparent 50%, rgba(255,245,245,0.2) 100%)",
        }} />

        {/* Hero logo row */}
        <div style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto 28px",
          display: "none",
          justifyContent: "center",
        }}>
          <img
            src="/adgrologo.png"
            alt="Adgro Hair Tirupati"
            style={{ height: 74, width: "auto", maxWidth: "min(300px, 72vw)", objectFit: "contain" }}
          />
        </div>

        {/* ══ CONTENT ══ */}
        <div className="hero-shell" style={{ position: "relative", zIndex: 10 }}>
          <div className="hero-copy">
          <div className="hero-logo">
            <img
              src="/adgrologo.png"
              alt="Adgro Hair Tirupati"
              style={{ height: 68, width: "auto", maxWidth: "min(280px, 72vw)", objectFit: "contain" }}
            />
          </div>
          {/* AI Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(234,36,36,0.25)",
            borderRadius: "100px",
            padding: "6px 16px 6px 8px",
            marginBottom: "28px",
            boxShadow: "0 4px 20px rgba(234,36,36,0.1), 0 0 0 4px rgba(234,36,36,0.04)",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{
              background: "linear-gradient(135deg,#ea2424,#c91f1f)", color: "#fff",
              borderRadius: "100px", padding: "3px 10px",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>NEW</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#ea2424", display: "flex", alignItems: "center", gap: "5px" }}>
              <Sparkles style={{ width: 13, height: 13 }} />
              AI-Powered Hair Analysis
            </span>
          </div>

          <div className="hero-copy-intro">
            <div className="hero-copy-kicker">
              <span style={{ width: 7, height: 7, borderRadius: "999px", background: "#ea2424", boxShadow: "0 0 0 4px rgba(234,36,36,0.12)" }} />
              Adgro Hair Tirupati
            </div>
            <h1 className="hero-copy-title">
              Understand Your Hair Loss
              <span className="hero-copy-title-accent">The Right Way</span>
            </h1>
            <div className="hero-copy-divider" />
          </div>

          {/* Sub text */}
          <p style={{
            fontSize: "clamp(0.96rem, 1.8vw, 1.08rem)", lineHeight: 1.75,
            color: "#5a5a5a", maxWidth: "600px",
            margin: "0 0 34px", fontWeight: 400,
          }}>
            Trusted by <strong style={{ color: "#1a1a1a", fontWeight: 700 }}>20,000+ happy patients</strong>, {" "}
            <strong style={{ color: "#1a1a1a", fontWeight: 700 }}> 5+</strong> years of experience.
          </p>

          {/* Stats Row */}
          <div className="hero-stats-grid">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <div
                key={i}
                className="hero-stat-card"
              >
                <div className="hero-stat-icon">
                  <Icon style={{ width: 20, height: 20, color: "#ea2424" }} />
                </div>
                <div style={{ position: "relative" }}>
                  <p className="hero-stat-value">{value}</p>
                  <p className="hero-stat-label">{label}</p>
                </div>
              </div>
            ))}
          </div>
          </div>

          <div className="hero-preview-card">
            <div style={{
              position: "relative",
              width: 52,
              height: 52,
              margin: "0 auto 10px",
              borderRadius: 16,
              border: "1px solid rgba(234,36,36,0.16)",
              background: "rgba(234,36,36,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Camera style={{ width: 22, height: 22, color: "#f42020" }} />
            </div>
            <h3 style={{ margin: "0 0 4px", textAlign: "center", fontSize: "clamp(1.55rem,2.1vw,2rem)", fontWeight: 900, color: "#1f1b1b", letterSpacing: "-0.03em" }}>
              Position Your Hair
            </h3>
            <p style={{ margin: "0 0 16px", textAlign: "center", color: "#6b6b6b", fontSize: "0.96rem", lineHeight: 1.6 }}>
              Align your hair within the frame for best results
            </p>

            <div className="hero-preview-frame">
              {/* Video stays mounted always so the stream never needs re-attaching on retake */}
              <video
                ref={heroVideoRef}
                autoPlay
                playsInline
                muted
                style={{ display: capturedPreview || heroCameraError ? "none" : "block" }}
              />

              {capturedPreview ? (
                <img src={capturedPreview} alt="Captured" />
              ) : heroCameraError ? (
                <div className="hero-preview-empty">
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "rgba(234,36,36,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Camera style={{ width: 24, height: 24, color: "#ea2424" }} />
                  </div>
                  <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.6 }}>{heroCameraError}</p>
                </div>
              ) : (
                <>
                  <div className="hero-preview-live">
                    <span className="hero-preview-live-dot" />
                    <span style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.03em" }}>LIVE</span>
                  </div>
                  <div className="hero-preview-ring" />
                  <div className="hero-preview-corner tl" />
                  <div className="hero-preview-corner tr" />
                  <div className="hero-preview-corner bl" />
                  <div className="hero-preview-corner br" />
                  {heroStreaming && <div className="hero-preview-scanline" />}
                  <button type="button" className="hero-preview-flip" aria-label="Flip camera" onClick={handleHeroFlipCamera}>
                    <FlipHorizontal style={{ width: 22, height: 22, color: "#f42020" }} />
                  </button>
                </>
              )}
            </div>

            <canvas ref={heroCanvasRef} style={{ display: "none" }} />
            {capturedPreview ? (
              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <button type="button" onClick={handleHeroRetake} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  border: "2px solid #ea2424", borderRadius: "18px", padding: "15px 16px",
                  background: "#fff", color: "#ea2424", fontSize: "1rem", fontWeight: 700,
                }}>
                  <FlipHorizontal style={{ width: 20, height: 20 }} />
                  Retake
                </button>
                <button type="button" onClick={handleHeroUsePhoto} className="hero-preview-button" style={{ flex: 1.4 }}>
                  <Camera style={{ width: 20, height: 20 }} />
                  Use This Photo
                </button>
              </div>
            ) : (
              <button type="button" className="hero-preview-button" onClick={handleHeroCapture} disabled={!heroStreaming}>
                <Camera style={{ width: 22, height: 22 }} />
                Capture Photo
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══ SCAN FORM DIALOG ══ */}
    </>
  )
}

