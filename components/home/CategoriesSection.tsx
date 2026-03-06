"use client"
import Link from "next/link"
import { useState, useRef } from "react"

const categories = [
  { name: "Authentic Pizza", slug: "pizzas", items: "121 items", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { name: "Gourmet Pasta", slug: "pasta", items: "86 items", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80" },
  { name: "Fresh Salads", slug: "salads", items: "40 items", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { name: "Sweet Desserts", slug: "desserts", items: "32 items", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80" },
  { name: "Gourmet Burgers", slug: "burgers", items: "54 items", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { name: "Signature Steaks", slug: "steaks", items: "28 items", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
]

const CARD_WIDTH = 220
const GAP = 16
const SCROLL_AMOUNT = CARD_WIDTH + GAP

export function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  const updateButtons = () => {
    const el = scrollRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 0)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT * 2, behavior: "smooth" })
    setTimeout(updateButtons, 350)
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT * 2, behavior: "smooth" })
    setTimeout(updateButtons, 350)
  }

  return (
    <section style={{
      backgroundColor: "#0a0a0a",
      padding: "80px 2rem",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      <style>{`
        div::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
      `}</style>

      {/* Top rule */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)" }} />

      {/* Radial glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "999px", padding: "5px 14px", marginBottom: "14px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Browse All</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-1px", lineHeight: 1.1 }}>
              Explore<br />
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px #f97316", fontStyle: "italic" }}>Categories.</span>
            </h2>
          </div>

          {/* Arrow Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[{ fn: scrollLeft, disabled: atStart, label: "←" }, { fn: scrollRight, disabled: atEnd, label: "→" }].map(({ fn, disabled, label }) => (
              <button
                key={label}
                onClick={fn}
                disabled={disabled}
                style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  border: `1px solid ${disabled ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.12)"}`,
                  backgroundColor: "transparent",
                  color: disabled ? "#333" : "#fff",
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.1)" } }}
                onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.backgroundColor = "transparent" } }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          onScroll={updateButtons}
          style={{
            display: "flex",
            gap: `${GAP}px`,
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingBottom: "4px",
          }}
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
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  height: "180px",
                  minWidth: `${CARD_WIDTH}px`,
                  textDecoration: "none",
                  display: "block",
                  flexShrink: 0,
                  border: `1px solid ${isHovered ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.06)"}`,
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 20px 50px rgba(0,0,0,0.5)" : "none",
                  transition: "all 0.25s ease",
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transform: isHovered ? "scale(1.07)" : "scale(1)",
                    transition: "transform 0.4s ease",
                    filter: isHovered ? "brightness(0.6) saturate(1.1)" : "brightness(0.45) saturate(0.9)",
                  }}
                />

                {/* Gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)" }} />

                {/* Orange glow on hover */}
                {isHovered && (
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, transparent 60%)" }} />
                )}

                {/* Content */}
                <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "-0.3px" }}>{cat.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{cat.items}</div>
                    <div style={{
                      color: "#f97316", fontSize: "11px", fontWeight: 700,
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? "translateX(0)" : "translateX(6px)",
                      transition: "all 0.2s ease",
                    }}>View →</div>
                  </div>
                </div>

                {/* Top orange accent line on hover */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  backgroundColor: "#f97316",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }} />
              </Link>
            )
          })}
        </div>

        {/* Bottom divider */}
        <div style={{ marginTop: "64px", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.2), transparent)" }} />
      </div>
    </section>
  )
}