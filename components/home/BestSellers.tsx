"use client"
import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"

const items = [
  { id: "bs1", name: "Truffle Pepperoni", price: 18.99, rating: "4.9", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", desc: "Premium sliced pepperoni, black truffle oil, and artisanal mozzarella on hand-tossed dough." },
  { id: "bs2", name: "Monster Angus Burger", price: 14.50, rating: "4.8", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", desc: "Double Angus beef patties, aged cheddar, caramelized onions, and our secret smoked sauce." },
  { id: "bs3", name: "Creamy Forest Pasta", price: 16.20, rating: "4.7", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80", desc: "Wild assorted mushrooms in a rich parmesan cream sauce with fresh tagliatelle and parsley." },
  { id: "bs4", name: "Smoked BBQ Ribs", price: 24.00, rating: "5.0", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", desc: "Fall-off-the-bone tender pork ribs glazed with 12-hour house-made hickory smoke." },
  { id: "bs5", name: "Harvest Zen Bowl", price: 12.99, rating: "4.6", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", desc: "Quinoa, roast sweet potato, kale, pomegranate seeds, and a zesty tahini dressing." },
  { id: "bs6", name: "Berry Velvet Cake", price: 9.50, rating: "4.4", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80", desc: "Mascarpone whipped cream, fresh mountain berries, and a moist vanilla sponge." },
]

const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#f97316">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

export function BestSellers() {
  const { addToCart } = useCart()
  const [added, setAdded] = useState<string[]>([])
  const [hovered, setHovered] = useState<string | null>(null)
  const [cols, setCols] = useState(3)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setCols(w < 600 ? 1 : w < 1024 ? 2 : 3)
      setIsMobile(w < 600)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const handleAdd = (item: typeof items[0]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, desc: item.desc })
    setAdded(prev => [...prev, item.id])
    setTimeout(() => setAdded(prev => prev.filter(i => i !== item.id)), 1500)
  }

  return (
    <section style={{
      backgroundColor: "#fff",
      padding: isMobile ? "48px 1.25rem" : "80px 2rem",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #111",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
      `}</style>

      {/* Warm blob */}
      <div style={{ position: "absolute", top: "-15%", right: "-5%", width: "400px", height: "400px", background: "radial-gradient(circle, #fff3e8 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: isMobile ? "28px" : "48px", flexWrap: "wrap", gap: "16px", flexDirection: isMobile ? "column" : "row" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#fff3e8", border: "2px solid #f97316", borderRadius: "999px", padding: "5px 14px", marginBottom: "12px", boxShadow: "3px 3px 0px #f97316" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>Most Ordered</span>
            </div>
            <h2 style={{ fontSize: isMobile ? "32px" : "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#111", margin: 0, letterSpacing: "-2px", lineHeight: 1.0, fontFamily: "'Syne', sans-serif" }}>
              Our Best<br />
              <span style={{ color: "#f97316", fontStyle: "italic" }}>Sellers.</span>
            </h2>
          </div>
          {!isMobile && (
            <p style={{ color: "#999", fontSize: "14px", maxWidth: "260px", lineHeight: 1.7, margin: 0 }}>
              Dishes that keep our customers coming back — crafted with passion.
            </p>
          )}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? "14px" : "16px" }}>
          {items.map((item) => {
            const isAdded = added.includes(item.id)
            const isHovered = hovered === item.id
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: "#fff", borderRadius: "18px", overflow: "hidden",
                  border: "2px solid #111",
                  transition: "all 0.25s ease",
                  transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                  boxShadow: isHovered ? "6px 6px 0px #f97316" : "4px 4px 0px #111",
                  cursor: "pointer",
                }}
              >
                <div style={{ position: "relative", height: isMobile ? "160px" : "180px", overflow: "hidden" }}>
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transform: isHovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease" }} />
                  <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "#fff", border: "2px solid #111", borderRadius: "8px", padding: "3px 8px", display: "flex", alignItems: "center", gap: "4px", boxShadow: "2px 2px 0px #111" }}>
                    <StarIcon />
                    <span style={{ color: "#111", fontSize: "11px", fontWeight: 800 }}>{item.rating}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", backgroundColor: "#f97316", border: "2px solid #111", borderRadius: "8px", padding: "4px 10px", boxShadow: "2px 2px 0px #111" }}>
                    <span style={{ color: "#fff", fontSize: "13px", fontWeight: 800 }}>${item.price.toFixed(2)}</span>
                  </div>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#f97316", opacity: isHovered ? 1 : 0, transition: "opacity 0.2s" }} />
                </div>

                <div style={{ padding: isMobile ? "12px" : "16px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "15px", color: "#111", margin: "0 0 6px", letterSpacing: "-0.3px", fontFamily: "'Syne', sans-serif" }}>{item.name}</h3>
                  <p style={{ color: "#999", fontSize: "12px", lineHeight: 1.6, margin: "0 0 12px" }}>
                    {item.desc.slice(0, 72)}{item.desc.length > 72 ? "…" : ""}
                  </p>
                  <button
                    onClick={() => handleAdd(item)}
                    style={{
                      width: "100%", padding: "10px",
                      backgroundColor: isAdded ? "#22c55e" : isHovered ? "#f97316" : "#fff",
                      color: isAdded ? "#fff" : isHovered ? "#fff" : "#f97316",
                      border: `2px solid ${isAdded ? "#22c55e" : "#f97316"}`,
                      borderRadius: "10px", fontWeight: 700, fontSize: "13px",
                      cursor: "pointer", transition: "all 0.2s",
                      fontFamily: "'Syne', sans-serif",
                      boxShadow: isAdded ? "none" : "3px 3px 0px #111",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    }}
                  >
                    {isAdded ? <><CheckIcon /> Added!</> : <><CartIcon /> Add to Cart</>}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: "48px", height: "2px", backgroundColor: "#f0f0f0", borderRadius: "2px" }} />
      </div>
    </section>
  )
}