"use client"
import { useState } from "react"
import { useCart } from "@/context/CartContext"

const items = [
  { id: "bs1", name: "Truffle Pepperoni", price: 18.99, rating: "4.9", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", desc: "Premium sliced pepperoni, black truffle oil, and artisanal mozzarella on hand-tossed dough." },
  { id: "bs2", name: "Monster Angus Burger", price: 14.50, rating: "4.8", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", desc: "Double Angus beef patties, aged cheddar, caramelized onions, and our secret smoked sauce." },
  { id: "bs3", name: "Creamy Forest Pasta", price: 16.20, rating: "4.7", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80", desc: "Wild assorted mushrooms in a rich parmesan cream sauce with fresh tagliatelle and parsley." },
  { id: "bs4", name: "Smoked BBQ Ribs", price: 24.00, rating: "5.0", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", desc: "Fall-off-the-bone tender pork ribs glazed with 12-hour house-made hickory smoke." },
  { id: "bs5", name: "Harvest Zen Bowl", price: 12.99, rating: "4.6", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", desc: "Quinoa, roast sweet potato, kale, pomegranate seeds, and a zesty tahini dressing." },
  { id: "bs6", name: "Berry Velvet Cake", price: 9.50, rating: "4.4", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80", desc: "Mascarpone whipped cream, fresh mountain berries, and a moist vanilla sponge." },
]

export function BestSellers() {
  const { addToCart } = useCart()
  const [added, setAdded] = useState<string[]>([])
  const [hovered, setHovered] = useState<string | null>(null)

  const handleAdd = (item: typeof items[0]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, desc: item.desc })
    setAdded(prev => [...prev, item.id])
    setTimeout(() => setAdded(prev => prev.filter(i => i !== item.id)), 1500)
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
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @media (max-width: 1024px) { .bs-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px)  { .bs-grid { grid-template-columns: 1fr !important; } .bs-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; } }
      `}</style>

      {/* Top rule */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)" }} />

      {/* Radial glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "500px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div className="bs-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "999px", padding: "5px 14px", marginBottom: "14px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Most Ordered</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-1px", lineHeight: 1.1 }}>
              Our Best<br />
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px #f97316", fontStyle: "italic" }}>Sellers.</span>
            </h2>
          </div>
          <p style={{ color: "#555", fontSize: "15px", maxWidth: "280px", lineHeight: 1.7, margin: 0 }}>
            Dishes that keep our customers coming back for more — crafted with passion.
          </p>
        </div>

        {/* Grid */}
        <div className="bs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {items.map((item) => {
            const isAdded = added.includes(item.id)
            const isHovered = hovered === item.id
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: isHovered ? "#161616" : "#111",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: `1px solid ${isHovered ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.25s ease",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 20px 60px rgba(0,0,0,0.4)" : "none",
                  cursor: "pointer",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      transform: isHovered ? "scale(1.06)" : "scale(1)",
                      transition: "transform 0.4s ease",
                      filter: isHovered ? "brightness(0.85)" : "brightness(0.7)",
                    }}
                  />
                  {/* Rating badge */}
                  <div style={{
                    position: "absolute", top: "12px", right: "12px",
                    backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
                    borderRadius: "999px", padding: "4px 10px",
                    display: "flex", alignItems: "center", gap: "4px",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    <span style={{ color: "#f97316", fontSize: "11px" }}>★</span>
                    <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>{item.rating}</span>
                  </div>
                  {/* Price badge */}
                  <div style={{
                    position: "absolute", bottom: "12px", left: "12px",
                    backgroundColor: "#f97316",
                    borderRadius: "999px", padding: "4px 12px",
                  }}>
                    <span style={{ color: "#fff", fontSize: "13px", fontWeight: 800 }}>${item.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "16px" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#fff", margin: "0 0 6px", letterSpacing: "-0.3px" }}>{item.name}</h3>
                  <p style={{ color: "#555", fontSize: "12px", lineHeight: 1.6, margin: "0 0 16px" }}>
                    {item.desc.slice(0, 72)}{item.desc.length > 72 ? "…" : ""}
                  </p>

                  {/* Add to cart */}
                  <button
                    onClick={() => handleAdd(item)}
                    style={{
                      width: "100%", padding: "10px",
                      backgroundColor: isAdded ? "#22c55e" : isHovered ? "#f97316" : "rgba(249,115,22,0.1)",
                      color: isAdded ? "#fff" : isHovered ? "#fff" : "#f97316",
                      border: `1px solid ${isAdded ? "#22c55e" : "rgba(249,115,22,0.3)"}`,
                      borderRadius: "12px", fontWeight: 700, fontSize: "13px",
                      cursor: "pointer", transition: "all 0.2s",
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {isAdded ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom divider */}
        <div style={{ marginTop: "64px", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.2), transparent)" }} />
      </div>
    </section>
  )
}