"use client"
import { useState, useEffect } from "react"
import { subscribeToOffers, Offer } from "@/lib/firestore"

const TYPE_EMOJI: Record<string, string> = {
  percent: "🎉",
  flat: "💰",
  bogo: "🛍️",
  free_delivery: "🚚",
}

const formatDiscount = (offer: Offer) => {
  if (offer.type === "percent") return `${offer.value}% off your order`
  if (offer.type === "flat") return `$${offer.value} off your order`
  if (offer.type === "bogo") return "Buy 1 Get 1 Free"
  return "Free delivery on any order"
}

const formatExpiry = (expiresAt: string) => {
  if (!expiresAt) return "No expiry"
  const date = new Date(expiresAt)
  const now = new Date()
  if (date < now) return "Expired"
  return `Ends ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
}

export function CouponCodes() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToOffers(all => {
      setOffers(all.filter(o => o.active))
      setLoading(false)
    })
    return unsub
  }, [])

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "80px 2rem", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @media (max-width: 700px) { .coupon-grid { grid-template-columns: 1fr !important; } }
        .coupon-card { transition: all 0.2s; }
        .coupon-card:hover { transform: translateY(-2px); }
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

        {/* Loading skeletons */}
        {loading && (
          <div className="coupon-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: "88px", borderRadius: "16px", background: "linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.4s ease-in-out infinite" }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && offers.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏷️</div>
            <p style={{ color: "#444", fontSize: "15px" }}>No active coupon codes right now. Check back soon!</p>
          </div>
        )}

        {/* Grid */}
        {!loading && offers.length > 0 && (
          <div className="coupon-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {offers.map(offer => {
              const expiry = formatExpiry(offer.expiresAt)
              const isExpired = expiry === "Expired"
              return (
                <div
                  key={offer.id}
                  className="coupon-card"
                  onMouseEnter={() => setHovered(offer.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    backgroundColor: hovered === offer.id ? "#161616" : "#111",
                    borderRadius: "16px",
                    border: `1px dashed ${isExpired ? "rgba(255,255,255,0.06)" : hovered === offer.id ? "rgba(249,115,22,0.4)" : "rgba(249,115,22,0.2)"}`,
                    padding: "20px 24px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
                    opacity: isExpired ? 0.5 : 1,
                    boxShadow: hovered === offer.id && !isExpired ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "14px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                      {TYPE_EMOJI[offer.type] ?? "🎁"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "14px", color: "#fff", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {formatDiscount(offer)}
                      </p>
                      <p style={{ color: isExpired ? "#ef4444" : "#444", fontSize: "12px", margin: 0, fontWeight: 500 }}>
                        {expiry}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <div style={{ backgroundColor: "rgba(249,115,22,0.08)", color: "#f97316", fontWeight: 800, fontSize: "12px", padding: "7px 12px", borderRadius: "8px", letterSpacing: "1.5px", fontFamily: "monospace", border: "1px solid rgba(249,115,22,0.2)", whiteSpace: "nowrap" }}>
                      {offer.code}
                    </div>
                    {!isExpired && (
                      <div
                        onClick={() => handleCopy(offer.code)}
                        style={{ backgroundColor: copied === offer.code ? "#22c55e" : "#f97316", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "7px 14px", borderRadius: "100px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", boxShadow: copied !== offer.code ? "0 0 16px rgba(249,115,22,0.3)" : "none" }}
                        onMouseEnter={e => { if (copied !== offer.code) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#ea6c0a" }}
                        onMouseLeave={e => { if (copied !== offer.code) (e.currentTarget as HTMLDivElement).style.backgroundColor = copied === offer.code ? "#22c55e" : "#f97316" }}
                      >
                        {copied === offer.code ? "✓ Copied!" : "Copy"}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}