"use client"
import { useEffect, useState } from "react"
import { Category } from "@/lib/menuData"

export function MenuHero({ category }: { category: Category }) {
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
      position: "relative",
      height: isMobile ? "340px" : "420px",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
      borderBottom: "2px solid #111",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        @keyframes fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .menuhero-anim-1{animation:fade-up 0.55s ease both 0.05s}
        .menuhero-anim-2{animation:fade-up 0.55s ease both 0.18s}
        .menuhero-anim-3{animation:fade-up 0.55s ease both 0.28s}
      `}</style>

      {/* BG photo */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`url('${category.image}')`, backgroundSize:"cover", backgroundPosition:"center", filter:"brightness(0.32) saturate(1.1)" }} />

      {/* Warm gradient overlay */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(249,115,22,0.28) 0%, transparent 55%), linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.65) 100%)" }} />

      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.15, backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize:"28px 28px" }} />

      {/* Orange left bar */}
      <div style={{ position:"absolute", top:0, left:0, width:"6px", height:"100%", backgroundColor:"#f97316", borderRight:"2px solid #111", zIndex:3 }} />

      {/* Orange bottom bar */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"4px", backgroundColor:"#f97316", zIndex:3 }} />

      {/* Content */}
      <div style={{
        position:"relative", zIndex:10,
        maxWidth:"1100px", margin:"0 auto",
        padding: isMobile ? "0 1.25rem" : "0 2rem",
        flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
      }}>

        {/* Badge */}
        {mounted && (
          <div className="menuhero-anim-1" style={{
            display:"inline-flex", alignItems:"center", gap:"8px",
            backgroundColor:"#fff3e8", border:"2px solid #f97316",
            borderRadius:"999px", padding:"5px 14px", marginBottom:"16px",
            width:"fit-content", boxShadow:"3px 3px 0px #f97316",
          }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#f97316", display:"inline-block" }} />
            <span style={{ color:"#f97316", fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne', sans-serif" }}>Our Menu</span>
          </div>
        )}

        {/* Title */}
        {mounted && (
          <h1 className="menuhero-anim-2" style={{
            fontSize: isMobile ? "clamp(30px,8vw,44px)" : "clamp(38px,5vw,58px)",
            fontWeight:800, color:"#fff",
            letterSpacing:"-2px", lineHeight:1.0,
            marginBottom:"12px", fontFamily:"'Syne', sans-serif",
            textShadow:"2px 2px 0px rgba(0,0,0,0.4)",
          }}>
            {category.name}
          </h1>
        )}

        {/* Desc */}
        {mounted && (
          <p className="menuhero-anim-3" style={{
            color:"rgba(255,255,255,0.68)",
            fontSize: isMobile ? "13px" : "15px",
            maxWidth:"480px", lineHeight:1.75,
          }}>
            {category.desc}
          </p>
        )}
      </div>
    </section>
  )
}