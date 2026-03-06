"use client"
import Link from "next/link"
import { useState } from "react"

const categories = [
  { name: "Authentic Pizzas", slug: "pizzas", desc: "Traditional wood-fired crusts topped with San Marzano tomatoes and premium buffalo mozzarella.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" },
  { name: "Gourmet Burgers", slug: "burgers", desc: "Hand-pressed premium wagyu beef, house-made brioche buns, and our secret signature truffle sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
  { name: "Artisan Pasta", slug: "pasta", desc: "Hand-rolled dough made daily, paired with authentic regional sauces from across Italy.", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80" },
  { name: "Fresh Salads", slug: "salads", desc: "Seasonal greens sourced from local farms with unique house-made vinaigrettes.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80" },
  { name: "Signature Steaks", slug: "steaks", desc: "Dry-aged prime cuts, flame-grilled to your preference and served with roasted bone marrow.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" },
  { name: "Decadent Desserts", slug: "desserts", desc: "Artisan pastries and sweet creations crafted daily by our award-winning pastry chef.", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80" },
]

export function CategoryGrid() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section style={{
      padding: "0 2rem",
      backgroundColor: "#0a0a0a",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
    }}>

      <style>{`
        @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px)  { .cat-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Top divider */}
      <div style={{ position: "relative", marginBottom: "56px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.4), transparent)" }} />
        {/* Center diamond */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%) rotate(45deg)",
          width: "10px", height: "10px",
          backgroundColor: "#f97316",
          boxShadow: "0 0 12px rgba(249,115,22,0.6)",
        }} />
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {categories.map((cat) => {
            const isHovered = hovered === cat.slug
            return (
              <div
                key={cat.slug}
                onMouseEnter={() => setHovered(cat.slug)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: isHovered ? "#161616" : "#111",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: `1px solid ${isHovered ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.25s ease",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 20px 60px rgba(0,0,0,0.4)" : "none",
                }}
              >
                {/* Image */}
                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      transform: isHovered ? "scale(1.06)" : "scale(1)",
                      transition: "transform 0.4s ease",
                      filter: isHovered ? "brightness(0.65) saturate(1.1)" : "brightness(0.5) saturate(0.85)",
                    }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                  {isHovered && (
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, transparent 60%)" }} />
                  )}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                    backgroundColor: "#f97316",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }} />
                  <div style={{
                    position: "absolute", bottom: "14px", left: "16px",
                    color: "#fff", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px",
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateY(0)" : "translateY(6px)",
                    transition: "all 0.25s ease",
                  }}>{cat.name}</div>
                </div>

                {/* Content */}
                <div style={{ padding: "20px" }}>
                  <h3 style={{
                    fontSize: "16px", fontWeight: 700,
                    color: isHovered ? "#fff" : "#ccc",
                    marginBottom: "8px", letterSpacing: "-0.3px",
                    transition: "color 0.2s",
                  }}>{cat.name}</h3>
                  <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.65, marginBottom: "20px" }}>
                    {cat.desc}
                  </p>
                  <Link
                    href={`/menu/${cat.slug}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      padding: "9px 18px", borderRadius: "999px",
                      fontSize: "13px", fontWeight: 700, textDecoration: "none",
                      transition: "all 0.2s",
                      backgroundColor: isHovered ? "#f97316" : "transparent",
                      color: isHovered ? "#fff" : "#f97316",
                      border: "1px solid rgba(249,115,22,0.4)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    View Items →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

     

    </section>
  )
}