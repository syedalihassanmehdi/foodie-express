"use client"
import { useState, useEffect } from "react"

const PizzaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 19h20L12 2z"/><circle cx="12" cy="14" r="1.5" fill="#f97316" stroke="none"/>
    <circle cx="9" cy="17" r="1" fill="#f97316" stroke="none"/><circle cx="15" cy="17" r="1" fill="#f97316" stroke="none"/>
  </svg>
)
const BurgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11h18M3 15h18"/><path d="M5 19h14a2 2 0 0 0 2-2v-1H3v1a2 2 0 0 0 2 2z"/>
    <path d="M3 11a9 9 0 0 1 18 0"/>
  </svg>
)
const PastaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 15a9 9 0 0 0 18 0"/><path d="M3 15c0-4.97 4.03-9 9-9s9 4.03 9 9"/>
    <path d="M12 6V3"/><path d="M8 7.5L6 5"/><path d="M16 7.5l2-2.5"/>
  </svg>
)
const SaladIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12a10 10 0 0 0 20 0"/><path d="M12 12V2"/><path d="M12 7c2-2 5-2 6 0"/>
    <path d="M12 7c-2-2-5-2-6 0"/><path d="M6 17c2 2 10 2 12 0"/>
  </svg>
)
const SteakIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a4 4 0 0 0-8 0c0 1.5.5 2.5 1 3.5C12 13 12 14 12 15H8c0-1-.5-2-1.5-3S5 9.5 5 8a7 7 0 0 1 14 0c0 1.5-.5 2.5-1 3.5"/>
    <path d="M6 19h12a1 1 0 0 0 1-1v-3H5v3a1 1 0 0 0 1 1z"/>
  </svg>
)
const CakeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/>
    <path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/>
    <path d="M7 4a1 1 0 0 1 1-1 1 1 0 0 1 1 1"/><path d="M12 4a1 1 0 0 1 1-1 1 1 0 0 1 1 1"/>
    <path d="M17 4a1 1 0 0 1 1-1 1 1 0 0 1 1 1"/>
  </svg>
)
const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const ForkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)

const pills = [
  { Icon: PizzaIcon,  name: "Pizzas",   count: "121 items" },
  { Icon: BurgerIcon, name: "Burgers",  count: "54 items"  },
  { Icon: PastaIcon,  name: "Pasta",    count: "86 items"  },
  { Icon: SaladIcon,  name: "Salads",   count: "40 items"  },
  { Icon: SteakIcon,  name: "Steaks",   count: "28 items"  },
  { Icon: CakeIcon,   name: "Desserts", count: "32 items"  },
]

