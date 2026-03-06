"use client"
import { useState, useEffect } from "react"

export function LoyaltyBanner() {
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "80px 2rem", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }`}</style>

      {/* Top divider with diamond */}
      <div style={{ position: "relative", marginBottom: "64px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.4), transparent)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: "10px", height: "10px", backgroundColor: "#f97316", boxShadow: "0 0 12px rgba(249,115,22,0.6)" }} />
      </div>

      {/* Glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: "999px", padding: "6px 16px", marginBottom: "24px",
          opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Members Only</span>
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1,
          margin: "0 0 16px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
        }}>
          <span style={{ color: "#fff" }}>Join Our </span>
          <span style={{ color: "transparent", WebkitTextStroke: "2px #f97316", fontStyle: "italic" }}>Loyalty</span>
          <br />
          <span style={{ color: "#f97316" }}>Program.</span>
        </h2>

        {/* Divider */}
        <div style={{ width: "40px", height: "3px", backgroundColor: "#f97316", borderRadius: "2px", margin: "0 auto 20px", opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }} />

        {/* Description */}
        <p style={{
          color: "#666", fontSize: "16px", lineHeight: 1.75, margin: "0 0 36px",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.7s ease 0.3s",
        }}>
          Earn points on every order and unlock exclusive member-only deals. Your <span style={{ color: "#f97316", fontWeight: 700 }}>5th order is always free.</span>
        </p>

        {/* Perks row */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: "36px",
          opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.4s",
        }}>
          {[["⭐", "Earn Points"], ["🎁", "Free Orders"], ["🏷️", "Member Deals"]].map(([icon, label]) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "100px", padding: "8px 16px",
            }}>
              <span style={{ fontSize: "14px" }}>{icon}</span>
              <span style={{ fontSize: "12px", color: "#666", fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}>
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              backgroundColor: "#f97316", color: "#fff",
              padding: "15px 36px", borderRadius: "999px",
              fontSize: "15px", fontWeight: 700, cursor: "pointer",
              boxShadow: hovered ? "0 0 60px rgba(249,115,22,0.5), 0 8px 30px rgba(249,115,22,0.3)" : "0 0 30px rgba(249,115,22,0.2)",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              transition: "all 0.2s ease",
            }}
          >
            ⭐ Join Free — Start Earning
          </div>
        </div>
      </div>

      {/* Bottom divider with diamond */}
      <div style={{ position: "relative", marginTop: "64px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.4), transparent)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: "10px", height: "10px", backgroundColor: "#f97316", boxShadow: "0 0 12px rgba(249,115,22,0.6)" }} />
      </div>
    </section>
  )
}