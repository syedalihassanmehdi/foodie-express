"use client"

import { useState, useEffect, useRef } from "react"

const reviews = [
  { text: "The Truffle Pepperoni is life-changing. Delivery was super fast and the food arrived piping hot. Best food app I've ever used!!", name: "Sarah Jenkins", role: "Food Critic, NYC", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", stars: 5, dish: "Truffle Pepperoni Pizza", dishImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80" },
  { text: "Premium quality ingredients in every bite. I order from FoodieExpress 3 times a week. Never disappoints. The carbonara is unreal.", name: "Michael Ross", role: "Loyal Customer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", stars: 5, dish: "Spaghetti Carbonara", dishImage: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=100&q=80" },
  { text: "Honestly didn't expect food delivery to be this good. The wagyu burger had me speechless. Will be ordering every Friday night.", name: "Priya Mehta", role: "Home Chef & Blogger", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80", stars: 5, dish: "Truffle Wagyu Burger", dishImage: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=100&q=80" },
  { text: "Arrived in 22 minutes. The lava cake was still warm and perfectly gooey. I've tried every dessert on the menu — no regrets.", name: "James Okafor", role: "Dessert Enthusiast", avatar: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=100&q=80", stars: 5, dish: "Chocolate Lava Cake", dishImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&q=80" },
  { text: "Best caesar salad I've had outside of a restaurant. The croutons are insane. Fast, fresh, and worth every penny.", name: "Olivia Grant", role: "Fitness Coach", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80", stars: 5, dish: "Caesar Supreme", dishImage: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&q=80" },
]

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f97316">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
)
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
)

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
      backgroundColor: "#fafaf8",
      padding: isMobile ? "64px 1.5rem" : "80px 2rem",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #111",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .nav-btn:hover { background: #f97316 !important; border-color: #f97316 !important; color: #fff !important; box-shadow: 3px 3px 0px #111 !important; }
        .sidebar-item:hover { border-color: rgba(249,115,22,0.3) !important; opacity: 0.85 !important; }
      `}</style>

      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.25, backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      {/* Warm blob */}
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "380px", height: "380px", background: "radial-gradient(circle, #fff3e8 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: isMobile ? "40px" : "56px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "#fff3e8", border: "2px solid #f97316",
              borderRadius: "999px", padding: "5px 14px", marginBottom: "14px",
              boxShadow: "3px 3px 0px #f97316",
            }}>
              <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>Real People. Real Food.</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#111", letterSpacing: "-2px", lineHeight: 1.0, margin: 0, fontFamily: "'Syne', sans-serif" }}>
              50,000+ Happy<br />
              <span style={{ color: "#f97316", fontStyle: "italic" }}>Foodies.</span>
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {[{ fn: prev, icon: <ChevronLeft /> }, { fn: next, icon: <ChevronRight /> }].map(({ fn, icon }, i) => (
              <button key={i} onClick={fn} className="nav-btn" style={{
                width: "44px", height: "44px", borderRadius: "12px",
                backgroundColor: "#fff", border: "2px solid #111",
                color: "#111", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                boxShadow: "3px 3px 0px #111",
              }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 280px", gap: "16px", alignItems: "stretch" }}>

          {/* Quote card */}
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            border: "2px solid #111",
            padding: isMobile ? "28px" : "44px",
            boxShadow: "6px 6px 0px #111",
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            minHeight: isMobile ? "auto" : "300px",
          }}>
            {/* Large quote mark */}
            <div style={{ fontSize: "72px", lineHeight: 0.7, color: "#f97316", fontWeight: 800, marginBottom: "20px", fontFamily: "Georgia, serif", opacity: 0.25 }}>"</div>

            {/* Stars */}
            <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
              {Array.from({ length: r.stars }).map((_, i) => <span key={i}><StarIcon /></span>)}
            </div>

            <p style={{ color: "#444", fontSize: isMobile ? "15px" : "17px", lineHeight: 1.75, margin: "0 0 32px", flex: 1 }}>
              {r.text}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <img src={r.avatar} alt={r.name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid #111", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "14px", color: "#111", fontFamily: "'Syne', sans-serif" }}>{r.name}</div>
                <div style={{ fontSize: "12px", color: "#999", marginTop: "1px" }}>{r.role}</div>
              </div>
              <div style={{ marginLeft: isMobile ? "0" : "auto", display: "flex", alignItems: "center", gap: "7px", backgroundColor: "#fff3e8", border: "2px solid #f97316", borderRadius: "100px", padding: "5px 11px", boxShadow: "2px 2px 0px #f97316" }}>
                <img src={r.dishImage} alt={r.dish} style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover", border: "1px solid #111" }} />
                <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 700, whiteSpace: "nowrap", fontFamily: "'Syne', sans-serif" }}>{r.dish}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {!isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {reviews.map((rev, i) => (
                <div key={rev.name} onClick={() => goTo(i)} className="sidebar-item" style={{
                  backgroundColor: i === active ? "#fff3e8" : "#fff",
                  border: `2px solid ${i === active ? "#f97316" : "#e8e8e8"}`,
                  borderRadius: "14px", padding: "11px 13px",
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: "10px",
                  opacity: i === active ? 1 : 0.6,
                  boxShadow: i === active ? "3px 3px 0px #f97316" : "none",
                }}>
                  <img src={rev.avatar} alt={rev.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid #111" }} />
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontWeight: 700, fontSize: "12px", color: i === active ? "#111" : "#666", fontFamily: "'Syne', sans-serif" }}>{rev.name}</div>
                    <div style={{ fontSize: "11px", color: "#aaa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rev.dish}</div>
                  </div>
                  {i === active && <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", flexShrink: 0 }} />}
                </div>
              ))}
              {/* Progress bar */}
              <div style={{ marginTop: "4px", backgroundColor: "#e8e8e8", borderRadius: "100px", height: "3px", overflow: "hidden", border: "1px solid #d0d0d0" }}>
                <div style={{ height: "100%", backgroundColor: "#f97316", borderRadius: "100px", width: `${((active + 1) / reviews.length) * 100}%`, transition: "width 0.4s ease" }} />
              </div>
              <p style={{ fontSize: "11px", color: "#aaa", textAlign: "right", margin: 0, fontWeight: 600 }}>{active + 1} / {reviews.length}</p>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              {reviews.map((_, i) => (
                <div key={i} onClick={() => goTo(i)} style={{ width: i === active ? "24px" : "8px", height: "8px", borderRadius: "100px", cursor: "pointer", backgroundColor: i === active ? "#f97316" : "#ddd", border: "1px solid #ccc", transition: "all 0.3s ease" }} />
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", marginTop: "32px", border: "2px solid #111", borderRadius: "20px", overflow: "hidden", boxShadow: "4px 4px 0px #111" }}>
          {[["50,000+", "Customers Served"], ["4.9 / 5.0", "Average Rating"], ["12 Cities", "And Growing"]].map(([val, label], i) => (
            <div key={label} style={{ backgroundColor: i === 1 ? "#f97316" : "#fff", padding: isMobile ? "20px" : "28px", textAlign: "center", borderRight: i < 2 ? "2px solid #111" : "none" }}>
              <div style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 800, color: i === 1 ? "#fff" : "#111", letterSpacing: "-1px", fontFamily: "'Syne', sans-serif" }}>{val}</div>
              <div style={{ fontSize: "11px", color: i === 1 ? "rgba(255,255,255,0.8)" : "#aaa", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}