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
    <div style={{ backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #f0f0f0", transition: "transform 0.2s, box-shadow 0.2s", fontFamily: "'DM Sans', sans-serif" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
    >
      <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "999px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ color: "#f97316", fontSize: "11px" }}>★</span>
          <span style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>{item.rating} ({item.reviews})</span>
        </div>
        {item.veg && (
          <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "#22c55e", borderRadius: "999px", padding: "3px 10px" }}>
            <span style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>🌿 Veg</span>
          </div>
        )}
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
          <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#111", margin: 0 }}>{item.name}</h3>
          <span style={{ color: "#f97316", fontWeight: 700, fontSize: "14px", marginLeft: "8px", flexShrink: 0 }}>${item.price.toFixed(2)}</span>
        </div>
        <p style={{ color: "#999", fontSize: "12px", lineHeight: 1.5, marginBottom: "14px" }}>{item.desc}</p>
        <button
          onClick={handleAdd}
          style={{ width: "100%", padding: "9px", backgroundColor: added ? "#22c55e" : "#f97316", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}
        >
          {added ? "✓ Added!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  )
}