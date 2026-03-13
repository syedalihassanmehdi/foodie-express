"use client"
import { useState, useEffect } from "react"

// ── Icons ────────────────────────────────────────────────────
const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)
const ChefIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
    <line x1="6" y1="17" x2="18" y2="17"/>
  </svg>
)
const TruckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const RecycleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.79"/>
  </svg>
)
const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#f97316">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const TrophyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="18" width="12" height="4"/>
    <path d="M6 9a6 6 0 0 0 12 0"/>
  </svg>
)

const values = [
  { Icon:LeafIcon,    title:"Fresh & Organic",   desc:"Every ingredient is sourced from certified local farms, picked fresh daily for maximum flavor and nutrition." },
  { Icon:ChefIcon,    title:"Master Chefs",       desc:"Our team of award-winning chefs bring decades of culinary expertise to every dish we create." },
  { Icon:TruckIcon,   title:"Fast Delivery",      desc:"We guarantee your food arrives hot and fresh within 30 minutes, or your next order is on us." },
  { Icon:RecycleIcon, title:"Sustainable",        desc:"We use 100% eco-friendly packaging and work hard to minimize our carbon footprint every day." },
  { Icon:HeartIcon,   title:"Made with Love",     desc:"Every recipe is crafted with care and passion — you'll taste the difference in every single bite." },
  { Icon:TrophyIcon,  title:"Award Winning",      desc:"Recognized as the Best Food Delivery Service for 5 consecutive years by the City Food Awards." },
]

export function AboutValues() {
  const [hovered, setHovered]   = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section style={{
      backgroundColor: "#fafaf8",
      padding: isMobile ? "56px 1.25rem" : "100px 2rem",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #111",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        .values-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        @media(max-width:900px) { .values-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:500px) { .values-grid { grid-template-columns:1fr !important; } }
        .val-card { transition:all 0.22s ease !important; }
        .val-card:hover { transform:translateY(-5px) !important; }
      `}</style>

      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.13, backgroundImage:"radial-gradient(circle,#f97316 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
      {/* Warm blob */}
      <div style={{ position:"absolute", bottom:"-60px", right:"-60px", width:"380px", height:"380px", background:"radial-gradient(circle,#fff3e8 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:2 }}>

        {/* ── Header ── */}
        <div style={{ textAlign:isMobile?"left":"center", marginBottom:isMobile?"32px":"56px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"999px", padding:"5px 14px", marginBottom:"14px", boxShadow:"3px 3px 0px #f97316" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#f97316", display:"inline-block", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne',sans-serif" }}>What Drives Us</span>
          </div>
          <h2 style={{ fontSize:isMobile?"clamp(28px,8vw,38px)":"clamp(28px,4vw,46px)", fontWeight:800, color:"#111", letterSpacing:"-2px", lineHeight:1.0, margin:0, fontFamily:"'Syne',sans-serif" }}>
            Our Core <span style={{ color:"#f97316", fontStyle:"italic" }}>Values.</span>
          </h2>
        </div>

        {/* ── Cards ── */}
        <div className="values-grid">
          {values.map(({ Icon, title, desc }) => {
            const isHov = hovered === title
            return (
              <div
                key={title}
                className="val-card"
                onMouseEnter={() => setHovered(title)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: isMobile ? "24px 20px" : "28px 24px",
                  borderRadius:"16px",
                  backgroundColor:"#fff",
                  border:`2px solid ${isHov ? "#f97316" : "#111"}`,
                  boxShadow: isHov ? "6px 6px 0px #f97316" : "4px 4px 0px #111",
                  cursor:"pointer",
                }}
              >
                {/* Icon box */}
                <div style={{ width:"48px", height:"48px", backgroundColor: isHov ? "#f97316" : "#fff3e8", border:`2px solid ${isHov ? "#f97316" : "#f97316"}`, borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"18px", boxShadow: isHov ? "3px 3px 0px #c2540a" : "2px 2px 0px #f97316", transition:"all 0.2s" }}>
                  {/* Re-colour icon to white when hovered */}
                  <div style={{ filter: isHov ? "brightness(0) invert(1)" : "none", transition:"filter 0.2s" }}>
                    <Icon />
                  </div>
                </div>

                <h3 style={{ fontWeight:800, fontSize:"16px", color:"#111", marginBottom:"8px", fontFamily:"'Syne',sans-serif" }}>{title}</h3>
                <p style={{ color:"#888", fontSize:"13px", lineHeight:1.8, margin:0 }}>{desc}</p>

                {/* Bottom accent bar on hover */}
                <div style={{ marginTop:"18px", height:"3px", borderRadius:"2px", backgroundColor: isHov ? "#f97316" : "#f0f0f0", transition:"background-color 0.2s" }} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}