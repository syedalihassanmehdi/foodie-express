"use client"

import { useState, useEffect, useRef } from "react"

const reviews = [
  {
    text: "The Truffle Pepperoni is life-changing. Delivery was super fast and the food arrived piping hot. Best food app I've ever used!!",
    name: "Sarah Jenkins", role: "Food Critic, NYC",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    stars: 5, dish: "Truffle Pepperoni Pizza",
    dishImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80",
  },
  {
    text: "Premium quality ingredients in every bite. I order from FoodieExpress 3 times a week. Never disappoints. The carbonara is unreal.",
    name: "Michael Ross", role: "Loyal Customer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    stars: 5, dish: "Spaghetti Carbonara",
    dishImage: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=100&q=80",
  },
  {
    text: "Honestly didn't expect food delivery to be this good. The wagyu burger had me speechless. Will be ordering every Friday night.",
    name: "Priya Mehta", role: "Home Chef & Blogger",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80",
    stars: 5, dish: "Truffle Wagyu Burger",
    dishImage: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=100&q=80",
  },
  {
    text: "Arrived in 22 minutes. The lava cake was still warm and perfectly gooey. I've tried every dessert on the menu — no regrets.",
    name: "James Okafor", role: "Dessert Enthusiast",
    avatar: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=100&q=80",
    stars: 5, dish: "Chocolate Lava Cake",
    dishImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&q=80",
  },
  {
    text: "Best caesar salad I've had outside of a restaurant. The croutons are insane. Fast, fresh, and worth every penny.",
    name: "Olivia Grant", role: "Fitness Coach",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
    stars: 5, dish: "Caesar Supreme",
    dishImage: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&q=80",
  },
]

export function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const goTo = (index: number) => {
    if (animating || index === active) return
    setAnimating(true)
    setTimeout(() => { setActive(index); setAnimating(false) }, 300)
  }

  const prev = () => goTo((active - 1 + reviews.length) % reviews.length)
  const next = () => goTo((active + 1) % reviews.length)

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [active])

  const r = reviews[active]

  return (
    <section style={{
      backgroundColor: "#0a0a0a", padding: isMobile ? "64px 1.5rem" : "100px 2rem",
      fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
    }}>

      {/* Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "700px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top rule */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: isMobile ? "40px" : "64px", flexWrap: "wrap", gap: "20px",
        }}>
          <div>
            <p style={{ color: "#f97316", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Real People. Real Food.</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1.1, margin: 0 }}>
              50,000+ Happy<br />
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px #f97316", fontStyle: "italic" }}>Foodies.</span>
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {[prev, next].map((fn, i) => (
              <button key={i} onClick={fn} style={{
                width: "44px", height: "44px", borderRadius: "50%",
                backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff", fontSize: "16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.1)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.backgroundColor = "transparent" }}
              >{i === 0 ? "←" : "→"}</button>
            ))}
          </div>
        </div>

        {/* Main content — stacks on mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 300px",
          gap: "24px", alignItems: "stretch",
        }}>

          {/* Quote card */}
          <div style={{
            backgroundColor: "#111", borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: isMobile ? "28px" : "48px",
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            minHeight: isMobile ? "auto" : "320px",
          }}>
            <div style={{ fontSize: "60px", lineHeight: 0.8, color: "rgba(249,115,22,0.2)", fontWeight: 800, marginBottom: "20px", fontFamily: "Georgia, serif" }}>"</div>
            <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
              {Array.from({ length: r.stars }).map((_, i) => (
                <span key={i} style={{ color: "#f97316", fontSize: "14px" }}>★</span>
              ))}
            </div>
            <p style={{ color: "#ccc", fontSize: isMobile ? "15px" : "18px", lineHeight: 1.75, margin: "0 0 32px", flex: 1 }}>
              {r.text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <img src={r.avatar} alt={r.name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(249,115,22,0.3)", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>{r.name}</div>
                <div style={{ fontSize: "12px", color: "#555", marginTop: "1px" }}>{r.role}</div>
              </div>
              <div style={{ marginLeft: isMobile ? "0" : "auto", display: "flex", alignItems: "center", gap: "7px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: "100px", padding: "5px 11px" }}>
                <img src={r.dishImage} alt={r.dish} style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }} />
                <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, whiteSpace: "nowrap" }}>{r.dish}</span>
              </div>
            </div>
          </div>

          {/* Sidebar — hidden on mobile, replaced by dots */}
          {!isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {reviews.map((rev, i) => (
                <div key={rev.name} onClick={() => goTo(i)} style={{
                  backgroundColor: i === active ? "rgba(249,115,22,0.08)" : "#111",
                  border: `1px solid ${i === active ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: "14px", padding: "12px 14px",
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: "10px",
                  opacity: i === active ? 1 : 0.45,
                }}
                  onMouseEnter={e => { if (i !== active) { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.15)" } }}
                  onMouseLeave={e => { if (i !== active) { e.currentTarget.style.opacity = "0.45"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)" } }}
                >
                  <img src={rev.avatar} alt={rev.name} style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontWeight: 700, fontSize: "12px", color: i === active ? "#fff" : "#888" }}>{rev.name}</div>
                    <div style={{ fontSize: "11px", color: "#444", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rev.dish}</div>
                  </div>
                  {i === active && <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", flexShrink: 0 }} />}
                </div>
              ))}
              <div style={{ marginTop: "6px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "100px", height: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", backgroundColor: "#f97316", borderRadius: "100px", width: `${((active + 1) / reviews.length) * 100}%`, transition: "width 0.4s ease" }} />
              </div>
              <p style={{ fontSize: "11px", color: "#444", textAlign: "right", margin: 0 }}>{active + 1} / {reviews.length}</p>
            </div>
          ) : (
            /* Mobile dot indicators */
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              {reviews.map((_, i) => (
                <div key={i} onClick={() => goTo(i)} style={{
                  width: i === active ? "24px" : "8px", height: "8px",
                  borderRadius: "100px", cursor: "pointer",
                  backgroundColor: i === active ? "#f97316" : "rgba(255,255,255,0.15)",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Stats — 1 col on mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "1px", backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: "16px", overflow: "hidden", marginTop: "32px",
        }}>
          {[["50,000+", "Customers Served"], ["4.9 / 5.0", "Average Rating"], ["12 Cities", "And Growing"]].map(([val, label]) => (
            <div key={label} style={{ backgroundColor: "#0a0a0a", padding: isMobile ? "20px" : "28px", textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>{val}</div>
              <div style={{ fontSize: "11px", color: "#555", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.8px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.2), transparent)" }} />
    </section>
  )
}