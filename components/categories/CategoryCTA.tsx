"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

// ── SVG Icons ────────────────────────────────────────────────
const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f97316">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)
const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f97316">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
const PlateIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const trustItems = [
  { Icon: BoltIcon,  label: "Under 30 mins" },
  { Icon: StarIcon,  label: "4.9 rated"     },
  { Icon: PlateIcon, label: "6 courses"     },
]

export function CategoryCTA() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [primaryHovered, setPrimaryHovered] = useState(false)
  const [secondaryHovered, setSecondaryHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 600)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section style={{
      backgroundColor: "#fff",
      padding: isMobile ? "56px 1.25rem" : "80px 2rem",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #111",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
      `}</style>

      {/* Warm blob centre */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"700px", height:"350px", borderRadius:"50%", background:"radial-gradient(ellipse, #fff3e8 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.15, backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize:"32px 32px" }} />

      

      {/* ── Content ── */}
      <div style={{ maxWidth:"580px", margin:"0 auto", position:"relative", zIndex:2, textAlign:"center" }}>

        {/* Badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:"8px",
          backgroundColor:"#fff3e8", border:"2px solid #f97316",
          borderRadius:"999px", padding:"5px 14px", marginBottom:"22px",
          boxShadow:"3px 3px 0px #f97316",
          opacity: mounted ? 1 : 0, transition:"opacity 0.5s ease",
        }}>
          <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#f97316", display:"inline-block", animation:"pulse 2s infinite" }} />
          <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne', sans-serif" }}>Chef's Recommendation</span>
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: isMobile ? "clamp(30px,9vw,44px)" : "clamp(32px,5vw,52px)",
          fontWeight:800, letterSpacing:"-2px", lineHeight:1.0,
          margin:"0 0 14px", fontFamily:"'Syne', sans-serif",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition:"opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}>
          <span style={{ color:"#111" }}>Still Can't </span>
          <span style={{ color:"#f97316", fontStyle:"italic" }}>Decide?</span>
          <br />
          <span style={{ color:"#111" }}>Let Us </span>
          <span style={{ color:"#f97316" }}>Choose.</span>
        </h2>

        {/* Divider dashes */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"18px", opacity: mounted ? 1 : 0, transition:"opacity 0.5s ease 0.25s" }}>
          <div style={{ height:"3px", width:"36px", backgroundColor:"#f97316", borderRadius:"2px" }} />
          <div style={{ height:"3px", width:"10px", backgroundColor:"#ffd4a3", borderRadius:"2px" }} />
          <div style={{ height:"3px", width:"5px", backgroundColor:"#ffe8cc", borderRadius:"2px" }} />
        </div>

        {/* Description */}
        <p style={{
          color:"#777", fontSize:"14px", maxWidth:"440px",
          margin:"0 auto 32px", lineHeight:1.75,
          opacity: mounted ? 1 : 0, transition:"opacity 0.6s ease 0.3s",
        }}>
          Experience the full range of our culinary journey with our Tasting Platter — perfect for sharing and exploring our most loved signature dishes.
        </p>

        {/* Buttons */}
        <div style={{
          display:"flex", justifyContent:"center", gap:"12px",
          flexDirection: isMobile ? "column" : "row",
          opacity: mounted ? 1 : 0, transition:"opacity 0.6s ease 0.4s",
        }}>
          <Link
            href="/menu"
            onMouseEnter={() => setPrimaryHovered(true)}
            onMouseLeave={() => setPrimaryHovered(false)}
            style={{
              display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px",
              backgroundColor:"#f97316", color:"#fff",
              padding:"13px 28px", borderRadius:"12px",
              fontSize:"14px", fontWeight:700, textDecoration:"none",
              fontFamily:"'Syne', sans-serif",
              border:"2px solid #f97316",
              boxShadow: primaryHovered ? "2px 2px 0px #c2540a" : "5px 5px 0px #c2540a",
              transform: primaryHovered ? "translateY(-2px)" : "translateY(0)",
              transition:"all 0.2s ease",
            }}
          >
            Order Tasting Platter <ArrowIcon />
          </Link>
          <Link
            href="/menu"
            onMouseEnter={() => setSecondaryHovered(true)}
            onMouseLeave={() => setSecondaryHovered(false)}
            style={{
              display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px",
              backgroundColor: secondaryHovered ? "#f97316" : "#fff",
              color: secondaryHovered ? "#fff" : "#f97316",
              padding:"13px 28px", borderRadius:"12px",
              fontSize:"14px", fontWeight:700, textDecoration:"none",
              fontFamily:"'Syne', sans-serif",
              border:"2px solid #f97316",
              boxShadow: secondaryHovered ? "2px 2px 0px #c2540a" : "5px 5px 0px #ffe0c2",
              transform: secondaryHovered ? "translateY(-2px)" : "translateY(0)",
              transition:"all 0.2s ease",
            }}
          >
            Browse Menu
          </Link>
        </div>

        {/* Trust row */}
        <div style={{
          display:"flex", justifyContent:"center", alignItems:"center",
          gap: isMobile ? "20px" : "36px",
          marginTop:"32px", flexWrap:"wrap",
          opacity: mounted ? 1 : 0, transition:"opacity 0.6s ease 0.5s",
        }}>
          {trustItems.map(({ Icon, label }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <div style={{ width:"24px", height:"24px", borderRadius:"6px", backgroundColor:"#fff3e8", border:"1.5px solid #f97316", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon />
              </div>
              <span style={{ fontSize:"12px", color:"#777", fontWeight:600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      
    </section>
  )
}