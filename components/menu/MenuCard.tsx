"use client"
import { useState } from "react"
import { MenuItem } from "@/lib/menuData"
import { useCart } from "@/context/CartContext"

export function MenuCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart({ id: item.id, name: item.name, desc: item.desc, image: item.image, price: item.price })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      style={{ backgroundColor: "#161616", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none" }}
    >
      <div style={{ position: "relative", height: "190px", overflow: "hidden" }}>
        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
        {/* Rating badge */}
        <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", borderRadius: "999px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ color: "#f97316", fontSize: "11px" }}>★</span>
          <span style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>{item.rating} ({item.reviews})</span>
        </div>
        {/* Veg badge */}
        {item.veg && (
          <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "rgba(34,197,94,0.2)", backdropFilter: "blur(8px)", borderRadius: "999px", padding: "4px 10px", border: "1px solid rgba(34,197,94,0.4)" }}>
            <span style={{ color: "#4ade80", fontSize: "11px", fontWeight: 600 }}>🌿 Veg</span>
          </div>
        )}
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <h3 style={{ fontWeight: 800, fontSize: "15px", color: "#fff", margin: 0, lineHeight: 1.3 }}>{item.name}</h3>
          <span style={{ color: "#f97316", fontWeight: 800, fontSize: "15px", marginLeft: "8px", flexShrink: 0 }}>${item.price.toFixed(2)}</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", lineHeight: 1.6, marginBottom: "16px" }}>{item.desc}</p>
        <button
          onClick={handleAdd}
          style={{
            width: "100%", padding: "10px",
            background: added ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff", border: "none", borderRadius: "12px",
            fontWeight: 700, fontSize: "13px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            boxShadow: added ? "0 4px 12px rgba(34,197,94,0.3)" : "0 4px 12px rgba(249,115,22,0.3)",
          }}
        >
          {added ? "✓ Added to Cart!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  )
}