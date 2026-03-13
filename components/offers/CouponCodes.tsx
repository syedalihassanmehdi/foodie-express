"use client"
import { useState, useEffect } from "react"
import { subscribeToOffers, Offer } from "@/lib/firestore"

// ── Icons ───────────────────────────────────────────────────
const PercentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
)
const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const GiftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
)
const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)

const TYPE_ICON: Record<string, React.ReactNode> = {
  percent:       <PercentIcon />,
  flat:          <DollarIcon />,
  bogo:          <GiftIcon />,
  free_delivery: <TruckIcon />,
}

const formatDiscount = (offer: Offer) => {
  if (offer.type === "percent")       return `${offer.value}% off your order`
  if (offer.type === "flat")          return `$${offer.value} off your order`
  if (offer.type === "bogo")          return "Buy 1 Get 1 Free"
  return "Free delivery on any order"
}

const formatExpiry = (expiresAt: string) => {
  if (!expiresAt) return "No expiry"
  const date = new Date(expiresAt)
  if (date < new Date()) return "Expired"
  return `Ends ${date.toLocaleDateString("en-US", { month:"short", day:"numeric" })}`
}

export function CouponCodes() {
  const [offers, setOffers]   = useState<Offer[]>([])
  const [copied, setCopied]   = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [cols, setCols]       = useState(2)

  useEffect(() => {
    const update = () => setCols(window.innerWidth < 700 ? 1 : 2)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

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

  const isMobile = cols === 1

  return (
    <section style={{
      backgroundColor:"#fff",
      padding: isMobile ? "48px 1.25rem 56px" : "80px 2rem",
      fontFamily:"'DM Sans', sans-serif",
      position:"relative",
      overflow:"hidden",
      borderBottom:"2px solid #111",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .coupon-card { transition: all 0.22s ease !important; }
        .coupon-card:hover { transform: translateY(-4px) !important; }
      `}</style>

      {/* Warm blob */}
      <div style={{ position:"absolute", top:"-10%", right:"-5%", width:"400px", height:"400px", background:"radial-gradient(circle, #fff3e8 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.15, backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize:"36px 36px" }} />

      <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:2 }}>

        {/* Header */}
        <div style={{ marginBottom: isMobile ? "28px" : "48px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"999px", padding:"5px 14px", marginBottom:"12px", boxShadow:"3px 3px 0px #f97316" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#f97316", display:"inline-block", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne', sans-serif" }}>Save More</span>
          </div>
          <h2 style={{ fontSize: isMobile ? "32px" : "clamp(28px,4vw,48px)", fontWeight:800, color:"#111", margin:0, letterSpacing:"-2px", lineHeight:1.0, fontFamily:"'Syne', sans-serif" }}>
            Coupon <span style={{ color:"#f97316", fontStyle:"italic" }}>Codes.</span>
          </h2>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:"14px" }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height:"96px", borderRadius:"16px", border:"2px solid #f0f0f0", background:"linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%)", backgroundSize:"400px 100%", animation:"shimmer 1.4s ease-in-out infinite" }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && offers.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0", border:"2px dashed #f0f0f0", borderRadius:"18px" }}>
            <div style={{ width:"48px", height:"48px", margin:"0 auto 16px", borderRadius:"12px", backgroundColor:"#fff3e8", border:"2px solid #f97316", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <GiftIcon />
            </div>
            <p style={{ color:"#aaa", fontSize:"15px" }}>No active coupon codes right now. Check back soon!</p>
          </div>
        )}

        {/* Coupon grid */}
        {!loading && offers.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:"14px" }}>
            {offers.map(offer => {
              const expiry    = formatExpiry(offer.expiresAt)
              const isExpired = expiry === "Expired"
              const isHov     = hovered === offer.id
              return (
                <div
                  key={offer.id}
                  className="coupon-card"
                  onMouseEnter={() => setHovered(offer.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    backgroundColor:"#fff",
                    borderRadius:"16px",
                    border:`2px ${isExpired ? "dashed" : "solid"} ${isHov && !isExpired ? "#f97316" : "#e8e8e8"}`,
                    padding: isMobile ? "16px" : "20px 24px",
                    display:"flex", alignItems:"center",
                    justifyContent:"space-between", gap:"14px",
                    opacity: isExpired ? 0.5 : 1,
                    boxShadow: isHov && !isExpired ? "4px 4px 0px #f97316" : "3px 3px 0px #f0f0f0",
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}
                >
                  {/* Left: icon + text */}
                  <div style={{ display:"flex", alignItems:"center", gap:"14px", minWidth:0, flex:1 }}>
                    <div style={{ width:"44px", height:"44px", borderRadius:"12px", backgroundColor:"#fff3e8", border:"2px solid #f97316", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"2px 2px 0px #f97316" }}>
                      {TYPE_ICON[offer.type] ?? <GiftIcon />}
                    </div>
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontWeight:700, fontSize:"14px", color:"#111", margin:"0 0 3px", fontFamily:"'Syne', sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {formatDiscount(offer)}
                      </p>
                      <p style={{ color: isExpired ? "#ef4444" : "#aaa", fontSize:"12px", margin:0, fontWeight:500 }}>
                        {expiry}
                      </p>
                    </div>
                  </div>

                  {/* Right: code + copy */}
                  <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
                    <div style={{ backgroundColor:"#fff3e8", color:"#f97316", fontWeight:800, fontSize:"12px", padding:"7px 12px", borderRadius:"8px", letterSpacing:"1.5px", fontFamily:"monospace", border:"2px solid #f97316", whiteSpace:"nowrap" }}>
                      {offer.code}
                    </div>
                    {!isExpired && (
                      <button
                        onClick={() => handleCopy(offer.code)}
                        style={{
                          backgroundColor: copied === offer.code ? "#22c55e" : "#f97316",
                          color:"#fff", fontSize:"12px", fontWeight:700,
                          padding:"8px 14px", borderRadius:"10px",
                          cursor:"pointer", transition:"all 0.2s",
                          border: copied === offer.code ? "2px solid #22c55e" : "2px solid #f97316",
                          boxShadow: copied === offer.code ? "none" : "2px 2px 0px #c2540a",
                          display:"flex", alignItems:"center", gap:"5px",
                          fontFamily:"'Syne', sans-serif",
                          whiteSpace:"nowrap",
                        }}
                      >
                        {copied === offer.code ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy</>}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop:"48px", height:"2px", backgroundColor:"#f0f0f0", borderRadius:"2px" }} />
      </div>
    </section>
  )
}