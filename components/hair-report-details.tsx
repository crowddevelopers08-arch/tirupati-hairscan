"use client"

import { CheckCircle2, ClipboardList, Lightbulb, Stethoscope } from "lucide-react"

export type HairProblemKey =
  | "hair-fall"
  | "crown-thinning"
  | "frontal-hair-loss"
  | "dandruff-scalp-issues"
  | "low-hair-density"

type Solution = {
  title: string
  details: string[]
}

type Stage = {
  title: string
  description: string
  recommendation?: string
  benefit: string
}

type HairReport = {
  title: string
  detected: string
  summary: string[]
  solutions: Solution[]
  note: string
  stages: Stage[]
}

const stageImages: Record<string, { src: string; alt: string }> = {
  "Early Stage": {
    src: "/st1.png",
    alt: "Early stage hair density example",
  },
  "Moderate Stage": {
    src: "/st2.png",
    alt: "Moderate stage hair thinning example",
  },
  "Advanced Stage": {
    src: "/st3.png",
    alt: "Advanced stage hair loss example",
  },
}

const reportData: Record<HairProblemKey, HairReport> = {
  "crown-thinning": {
    title: "Crown Thinning Report",
    detected: "Crown Thinning",
    summary: [
      "Hair density is reducing at the crown area.",
      "This is often an early sign of pattern baldness.",
    ],
    solutions: [
      {
        title: "Growth Refactor",
        details: [
          "Uses your own plasma to deliver concentrated growth factors to the scalp.",
          "Helps control hair fall, strengthen weak roots, and improve overall follicle activity.",
        ],
      },
      {
        title: "GFC (Growth Factor Concentrate)",
        details: [
          "Uses concentrated growth factors to stimulate weak follicles and support natural regrowth.",
          "Helps improve hair thickness, density, and overall hair quality over time.",
        ],
      },
      {
        title: "Mesotherapy",
        details: [
          "Delivers essential nutrients directly into the scalp.",
          "Improves nourishment, supports scalp health, and enhances the environment for hair growth.",
        ],
      },
      {
        title: "Hair Transplant",
        details: [
          "Moves healthy hair follicles from one area to thinning/bald areas.",
          "Helps restore natural-looking hair growth in advanced stages.",
        ],
      },
    ],
    note: "Combination treatments may be recommended.",
    stages: [
      {
        title: "Early Stage",
        description: "Hair thinning has just started; roots are still active.",
        recommendation: "OLT + scalp care",
        benefit: "Helps control thinning and improve hair strength.",
      },
      {
        title: "Moderate Stage",
        description: "Hair density is visibly reduced; follicles are weakening.",
        recommendation: "Growth Refactor / GFC treatments",
        benefit: "Strengthens roots and supports regrowth.",
      },
      {
        title: "Advanced Stage",
        description: "Visible thinning or bald areas; some follicles inactive.",
        recommendation: "Hair transplant",
        benefit: "Restores hair and improves coverage.",
      },
    ],
  },
  "dandruff-scalp-issues": {
    title: "Dandruff / Scalp Issues Report",
    detected: "Dandruff / Scalp Issues",
    summary: [
      "Flaky scalp, itching, or irritation is affecting your hair health and growth.",
    ],
    solutions: [
      {
        title: "Anti-Dandruff Therapy",
        details: [
          "Helps control dandruff, reduce itching, and improve overall scalp health.",
          "Targets the root cause of flakes and prevents it from coming back.",
        ],
      },
      {
        title: "OLT",
        details: [
          "Helps reduce dandruff, itching, and scalp irritation.",
          "Improves scalp health and supports a cleaner, healthier environment for hair growth.",
        ],
      },
      {
        title: "Mesotherapy",
        details: [
          "Delivers essential nutrients directly into the scalp to control dandruff and reduce irritation.",
          "Nourishes the scalp, improves health, and supports stronger, healthier hair growth.",
        ],
      },
    ],
    note: "Combination treatments may be recommended.",
    stages: [
      {
        title: "Early Stage",
        description: "Scalp care + home remedies like oiling and proper hygiene.",
        benefit: "Helps control dandruff early and prevents further scalp issues.",
      },
      {
        title: "Moderate Stage",
        description: "Clinical dandruff treatment is recommended.",
        benefit: "Helps reduce itching, irritation, and related hair fall.",
      },
      {
        title: "Advanced Stage",
        description: "Advanced scalp therapy under expert guidance.",
        benefit: "Helps restore scalp health and control recurring dandruff.",
      },
    ],
  },
  "frontal-hair-loss": {
    title: "Frontal Hair Loss Report",
    detected: "Frontal Hair Loss",
    summary: [
      "Hairline recession or thinning in the front area is noticed.",
      "This is often caused by genetics, stress, or hormonal changes.",
    ],
    solutions: [
      {
        title: "Growth Refactor",
        details: [
          "Uses your own plasma to deliver concentrated growth factors to the scalp.",
          "Helps control hair fall, strengthen weak roots, and improve overall follicle activity.",
        ],
      },
      {
        title: "GFC (Growth Factor Concentrate)",
        details: [
          "Uses concentrated growth factors to stimulate weak follicles and support natural regrowth.",
          "Helps improve hair thickness, density, and overall hair quality over time.",
        ],
      },
      {
        title: "Mesotherapy",
        details: [
          "Delivers essential nutrients directly into the scalp to improve nourishment where it is needed most.",
          "Supports scalp health, improves root nutrition, and helps create a better environment for hair growth.",
        ],
      },
      {
        title: "Hair Transplant",
        details: [
          "Moves healthy hair follicles from one area to thinning or bald areas.",
          "Helps restore natural-looking hair growth in advanced stages of hair loss.",
        ],
      },
    ],
    note: "Combination treatments may be recommended.",
    stages: [
      {
        title: "Early Stage",
        description: "Hair thinning has just started, and hair roots are still active.",
        recommendation: "OLT + scalp care",
        benefit: "Helps control thinning and improve hair strength.",
      },
      {
        title: "Moderate Stage",
        description: "Hair density is visibly reduced, and follicles are becoming weak.",
        recommendation: "Growth Refactor / GFC treatments",
        benefit: "Strengthens roots and supports better regrowth.",
      },
      {
        title: "Advanced Stage",
        description: "Clear thinning or bald areas are visible, and some follicles may be inactive.",
        recommendation: "Hair transplant",
        benefit: "Helps restore hair in these areas and improve overall coverage.",
      },
    ],
  },
  "hair-fall": {
    title: "Hair Fall Report",
    detected: "Hair Fall",
    summary: [
      "You are experiencing excessive hair fall beyond normal shedding.",
      "This may be due to stress, hormonal imbalance, poor nutrition, or weak hair roots.",
    ],
    solutions: [
      {
        title: "Growth Refactor",
        details: [
          "Uses your own plasma to deliver concentrated growth factors to the scalp.",
          "Helps control hair fall, strengthen weak roots, and improve overall follicle activity.",
        ],
      },
      {
        title: "GFC (Growth Factor Concentrate)",
        details: [
          "Uses concentrated growth factors to stimulate weak follicles and support natural regrowth.",
          "Helps improve hair thickness, density, and overall hair quality over time.",
        ],
      },
      {
        title: "Mesotherapy",
        details: [
          "Delivers essential nutrients directly into the scalp to improve nourishment where it is needed most.",
          "Supports scalp health, improves root nutrition, and helps create a better environment for hair growth.",
        ],
      },
      {
        title: "OLT",
        details: [
          "A non-invasive therapy that supports scalp circulation and root strength.",
          "Helps improve scalp condition, reduce weakness at the root level, and support healthier hair growth.",
        ],
      },
    ],
    note: "Combination treatments may be recommended.",
    stages: [
      {
        title: "Early Stage",
        description: "Start with home remedies and scalp care. Focus on improving scalp hygiene, reducing stress, maintaining a healthy diet, and following basic doctor-guided hair care habits.",
        benefit: "Hair fall can often be managed at this stage with proper care and lifestyle support before moving to clinical treatments.",
      },
      {
        title: "Moderate Stage",
        description: "Hair fall is continuing and root weakness may need clinical support.",
        recommendation: "Growth Refactor / GFC sessions based on scalp condition and hair loss pattern.",
        benefit: "Helps nourish follicles, strengthen weak roots, reduce ongoing hair fall, and improve overall hair quality.",
      },
      {
        title: "Advanced Stage",
        description: "Hair fall is more persistent and may require a stronger treatment plan.",
        recommendation: "Combination of Growth Refactor + GFC + supportive therapies.",
        benefit: "Helps control further loss, improve density where possible, and support a stronger treatment plan.",
      },
    ],
  },
  "low-hair-density": {
    title: "Lower Hair Density Report",
    detected: "Lower Hair Density",
    summary: [
      "Hair appears thin, flat, and lacks volume due to weak or inactive follicles.",
    ],
    solutions: [
      {
        title: "Growth Refactor",
        details: [
          "Uses your own plasma to deliver concentrated growth factors to the scalp.",
          "Helps control hair fall, strengthen weak roots, and improve overall follicle activity.",
        ],
      },
      {
        title: "GFC (Growth Factor Concentrate)",
        details: [
          "Uses concentrated growth factors to stimulate weak follicles and support natural regrowth.",
          "Also supports scalp circulation and root strength.",
          "Helps improve hair thickness, density, and overall hair quality over time.",
        ],
      },
      {
        title: "Mesotherapy",
        details: [
          "Delivers essential nutrients directly into the scalp to improve nourishment where it is needed most.",
          "Supports scalp health, improves root nutrition, and helps create a better environment for hair growth.",
        ],
      },
      {
        title: "Hair Transplant",
        details: [
          "Moves healthy hair follicles from one area to thinning or bald areas.",
          "Helps restore natural-looking hair growth in advanced stages of hair loss.",
        ],
      },
    ],
    note: "Combination treatments may be recommended.",
    stages: [
      {
        title: "Early Stage",
        description: "Hair density has started reducing, but roots may still respond well to care.",
        recommendation: "OLT + proper nutrition support",
        benefit: "Helps improve hair thickness and strengthens weak roots.",
      },
      {
        title: "Moderate Stage",
        description: "Density is visibly reduced and regrowth support may be required.",
        recommendation: "Growth Refactor / GFC treatments",
        benefit: "Helps increase hair density and improve regrowth.",
      },
      {
        title: "Advanced Stage",
        description: "Visible thinning areas need stronger restoration support.",
        recommendation: "Hair transplant for visible thinning areas",
        benefit: "Helps restore lost hair and improve overall volume.",
      },
    ],
  },
}

