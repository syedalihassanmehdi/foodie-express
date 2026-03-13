"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

export function OffersHero() {
  const [mounted, setMounted] = useState(false)
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
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes float-card { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
        @keyframes float-card2 { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-8px) rotate(-1.5deg)} }
        @keyframes fade-up  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin-ring { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .anim-1{animation:fade-up 0.6s ease both 0.05s}
        .anim-2{animation:fade-up 0.6s ease both 0.18s}
        .anim-3{animation:fade-up 0.6s ease both 0.3s}
        .anim-4{animation:fade-up 0.6s ease both 0.42s}
        .anim-5{animation:fade-up 0.6s ease both 0.54s}
        .offers-ring{animation:spin-ring 24s linear infinite}
        .offer-float-1{animation:float-card 4s ease-in-out infinite}
        .offer-float-2{animation:float-card2 5s ease-in-out infinite 0.5s}
        .offers-cta-primary:hover{transform:translateY(-3px)!important;box-shadow:5px 5px 0px #111!important}
        .offers-cta-secondary:hover{transform:translateY(-3px)!important;background:#f97316!important;color:#fff!important;box-shadow:5px 5px 0px #111!important}
        .offers-stat:hover{transform:translateY(-3px)!important;box-shadow:5px 5px 0px #f97316!important;border-color:#f97316!important}
      `}</style>

      {/* Dot grid texture */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.18, backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize:"30px 30px" }} />

      {/* Decorative ring — desktop */}
      {!isMobile && (
        <div className="offers-ring" style={{ position:"absolute", right:"-120px", top:"50%", marginTop:"-280px", width:"560px", height:"560px", borderRadius:"50%", border:"2px dashed rgba(249,115,22,0.2)", pointerEvents:"none", zIndex:1 }} />
      )}

      {/* Orange left bar */}
      <div style={{ position:"absolute", top:0, left:0, width:"6px", height:"100%", backgroundColor:"#f97316", borderRight:"2px solid #111", zIndex:3 }} />

      {/* Main flex content */}
      <div style={{
        flex:1, position:"relative", zIndex:2,
        maxWidth:"1100px", width:"100%", margin:"0 auto",
        padding: isMobile ? "0 1.25rem" : "0 2rem",
        display:"flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems:"center",
        justifyContent:"center",
        gap: isMobile ? "40px" : "72px",
        paddingTop: isMobile ? "64px" : "0",
        paddingBottom: isMobile ? "56px" : "0",
      }}>

        {/* ── LEFT TEXT ── */}
        <div style={{ flex:1, minWidth:0 }}>
          {mounted && (
            <div className="anim-1" style={{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"999px", padding:"5px 14px", marginBottom:"22px", boxShadow:"3px 3px 0px #f97316", width:"fit-content" }}>
              <TagIcon />
              <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne', sans-serif" }}>Limited Time Only</span>
            </div>
          )}

          {mounted && (
            <h1 className="anim-2" style={{ fontSize:isMobile?"clamp(36px,10vw,52px)":"clamp(44px,5.5vw,72px)", fontWeight:800, letterSpacing:"-3px", lineHeight:1.0, margin:"0 0 18px", fontFamily:"'Syne', sans-serif" }}>
              <span style={{ color:"#111" }}>Hot Deals</span><br />
              <span style={{ color:"#f97316", fontStyle:"italic" }}>&amp; Offers.</span>
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
            <p className="anim-4" style={{ color:"#777", fontSize:isMobile?"14px":"15px", lineHeight:1.75, margin:"0 0 36px", maxWidth:"400px" }}>
              Grab our freshest discounts before they're gone. New deals drop every Monday — don't miss out.
            </p>
          )}

          {/* CTAs */}
          {mounted && (
            <div className="anim-5" style={{ display:"flex", gap:"12px", flexWrap:"wrap", flexDirection:isMobile?"column":"row", marginBottom:"40px" }}>
              <Link href="/menu" className="offers-cta-primary" style={{
                display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px",
                backgroundColor:"#f97316", color:"#fff",
                padding:"13px 28px", borderRadius:"12px",
                fontSize:"14px", fontWeight:700, textDecoration:"none",
                fontFamily:"'Syne', sans-serif",
                border:"2px solid #111",
                boxShadow:"4px 4px 0px #111",
                transition:"all 0.2s ease",
              }}>
                <CartIcon /> Order Now &amp; Save
              </Link>
              <Link href="/menu" className="offers-cta-secondary" style={{
                display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px",
                backgroundColor:"#fff", color:"#f97316",
                padding:"13px 28px", borderRadius:"12px",
                fontSize:"14px", fontWeight:700, textDecoration:"none",
                fontFamily:"'Syne', sans-serif",
                border:"2px solid #f97316",
                boxShadow:"4px 4px 0px #f97316",
                transition:"all 0.2s ease",
              }}>
                Browse Menu <ArrowIcon />
              </Link>
            </div>
          )}

          {/* Stats */}
          {mounted && (
            <div style={{ display:"flex", gap:isMobile?"10px":"14px", flexWrap:"wrap" }}>
              {[["4+","Active Deals"],["Up to 20%","Max Discount"],["Every Mon","New Drops"]].map(([val, label]) => (
                <div key={label} className="offers-stat" style={{
                  backgroundColor:"#fff", border:"2px solid #111",
                  borderRadius:"12px", padding:"12px 16px",
                  boxShadow:"3px 3px 0px #111",
                  transition:"all 0.2s", textAlign:"center", minWidth:"90px",
                }}>
                  <div style={{ fontSize:"18px", fontWeight:800, color:"#f97316", letterSpacing:"-0.5px", fontFamily:"'Syne', sans-serif", lineHeight:1 }}>{val}</div>
                  <div style={{ fontSize:"10px", color:"#aaa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.8px", marginTop:"3px" }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT VISUAL ── */}
        {mounted && !isMobile && (
          <div style={{ position:"relative", flexShrink:0, width:"340px", height:"380px" }}>

            {/* Main deal card */}
            <div className="offer-float-1" style={{
              position:"absolute", top:"20px", right:"0",
              width:"280px",
              backgroundColor:"#fff", border:"2px solid #111",
              borderRadius:"20px", padding:"24px",
              boxShadow:"6px 6px 0px #111",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
                <div style={{ width:"48px", height:"48px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", boxShadow:"2px 2px 0px #f97316" }}>🍕</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:"14px", color:"#111", fontFamily:"'Syne', sans-serif" }}>Pizza Monday</div>
                  <div style={{ fontSize:"12px", color:"#aaa" }}>Every week</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:"11px", color:"#aaa", fontWeight:500, textDecoration:"line-through" }}>$18.99</div>
                  <div style={{ fontSize:"24px", fontWeight:800, color:"#f97316", fontFamily:"'Syne', sans-serif", letterSpacing:"-1px" }}>$13.99</div>
                </div>
                <div style={{ backgroundColor:"#f97316", border:"2px solid #111", borderRadius:"10px", padding:"6px 12px", boxShadow:"2px 2px 0px #111" }}>
                  <span style={{ color:"#fff", fontSize:"12px", fontWeight:800, fontFamily:"'Syne', sans-serif" }}>26% OFF</span>
                </div>
              </div>
            </div>

            {/* Secondary deal card */}
            <div className="offer-float-2" style={{
              position:"absolute", bottom:"0", left:"0",
              width:"220px",
              backgroundColor:"#fff3e8", border:"2px solid #f97316",
              borderRadius:"16px", padding:"16px",
              boxShadow:"5px 5px 0px #f97316",
            }}>
              <div style={{ fontSize:"20px", marginBottom:"8px" }}>🍔</div>
              <div style={{ fontWeight:800, fontSize:"13px", color:"#111", fontFamily:"'Syne', sans-serif", marginBottom:"4px" }}>Burger Combo</div>
              <div style={{ fontSize:"12px", color:"#888" }}>Use code <span style={{ fontWeight:800, color:"#f97316", fontFamily:"monospace" }}>COMBO20</span></div>
            </div>

            {/* "New" badge */}
            <div style={{
              position:"absolute", top:"-8px", left:"20px",
              backgroundColor:"#111", border:"2px solid #111",
              borderRadius:"999px", padding:"5px 14px",
              boxShadow:"2px 2px 0px #f97316",
            }}>
              <span style={{ color:"#f97316", fontSize:"11px", fontWeight:800, fontFamily:"'Syne', sans-serif", letterSpacing:"1px" }}>✦ LIVE DEALS</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom orange bar */}
      <div style={{ height:"4px", backgroundColor:"#f97316", flexShrink:0 }} />
    </section>
  )
}