export function CategoryHero() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => {
      setIsMobile(window.innerWidth < 600)
      setIsTablet(window.innerWidth < 900)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section style={{
      backgroundColor: "#fafaf8",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #111",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes floatPill { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fade-up   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin-ring { from{transform:translateY(-50%) rotate(0deg)} to{transform:translateY(-50%) rotate(360deg)} }

        .anim-1{animation:fade-up 0.6s ease both 0.05s}
        .anim-2{animation:fade-up 0.6s ease both 0.18s}
        .anim-3{animation:fade-up 0.6s ease both 0.3s}
        .anim-4{animation:fade-up 0.6s ease both 0.42s}
        .anim-5{animation:fade-up 0.6s ease both 0.54s}
        .ch-ring{animation:spin-ring 26s linear infinite}
        .ch-pill:hover{border-color:#f97316!important;box-shadow:4px 4px 0px #f97316!important;transform:translateX(4px)!important}
        .ch-stat:hover{transform:translateY(-3px)!important;box-shadow:5px 5px 0px #f97316!important;border-color:#f97316!important}
      `}</style>

      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.18, backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize:"30px 30px" }} />

      {/* Decorative ring */}
      {!isTablet && (
        <div className="ch-ring" style={{ position:"absolute", right:"-100px", top:"50%", width:"480px", height:"480px", borderRadius:"50%", border:"2px dashed rgba(249,115,22,0.18)", pointerEvents:"none", zIndex:1 }} />
      )}

      {/* Orange left bar */}
      <div style={{ position:"absolute", top:0, left:0, width:"6px", height:"100%", backgroundColor:"#f97316", borderRight:"2px solid #111", zIndex:3 }} />

      {/* Main content */}
      <div style={{
        flex:1, position:"relative", zIndex:2,
        maxWidth:"1100px", width:"100%", margin:"0 auto",
        padding: isMobile ? "0 1.25rem" : "0 2rem",
        display:"flex",
        flexDirection: isTablet ? "column" : "row",
        alignItems:"center",
        justifyContent:"center",
        gap: isTablet ? "40px" : "72px",
        paddingTop: isMobile ? "64px" : isTablet ? "72px" : "0",
        paddingBottom: isMobile ? "52px" : isTablet ? "60px" : "0",
      }}>

        {/* ── LEFT TEXT ── */}
        <div style={{ flex:1, minWidth:0, maxWidth: isTablet ? "100%" : "520px" }}>

          {mounted && (
            <div className="anim-1" style={{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"999px", padding:"5px 14px", marginBottom:"22px", boxShadow:"3px 3px 0px #f97316", width:"fit-content" }}>
              <ForkIcon />
              <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne', sans-serif" }}>Explore Our Menu</span>
            </div>
          )}

          {mounted && (
            <h1 className="anim-2" style={{ fontSize:isMobile?"clamp(34px,10vw,50px)":isTablet?"clamp(42px,7vw,58px)":"clamp(44px,5vw,64px)", fontWeight:800, lineHeight:1.0, letterSpacing:"-2.5px", margin:"0 0 18px", fontFamily:"'Syne', sans-serif" }}>
              <span style={{ color:"#111" }}>Discover </span>
              <span style={{ color:"#f97316", fontStyle:"italic" }}>Flavours</span>
              <br />
              <span style={{ color:"#111" }}>Crafted with </span>
              <span style={{ color:"#f97316" }}>Passion.</span>
            </h1>
          )}

          {mounted && (
            <div className="anim-3" style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"18px" }}>
              {[36,12,6].map((w,i) => (
                <div key={i} style={{ height:"3px", width:`${w}px`, backgroundColor:i===0?"#f97316":i===1?"rgba(249,115,22,0.45)":"rgba(249,115,22,0.2)", borderRadius:"2px" }} />
              ))}
            </div>
          )}

          {mounted && (
            <p className="anim-4" style={{ color:"#777", fontSize:isMobile?"14px":"15px", lineHeight:1.75, margin:"0 0 36px", maxWidth:"420px" }}>
              From wood-fired classics to contemporary delights — every dish is crafted from premium ingredients sourced daily.
            </p>
          )}

          {/* Stats */}
          {mounted && (
            <div className="anim-5" style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              {[["6","Categories"],["100+","Menu Items"],["4.9★","Avg Rating"]].map(([val, label]) => (
                <div key={label} className="ch-stat" style={{
                  backgroundColor:"#fff", border:"2px solid #111",
                  borderRadius:"12px", padding:"12px 16px",
                  boxShadow:"3px 3px 0px #111",
                  transition:"all 0.2s", textAlign:"center", minWidth:"86px",
                }}>
                  <div style={{ fontSize:"20px", fontWeight:800, color:"#f97316", letterSpacing:"-0.5px", fontFamily:"'Syne', sans-serif", lineHeight:1 }}>{val}</div>
                  <div style={{ fontSize:"10px", color:"#aaa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.7px", marginTop:"3px" }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT PILLS ── */}
        {mounted && (
          <div style={{
            display:"flex",
            flexDirection: isTablet ? "row" : "column",
            flexWrap: isTablet ? "wrap" : "nowrap",
            gap: isMobile ? "8px" : "10px",
            width: isTablet ? "100%" : "auto",
            flexShrink: 0,
            opacity: mounted ? 1 : 0,
            transition:"opacity 0.7s ease 0.4s",
          }}>
            {pills.map(({ Icon, name, count }, i) => (
              <div key={name} className="ch-pill" style={{
                display:"flex", alignItems:"center", gap:"12px",
                backgroundColor:"#fff",
                border:"2px solid #111",
                borderRadius:"14px", padding:"10px 16px",
                animation:`floatPill ${3 + i * 0.3}s ease-in-out infinite`,
                animationDelay:`${i * 0.15}s`,
                minWidth: isTablet ? (isMobile ? "calc(50% - 4px)" : "200px") : "200px",
                flex: isTablet ? "1 1 calc(50% - 5px)" : "none",
                boxShadow:"3px 3px 0px #111",
                boxSizing:"border-box",
                transition:"all 0.2s",
                cursor:"pointer",
              }}>
                <div style={{ width:"34px", height:"34px", borderRadius:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"2px 2px 0px #f97316" }}>
                  <Icon />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:"#111", fontSize:"13px", fontWeight:700, fontFamily:"'Syne', sans-serif", whiteSpace:"nowrap" }}>{name}</div>
                  <div style={{ color:"#aaa", fontSize:"11px" }}>{count}</div>
                </div>
                <div style={{ color:"#f97316", flexShrink:0 }}><ArrowRight /></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom orange bar */}
      <div style={{ height:"4px", backgroundColor:"#f97316", flexShrink:0 }} />
    </section>
  )
}