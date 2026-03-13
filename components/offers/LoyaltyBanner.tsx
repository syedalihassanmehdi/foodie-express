"use client"
import { useState, useEffect } from "react"

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f97316">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
const GiftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
)
const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const perks = [
  { Icon: StarIcon, label: "Earn Points"  },
  { Icon: GiftIcon, label: "Free Orders"  },
  { Icon: TagIcon,  label: "Member Deals" },
]

export function LoyaltyBanner() {
  const [mounted, setMounted]   = useState(false)
  const [hovered, setHovered]   = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 600)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section style={{
      backgroundColor:"#fafaf8",
      padding: isMobile ? "56px 1.25rem" : "80px 2rem",
      fontFamily:"'DM Sans', sans-serif",
      position:"relative",
      overflow:"hidden",
      borderBottom:"2px solid #111",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
      `}</style>

      {/* Warm blob */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"700px", height:"350px", borderRadius:"50%", background:"radial-gradient(ellipse, #fff3e8 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.15, backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize:"32px 32px" }} />

    

      <div style={{ maxWidth:"660px", margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>

        {/* Badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:"8px",
          backgroundColor:"#fff3e8", border:"2px solid #f97316",
          borderRadius:"999px", padding:"5px 14px", marginBottom:"22px",
          boxShadow:"3px 3px 0px #f97316",
          opacity: mounted ? 1 : 0, transition:"opacity 0.6s ease",
        }}>
          <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#f97316", display:"inline-block", animation:"pulse 2s infinite" }} />
          <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne', sans-serif" }}>Members Only</span>
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: isMobile ? "clamp(30px,9vw,44px)" : "clamp(32px,4vw,52px)",
          fontWeight:800, letterSpacing:"-2px", lineHeight:1.0,
          margin:"0 0 14px", fontFamily:"'Syne', sans-serif",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition:"opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
        }}>
          <span style={{ color:"#111" }}>Join Our </span>
          <span style={{ color:"#f97316", fontStyle:"italic" }}>Loyalty</span>
          <br />
          <span style={{ color:"#111" }}>Program.</span>
        </h2>

        {/* Divider dashes */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"18px", opacity: mounted ? 1 : 0, transition:"opacity 0.5s ease 0.2s" }}>
          <div style={{ height:"3px", width:"36px", backgroundColor:"#f97316", borderRadius:"2px" }} />
          <div style={{ height:"3px", width:"10px", backgroundColor:"#ffd4a3", borderRadius:"2px" }} />
          <div style={{ height:"3px", width:"5px", backgroundColor:"#ffe8cc", borderRadius:"2px" }} />
        </div>

        {/* Description */}
        <p style={{
          color:"#777", fontSize:"15px", lineHeight:1.8,
          margin:"0 0 32px",
          opacity: mounted ? 1 : 0, transition:"opacity 0.7s ease 0.3s",
        }}>
          Earn points on every order and unlock exclusive member-only deals. Your{" "}
          <span style={{ color:"#f97316", fontWeight:700 }}>5th order is always free.</span>
        </p>

        {/* Perks row */}
        <div style={{
          display:"flex", justifyContent:"center",
          gap: isMobile ? "8px" : "12px",
          flexWrap:"wrap", marginBottom:"32px",
          opacity: mounted ? 1 : 0, transition:"opacity 0.7s ease 0.4s",
        }}>
          {perks.map(({ Icon, label }) => (
            <div key={label} style={{
              display:"flex", alignItems:"center", gap:"8px",
              backgroundColor:"#fff", border:"2px solid #111",
              borderRadius:"12px", padding:"10px 16px",
              boxShadow:"3px 3px 0px #111",
            }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"8px", backgroundColor:"#fff3e8", border:"1.5px solid #f97316", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon />
              </div>
              <span style={{ fontSize:"13px", color:"#111", fontWeight:700, fontFamily:"'Syne', sans-serif", whiteSpace:"nowrap" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ opacity: mounted ? 1 : 0, transition:"opacity 0.7s ease 0.5s" }}>
          <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display:"inline-flex", alignItems:"center", gap:"10px",
              backgroundColor:"#f97316", color:"#fff",
              padding:"13px 28px", borderRadius:"12px",
              fontSize:"14px", fontWeight:700, cursor:"pointer",
              border:"2px solid #f97316",
              boxShadow: hovered ? "2px 2px 0px #c2540a" : "5px 5px 0px #c2540a",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              transition:"all 0.2s ease",
              fontFamily:"'Syne', sans-serif",
            }}
          >
            <StarIcon /> Join Free — Start Earning <ArrowIcon />
          </button>
        </div>
      </div>

      
    </section>
  )
}