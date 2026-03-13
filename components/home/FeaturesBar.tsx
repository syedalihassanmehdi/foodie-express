"use client"
import { useEffect, useState } from "react"

const features = [
  {
    title: "Fast Delivery",
    subtitle: "Under 30 mins",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    title: "Fresh Organic",
    subtitle: "Farm to doorstep",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12M12 12C12 12 7 10 5 6c4 0 7 2 7 6zM12 12c0 0 5-2 7-6-4 0-7 2-7 6z"/>
      </svg>
    ),
  },
  {
    title: "Top Rated",
    subtitle: "5-star gourmet chefs",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#f97316">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    title: "24/7 Service",
    subtitle: "Always open for you",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
]

export function FeaturesBar() {
  const [cols, setCols] = useState(4)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setCols(w < 480 ? 1 : w < 900 ? 2 : 4)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <section style={{
      backgroundColor: "#fafaf8",
      borderTop: "2px solid #111",
      borderBottom: "2px solid #111",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .feature-card:hover { background: #fff8f2 !important; transform: translateY(-2px); }
        .feature-card:hover .feature-icon-box { background: #f97316 !important; border-color: #f97316 !important; box-shadow: 2px 2px 0px #c2540a !important; }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {features.map((f, i) => (
          <div
            key={f.title}
            className="feature-card"
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "22px 24px",
              backgroundColor: "#fafaf8",
              borderRight: cols > 1 && i < features.length - 1 && (i + 1) % cols !== 0 ? "2px solid #111" : "none",
              borderBottom: cols < 4 && i < features.length - cols ? "2px solid #111" : "none",
              cursor: "default",
              transition: "background 0.2s, transform 0.2s",
            }}
          >
            <div
              className="feature-icon-box"
              style={{
                width: "46px", height: "46px", borderRadius: "12px",
                backgroundColor: "#fff3e8",
                border: "2px solid #f97316",
                boxShadow: "3px 3px 0px #f97316",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.2s",
              }}
            >
              {f.icon}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "14px", color: "#111", letterSpacing: "-0.3px", fontFamily: "'Syne', sans-serif" }}>{f.title}</div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>{f.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}