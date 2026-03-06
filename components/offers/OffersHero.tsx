"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

export function OffersHero() {
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <section style={{
      backgroundColor: "#0a0a0a", padding: "100px 2rem 80px",
      fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
    }}>

      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }`}</style>

      {/* Top rule */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.4), transparent)" }} />

      {/* Glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "500px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grain */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "128px", pointerEvents: "none" }} />

      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: "999px", padding: "6px 16px", marginBottom: "28px",
          opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Limited Time Only</span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-3px", lineHeight: 1.0,
          margin: "0 0 20px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
        }}>
          <span style={{ color: "#fff" }}>Hot Deals</span><br />
          <span style={{ color: "transparent", WebkitTextStroke: "2px #f97316", fontStyle: "italic" }}>& Offers 🔥</span>
        </h1>

        {/* Divider */}
        <div style={{ width: "48px", height: "3px", backgroundColor: "#f97316", borderRadius: "2px", margin: "0 auto 24px", opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.25s" }} />

        {/* Description */}
        <p style={{
          color: "#666", fontSize: "17px", lineHeight: 1.75, margin: "0 auto 40px", maxWidth: "520px",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.7s ease 0.3s",
        }}>
          Grab our freshest discounts before they're gone. New deals drop every Monday — don't miss out.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap",
          opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.4s",
        }}>
          <Link
            href="/menu"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              backgroundColor: "#f97316", color: "#fff",
              padding: "15px 36px", borderRadius: "999px",
              fontSize: "15px", fontWeight: 700, textDecoration: "none",
              boxShadow: hovered ? "0 0 60px rgba(249,115,22,0.5), 0 8px 30px rgba(249,115,22,0.3)" : "0 0 30px rgba(249,115,22,0.2)",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              transition: "all 0.2s ease",
            }}
          >
            🛒 Order Now & Save
          </Link>
          <Link
            href="/menu"
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              backgroundColor: "transparent", color: "#fff",
              padding: "15px 36px", borderRadius: "999px",
              fontSize: "15px", fontWeight: 600, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"; e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.06)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.backgroundColor = "transparent" }}
          >
            Browse Menu
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "40px", marginTop: "52px", flexWrap: "wrap",
          opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.55s",
        }}>
          {[["4+", "Active Deals"], ["Up to 20%", "Max Discount"], ["Every Mon", "New Drops"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{val}</div>
              <div style={{ fontSize: "11px", color: "#555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.2), transparent)" }} />
    </section>
  )
}