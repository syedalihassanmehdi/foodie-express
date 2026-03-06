"use client"
import { useState, useEffect } from "react"

export function CategoryHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <section style={{
      backgroundColor: "#0a0a0a",
      padding: "80px 2rem 72px",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>

      {/* Top rule */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)" }} />

      {/* Radial glow */}
      <div style={{ position: "absolute", top: "50%", left: "30%", transform: "translate(-50%, -50%)", width: "600px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grain overlay */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "128px", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "32px" }}>

          {/* Left — Text */}
          <div style={{ maxWidth: "580px" }}>

            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "rgba(249,115,22,0.08)",
              border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: "999px", padding: "6px 14px", marginBottom: "24px",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Explore Our Menu</span>
            </div>

            {/* Heading */}
            <div style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}>
              <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 20px" }}>
                <span style={{ color: "#fff" }}>Discover</span>{" "}
                <span style={{ color: "transparent", WebkitTextStroke: "2px #f97316", fontStyle: "italic" }}>Flavours</span>
                <br />
                <span style={{ color: "#fff" }}>Crafted with</span>{" "}
                <span style={{ color: "#f97316" }}>Passion.</span>
              </h1>
            </div>

            {/* Divider */}
            <div style={{
              width: "48px", height: "3px", backgroundColor: "#f97316",
              borderRadius: "2px", marginBottom: "20px",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.6s ease 0.3s",
            }} />

            {/* Description */}
            <p style={{
              color: "#666", fontSize: "16px", lineHeight: 1.75,
              margin: "0 0 32px",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
            }}>
              From wood-fired classics to contemporary delights — every dish is crafted from premium ingredients sourced daily. Explore our hand-picked categories and find your next favourite meal.
            </p>

            {/* Stats row */}
            <div style={{
              display: "flex", gap: "32px", flexWrap: "wrap",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.7s ease 0.5s",
            }}>
              {[["6", "Categories"], ["100+", "Menu Items"], ["4.9★", "Avg Rating"]].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{val}</div>
                  <div style={{ fontSize: "11px", color: "#555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "2px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating category pills */}
          <div style={{
            display: "flex", flexDirection: "column", gap: "10px",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.8s ease 0.4s",
          }}>
            {[
              { emoji: "🍕", name: "Pizzas", count: "6 items" },
              { emoji: "🍔", name: "Burgers", count: "6 items" },
              { emoji: "🍝", name: "Pasta", count: "6 items" },
              { emoji: "🥗", name: "Salads", count: "6 items" },
              { emoji: "🥩", name: "Steaks", count: "6 items" },
              { emoji: "🍰", name: "Desserts", count: "6 items" },
            ].map((cat, i) => (
              <div
                key={cat.name}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px", padding: "10px 16px",
                  animation: `floatBadge ${3 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                  minWidth: "160px",
                }}
              >
                <span style={{ fontSize: "18px" }}>{cat.emoji}</span>
                <div>
                  <div style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>{cat.name}</div>
                  <div style={{ color: "#555", fontSize: "11px" }}>{cat.count}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "#f97316", fontSize: "11px", fontWeight: 700 }}>→</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom rule */}
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.15), transparent)" }} />
    </section>
  )
}