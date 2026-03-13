"use client"
import { useState, useEffect } from "react"

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
  return {
    hours:   Math.floor(diff / 1000 / 60 / 60) % 24,
    minutes: Math.floor(diff / 1000 / 60) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  }
}

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
)

export function CountdownTimer() {
  const [target] = useState(() => new Date(Date.now() + 1000 * 60 * 60 * 23))
  const [time, setTime] = useState(getTimeLeft(target))
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(interval)
  }, [target])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")

  const Box = ({ value, label }: { value: number; label: string }) => (
    <div style={{ textAlign:"center" }}>
      <div style={{
        backgroundColor:"#fff",
        border:"2px solid #111",
        borderRadius:"16px",
        padding: isMobile ? "16px 20px" : "20px 28px",
        fontSize: isMobile ? "36px" : "48px",
        fontWeight:800,
        letterSpacing:"-2px",
        minWidth: isMobile ? "72px" : "96px",
        color:"#111",
        fontFamily:"'Syne', sans-serif",
        boxShadow:"4px 4px 0px #f97316",
        position:"relative" as const,
        overflow:"hidden" as const,
        lineHeight:1,
      }}>
        {/* subtle warm tint */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(249,115,22,0.06) 0%, transparent 60%)", pointerEvents:"none" }} />
        <span style={{ position:"relative", zIndex:1 }}>{pad(value)}</span>
      </div>
      <p style={{ color:"#aaa", fontSize:"10px", fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", marginTop:"10px", fontFamily:"'Syne', sans-serif" }}>{label}</p>
    </div>
  )

  const Sep = () => (
    <span style={{ fontSize: isMobile ? "36px" : "48px", fontWeight:800, color:"#f97316", marginTop: isMobile ? "12px" : "16px", lineHeight:1, fontFamily:"'Syne', sans-serif", flexShrink:0 }}>:</span>
  )

  return (
    <section style={{
      backgroundColor:"#fafaf8",
      padding: isMobile ? "48px 1.25rem" : "64px 2rem",
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
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"500px", height:"250px", borderRadius:"50%", background:"radial-gradient(ellipse, #fff3e8 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.15, backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize:"32px 32px" }} />

      <div style={{ maxWidth:"640px", margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>

        {/* Badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"999px", padding:"5px 14px", marginBottom:"20px", boxShadow:"3px 3px 0px #f97316" }}>
          <ClockIcon />
          <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne', sans-serif" }}>Hurry Up!</span>
        </div>

        <h2 style={{ fontSize:"clamp(20px, 3vw, 30px)", fontWeight:800, color:"#111", margin:"0 0 32px", letterSpacing:"-0.5px", fontFamily:"'Syne', sans-serif" }}>
          Today's Deals Expire In
        </h2>

        <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", gap: isMobile ? "8px" : "14px", flexWrap:"nowrap" }}>
          <Box value={time.hours}   label="Hours"   />
          <Sep />
          <Box value={time.minutes} label="Minutes" />
          <Sep />
          <Box value={time.seconds} label="Seconds" />
        </div>
      </div>
    </section>
  )
}