interface HairReportDetailsProps {
  problem: HairProblemKey
  scannedImage?: string | null
}

export function HairReportDetails({ problem, scannedImage }: HairReportDetailsProps) {
  const report = reportData[problem] ?? reportData["hair-fall"]

  return (
    <section className="hair-report-details">
      <style>{`
        .hair-report-details {
          border-radius: 22px;
          border: 1px solid rgba(234,36,36,0.16);
          background: linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,244,239,0.86));
          box-shadow: 0 24px 68px rgba(83,27,20,0.12), inset 0 1px 0 rgba(255,255,255,0.92);
          overflow: hidden;
          margin-bottom: 16px;
        }

        .hair-report-header {
          padding: 28px 30px;
          background: linear-gradient(135deg, rgba(234,36,36,0.10), rgba(13,148,136,0.06));
          border-bottom: 1px solid rgba(234,36,36,0.12);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 22px;
          align-items: center;
        }

        .hair-report-header-copy {
          min-width: 0;
        }

        .hair-report-kicker {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 10px;
          color: #ea2424;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .hair-report-title {
          margin: 0 0 10px;
          color: #161313;
          font-size: clamp(1.45rem, 3vw, 2rem);
          font-weight: 900;
          line-height: 1.12;
        }

        .hair-report-detected {
          margin: 0;
          color: #5f5651;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .hair-report-scan {
          width: 132px;
          aspect-ratio: 1 / 1;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(234,36,36,0.16);
          box-shadow: 0 16px 40px rgba(83,27,20,0.13);
        }

        .hair-report-scan img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hair-report-body {
          padding: 26px 30px 30px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hair-report-summary {
          display: grid;
          gap: 8px;
          margin: 0;
        }

        .hair-report-summary p {
          margin: 0;
          color: #5a504b;
          line-height: 1.72;
        }

        .hair-report-section-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 14px;
          color: #161313;
          font-size: 1.02rem;
          font-weight: 900;
        }

        .hair-solutions-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .hair-solution-card,
        .hair-stage-card {
          border: 1px solid rgba(234,36,36,0.12);
          border-radius: 16px;
          background: rgba(255,255,255,0.72);
          padding: 18px;
          box-shadow: 0 12px 34px rgba(83,27,20,0.07);
        }

        .hair-solution-card h4,
        .hair-stage-card h4 {
          margin: 0 0 9px;
          color: #161313;
          font-size: 0.96rem;
          font-weight: 850;
        }

        .hair-solution-card p,
        .hair-stage-card p {
          margin: 0;
          color: #675d58;
          font-size: 0.86rem;
          line-height: 1.65;
        }

        .hair-solution-card p + p,
        .hair-stage-card p + p {
          margin-top: 7px;
        }

        .hair-report-note {
          border-radius: 14px;
          border: 1px dashed rgba(234,36,36,0.26);
          background: rgba(234,36,36,0.05);
          padding: 14px 16px;
          color: #4f4642;
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.55;
        }

        .hair-stages {
          display: grid;
          gap: 12px;
        }

        .hair-stage-card {
          display: grid;
          grid-template-columns: 176px minmax(0, 1fr);
          gap: 22px;
          align-items: start;
          padding: 20px;
        }

        .hair-stage-visual {
          display: grid;
          gap: 14px;
          justify-items: center;
        }

        .hair-stage-image {
          width: 142px;
          max-width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 999px;
          overflow: hidden;
          background: #f4ece8;
          box-shadow: 0 12px 28px rgba(83,27,20,0.12), inset 0 0 0 1px rgba(234,36,36,0.08);
        }

        .hair-stage-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hair-stage-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100%;
          padding: 4px 0;
        }

        .hair-stage-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: min(100%, 188px);
          min-height: 38px;
          border-radius: 999px;
          background: linear-gradient(135deg, #ea2424, #c91f1f);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 850;
          text-align: center;
          padding: 8px 12px;
          box-shadow: 0 10px 24px rgba(234,36,36,0.22);
        }

        .hair-stage-copy {
          min-width: 0;
        }

        .hair-stage-meta {
          color: #342d2a;
          font-weight: 800;
        }

        @media (max-width: 680px) {
          .hair-report-body {
            padding: 22px 16px 26px;
          }

          .hair-report-header {
            grid-template-columns: minmax(0, 1fr) 96px;
            gap: 12px;
            padding: 20px 16px;
            align-items: start;
          }

          .hair-report-kicker {
            font-size: 10px;
            gap: 6px;
            margin-bottom: 8px;
            letter-spacing: 0.11em;
          }

          .hair-report-title {
            font-size: 1.38rem;
            line-height: 1.16;
            margin-bottom: 8px;
          }

          .hair-report-detected {
            font-size: 0.88rem;
            line-height: 1.5;
          }

          .hair-report-scan {
            width: 96px;
            border-radius: 16px;
          }

          .hair-solutions-grid {
            grid-template-columns: 1fr;
          }

          .hair-stage-card {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 16px;
          }

          .hair-stage-visual {
            justify-items: center;
          }

          .hair-stage-image {
            width: 132px;
          }

          .hair-stage-badge {
            justify-content: center;
            width: min(100%, 156px);
          }

          .hair-stage-content {
            padding: 0;
          }
        }

        @media (max-width: 440px) {
          .hair-report-header {
            grid-template-columns: minmax(0, 1fr) 82px;
            gap: 10px;
          }

          .hair-report-title {
            font-size: 1.18rem;
          }

          .hair-report-kicker {
            font-size: 9px;
            letter-spacing: 0.09em;
          }

          .hair-report-detected {
            font-size: 0.82rem;
          }

          .hair-report-scan {
            width: 82px;
            border-radius: 14px;
          }

          .hair-stage-card {
            grid-template-columns: 1fr;
          }

          .hair-stage-image {
            width: 124px;
          }

          .hair-stage-badge {
            margin: 0 auto;
          }
        }

        @media (max-width: 340px) {
          .hair-report-header {
            grid-template-columns: 1fr;
          }

          .hair-report-scan {
            width: 104px;
          }
        }
      `}</style>

      <div className="hair-report-header">
        <div className="hair-report-header-copy">
          <p className="hair-report-kicker">
            <ClipboardList style={{ width: 15, height: 15 }} />
            Personalized Report
          </p>
          <h2 className="hair-report-title">{report.title}</h2>
          <p className="hair-report-detected">
            <strong>Problem Detected:</strong> {report.detected}
          </p>
        </div>
        {scannedImage && (
          <div className="hair-report-scan">
            <img src={scannedImage} alt="User scanned hair image" />
          </div>
        )}
      </div>

      <div className="hair-report-body">
        <div className="hair-report-summary">
          {report.summary.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div>
          <h3 className="hair-report-section-title">
            <Lightbulb style={{ width: 18, height: 18, color: "#ea2424" }} />
            Solutions
          </h3>
          <div className="hair-solutions-grid">
            {report.solutions.map((solution) => (
              <article className="hair-solution-card" key={solution.title}>
                <h4>{solution.title}</h4>
                {solution.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </article>
            ))}
          </div>
        </div>

        <div className="hair-report-note">
          {report.note}
        </div>

        <div>
          <h3 className="hair-report-section-title">
            <Stethoscope style={{ width: 18, height: 18, color: "#ea2424" }} />
            Stages & What You Should Do
          </h3>
          <div className="hair-stages">
            {report.stages.map((stage) => (
              <article className="hair-stage-card" key={stage.title}>
                <div className="hair-stage-visual">
                  <div className="hair-stage-image">
                    <img
                      src={stageImages[stage.title]?.src ?? "/st1.png"}
                      alt={stageImages[stage.title]?.alt ?? `${stage.title} hair example`}
                    />
                  </div>
                  <div className="hair-stage-badge">{stage.title}</div>
                </div>
                <div className="hair-stage-content">
                  <div className="hair-stage-copy">
                    <p>{stage.description}</p>
                    {stage.recommendation && (
                      <p><span className="hair-stage-meta">Recommendation:</span> {stage.recommendation}</p>
                    )}
                    <p><span className="hair-stage-meta">Benefit:</span> {stage.benefit}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
