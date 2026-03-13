"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

const categories = [
  { name: "Authentic Pizza", slug: "pizzas", items: "121 items", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { name: "Gourmet Pasta", slug: "pasta", items: "86 items", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80" },
  { name: "Fresh Salads", slug: "salads", items: "40 items", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { name: "Sweet Desserts", slug: "desserts", items: "32 items", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80" },
  { name: "Gourmet Burgers", slug: "burgers", items: "54 items", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { name: "Signature Steaks", slug: "steaks", items: "28 items", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
]

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
)
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
)

export function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const CARD_WIDTH = isMobile ? 160 : 220
  const GAP = 12
  const SCROLL_AMOUNT = (CARD_WIDTH + GAP) * 2

  const updateButtons = () => {
    const el = scrollRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 0)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  const scrollLeft = () => { scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" }); setTimeout(updateButtons, 350) }
  const scrollRight = () => { scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" }); setTimeout(updateButtons, 350) }

  return (
    <section style={{
      backgroundColor: "#fafaf8",
      padding: isMobile ? "48px 1.25rem" : "80px 2rem",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #111",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        div::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        .cat-btn:hover { background: #f97316 !important; border-color: #f97316 !important; color: #fff !important; box-shadow: 2px 2px 0px #111 !important; }
      `}</style>

      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.25, backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", marginBottom: isMobile ? "24px" : "40px", flexWrap: "wrap", gap: "16px", flexDirection: isMobile ? "column" : "row" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#fff3e8", border: "2px solid #f97316", borderRadius: "999px", padding: "5px 14px", marginBottom: "12px", boxShadow: "3px 3px 0px #f97316" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>Browse All</span>
            </div>
            <h2 style={{ fontSize: isMobile ? "32px" : "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#111", margin: 0, letterSpacing: "-2px", lineHeight: 1.0, fontFamily: "'Syne', sans-serif" }}>
              Explore<br />
              <span style={{ color: "#f97316", fontStyle: "italic" }}>Categories.</span>
            </h2>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[{ fn: scrollLeft, disabled: atStart, icon: <ChevronLeft /> }, { fn: scrollRight, disabled: atEnd, icon: <ChevronRight /> }].map(({ fn, disabled, icon }, i) => (
              <button key={i} onClick={fn} disabled={disabled} className="cat-btn" style={{
                width: "40px", height: "40px", borderRadius: "10px",
                border: `2px solid ${disabled ? "#e8e8e8" : "#111"}`,
                backgroundColor: disabled ? "#f5f5f5" : "#fff",
                color: disabled ? "#ccc" : "#111",
                cursor: disabled ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                boxShadow: disabled ? "none" : "3px 3px 0px #111",
              }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          onScroll={updateButtons}
          style={{ display: "flex", gap: `${GAP}px`, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: "6px" }}
        >
          {categories.map(cat => {
            const isHovered = hovered === cat.slug
            return (
              <Link
                key={cat.slug}
                href={`/menu/${cat.slug}`}
                onMouseEnter={() => setHovered(cat.slug)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "relative", borderRadius: "18px", overflow: "hidden",
                  height: isMobile ? "150px" : "190px",
                  minWidth: `${CARD_WIDTH}px`,
                  textDecoration: "none", display: "block", flexShrink: 0,
                  border: "2px solid #111",
                  transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                  boxShadow: isHovered ? "6px 6px 0px #f97316" : "4px 4px 0px #111",
                  transition: "all 0.25s ease",
                }}
              >
                <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", transform: isHovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.4s ease", filter: isHovered ? "brightness(0.55) saturate(1.1)" : "brightness(0.45)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 60%)" }} />
                {isHovered && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(249,115,22,0.2) 0%, transparent 60%)" }} />}
                <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px" }}>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: isMobile ? "13px" : "14px", letterSpacing: "-0.3px", fontFamily: "'Syne', sans-serif" }}>{cat.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>{cat.items}</div>
                    <div style={{ color: "#f97316", fontSize: "11px", fontWeight: 700, opacity: isHovered ? 1 : 0, transform: isHovered ? "translateX(0)" : "translateX(6px)", transition: "all 0.2s ease" }}>View →</div>
                  </div>
                </div>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#f97316", opacity: isHovered ? 1 : 0, transition: "opacity 0.2s ease" }} />
              </Link>
            )
          })}
        </div>

        <div style={{ marginTop: "48px", height: "2px", backgroundColor: "#f0f0f0", borderRadius: "2px" }} />
      </div>
    </section>
  )
}