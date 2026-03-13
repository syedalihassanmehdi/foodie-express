"use client"
import { useState } from "react"
import { MenuItem } from "@/lib/menuData"
import { useCart } from "@/context/CartContext"

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#f97316">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const LeafIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 22V12M12 12C12 12 7 10 5 6c4 0 7 2 7 6zM12 12c0 0 5-2 7-6-4 0-7 2-7 6z"/>
  </svg>
)

export function MenuCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleAdd = () => {
    addToCart({ id: item.id, name: item.name, desc: item.desc, image: item.image, price: item.price })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff", borderRadius: "18px", overflow: "hidden",
        border: "2px solid #111",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? "6px 6px 0px #f97316" : "4px 4px 0px #111",
        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", height: "190px", overflow: "hidden" }}>
        <img
          src={item.image} alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />

        {/* Orange top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#f97316", opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }} />

        {/* Rating badge */}
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          backgroundColor: "#fff", border: "2px solid #111",
          borderRadius: "8px", padding: "3px 8px",
          display: "flex", alignItems: "center", gap: "4px",
          boxShadow: "2px 2px 0px #111",
        }}>
          <StarIcon />
          <span style={{ color: "#111", fontSize: "11px", fontWeight: 800 }}>{item.rating} ({item.reviews})</span>
        </div>

        {/* Veg badge */}
        {item.veg && (
          <div style={{
            position: "absolute", top: "10px", left: "10px",
            backgroundColor: "#f0fdf4", border: "2px solid #22c55e",
            borderRadius: "8px", padding: "3px 8px",
            display: "flex", alignItems: "center", gap: "4px",
            boxShadow: "2px 2px 0px #22c55e",
          }}>
            <LeafIcon />
            <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: 700 }}>Veg</span>
          </div>
        )}

        {/* Price */}
        <div style={{
          position: "absolute", bottom: "10px", left: "10px",
          backgroundColor: "#f97316", border: "2px solid #111",
          borderRadius: "8px", padding: "4px 10px",
          boxShadow: "2px 2px 0px #111",
        }}>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 800 }}>${item.price.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ padding: "14px 16px 16px" }}>
        <h3 style={{ fontWeight: 800, fontSize: "15px", color: "#111", margin: "0 0 6px", lineHeight: 1.3, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px" }}>{item.name}</h3>
        <p style={{ color: "#999", fontSize: "12px", lineHeight: 1.6, marginBottom: "14px" }}>{item.desc}</p>
        <button
          onClick={handleAdd}
          style={{
            width: "100%", padding: "10px",
            backgroundColor: added ? "#22c55e" : hovered ? "#f97316" : "#fff",
            color: added ? "#fff" : hovered ? "#fff" : "#f97316",
            border: `2px solid ${added ? "#22c55e" : "#f97316"}`,
            borderRadius: "10px", fontWeight: 700, fontSize: "13px",
            cursor: "pointer", fontFamily: "'Syne', sans-serif",
            transition: "all 0.2s",
            boxShadow: added ? "none" : "3px 3px 0px #111",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          }}
        >
          {added ? <><CheckIcon /> Added!</> : <><CartIcon /> Add to Cart</>}
        </button>
      </div>
    </div>
  )
}