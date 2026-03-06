"use client"
import { useState } from "react"

const coupons = [
  { code: "FRESH20", discount: "20% off your first order", expiry: "Ends Mar 31", emoji: "🎉" },
  { code: "FREESHIP", discount: "Free delivery on any order", expiry: "No expiry", emoji: "🚚" },
  { code: "LUNCH15", discount: "15% off orders 11am–2pm", expiry: "Ends Apr 15", emoji: "☀️" },
  { code: "BIGORDER", discount: "$10 off orders over $60", expiry: "Ends Apr 1", emoji: "💰" },
]

export function CouponCodes() {
  const [copied, setCopied] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "80px 2rem", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @media (max-width: 700px) { .coupon-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "999px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Save More</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", margin: 0, lineHeight: 1.1 }}>
            Coupon <span style={{ color: "transparent", WebkitTextStroke: "1.5px #f97316", fontStyle: "italic" }}>Codes.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="coupon-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {coupons.map(c => (
            <div
              key={c.code}
              onMouseEnter={() => setHovered(c.code)}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundColor: hovered === c.code ? "#161616" : "#111",
                borderRadius: "16px",
                border: `1px dashed ${hovered === c.code ? "rgba(249,115,22,0.4)" : "rgba(249,115,22,0.2)"}`,
                padding: "24px 28px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
                transition: "all 0.2s",
                boxShadow: hovered === c.code ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0,
                }}>{c.emoji}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "14px", color: "#fff", margin: "0 0 4px" }}>{c.discount}</p>
                  <p style={{ color: "#444", fontSize: "12px", margin: 0, fontWeight: 500 }}>{c.expiry}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <div style={{
                  backgroundColor: "rgba(249,115,22,0.08)", color: "#f97316",
                  fontWeight: 800, fontSize: "13px", padding: "8px 14px",
                  borderRadius: "8px", letterSpacing: "1.5px", fontFamily: "monospace",
                  border: "1px solid rgba(249,115,22,0.2)",
                }}>
                  {c.code}
                </div>
                <div
                  onClick={() => handleCopy(c.code)}
                  style={{
                    backgroundColor: copied === c.code ? "#22c55e" : "#f97316",
                    color: "#fff", fontSize: "12px", fontWeight: 700,
                    padding: "8px 16px", borderRadius: "100px",
                    cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                    boxShadow: copied !== c.code ? "0 0 16px rgba(249,115,22,0.3)" : "none",
                  }}
                  onMouseEnter={e => { if (copied !== c.code) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#ea6c0a" }}
                  onMouseLeave={e => { if (copied !== c.code) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f97316" }}
                >
                  {copied === c.code ? "✓ Copied!" : "Copy"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}