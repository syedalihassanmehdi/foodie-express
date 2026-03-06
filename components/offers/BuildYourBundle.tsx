"use client"
import { useState } from "react"
import { useCart } from "@/context/CartContext"

type Item = { id: string; emoji: string; name: string; price: number; image: string }

const categories: { label: string; emoji: string; items: Item[] }[] = [
  {
    label: "Starter", emoji: "🥗",
    items: [
      { id: "s1", emoji: "🥗", name: "Harvest Zen Bowl", price: 12.99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
      { id: "s2", emoji: "🥗", name: "Caesar Supreme", price: 13.50, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80" },
      { id: "s3", emoji: "🥗", name: "Greek Garden Salad", price: 11.99, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80" },
      { id: "s5", emoji: "🥗", name: "Mango Avocado Salad", price: 13.99, image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80" },
    ]
  },
  {
    label: "Main", emoji: "🍔",
    items: [
      { id: "b1", emoji: "🍔", name: "Monster Angus Burger", price: 14.50, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
      { id: "p1", emoji: "🍕", name: "Classic Margherita", price: 14.99, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
      { id: "pa2", emoji: "🍝", name: "Spaghetti Carbonara", price: 15.50, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80" },
      { id: "pa5", emoji: "🍃", name: "Pesto Genovese", price: 14.50, image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&q=80" },
    ]
  },
  {
    label: "Dessert", emoji: "🍰",
    items: [
      { id: "d2", emoji: "🍫", name: "Chocolate Lava Cake", price: 10.50, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
      { id: "d3", emoji: "🍮", name: "Crème Brûlée", price: 8.99, image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80" },
      { id: "d4", emoji: "☕", name: "Tiramisu", price: 9.99, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80" },
      { id: "d5", emoji: "🥭", name: "Mango Panna Cotta", price: 8.50, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" },
    ]
  },
]

const DISCOUNT = 0.15

export function BuildYourBundle() {
  const { addToCart } = useCart()
  const [selected, setSelected] = useState<Record<string, Item | null>>({ Starter: null, Main: null, Dessert: null })
  const [added, setAdded] = useState(false)

  const filled = Object.values(selected).filter(Boolean)
  const isComplete = filled.length === 3
  const total = filled.reduce((sum, i) => sum + (i?.price ?? 0), 0)
  const discounted = total * (1 - DISCOUNT)

  const select = (label: string, item: Item) => {
    setAdded(false)
    setSelected(prev => ({ ...prev, [label]: prev[label]?.name === item.name ? null : item }))
  }

  const handleAddToCart = () => {
    if (!isComplete) return
    filled.forEach(item => {
      if (!item) return
      addToCart({
        id: `bundle-${item.id}`,
        name: `${item.emoji} ${item.name}`,
        desc: "Part of your custom bundle (15% off applied)",
        image: item.image,
        price: parseFloat((item.price * (1 - DISCOUNT)).toFixed(2)),
        isBundle: true,
        originalPrice: item.price,
      })
    })
    setAdded(true)
    setTimeout(() => { setSelected({ Starter: null, Main: null, Dessert: null }); setAdded(false) }, 2000)
  }

  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "80px 2rem", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @media (max-width: 900px) { .bundle-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 500px) { .bundle-grid { grid-template-columns: repeat(1,1fr) !important; } }
      `}</style>

      {/* Top rule */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)" }} />

      {/* Glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "999px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Build & Save 15%</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", margin: "0 0 12px", lineHeight: 1.1 }}>
            Build Your Own <span style={{ color: "transparent", WebkitTextStroke: "1.5px #f97316", fontStyle: "italic" }}>Bundle.</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", margin: 0 }}>Pick a starter, main, and dessert — unlock <span style={{ color: "#f97316", fontWeight: 700 }}>15% off</span> your entire bundle.</p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "14px" }}>
            {categories.map(cat => (
              <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: selected[cat.label] ? "#f97316" : "#333", transition: "color 0.3s" }}>
                <span style={{ fontSize: "18px" }}>{cat.emoji}</span> {cat.label} {selected[cat.label] ? "✓" : ""}
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "100px", height: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", backgroundColor: "#f97316", borderRadius: "100px", width: `${(filled.length / 3) * 100}%`, transition: "width 0.4s ease", boxShadow: "0 0 8px rgba(249,115,22,0.5)" }} />
          </div>
        </div>

        {/* Category Grids */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px", marginBottom: "40px" }}>
          {categories.map(cat => (
            <div key={cat.label}>
              <p style={{ fontWeight: 700, fontSize: "12px", color: "#f97316", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                {cat.emoji} {cat.label}
              </p>
              <div className="bundle-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
                {cat.items.map(item => {
                  const isSelected = selected[cat.label]?.name === item.name
                  return (
                    <div
                      key={item.id}
                      onClick={() => select(cat.label, item)}
                      style={{
                        borderRadius: "16px",
                        border: `1px solid ${isSelected ? "#f97316" : "rgba(255,255,255,0.06)"}`,
                        backgroundColor: isSelected ? "rgba(249,115,22,0.08)" : "#111",
                        cursor: "pointer", transition: "all 0.2s", overflow: "hidden",
                        boxShadow: isSelected ? "0 0 20px rgba(249,115,22,0.15)" : "none",
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)" }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)" }}
                    >
                      <div style={{ height: "110px", overflow: "hidden", position: "relative" }}>
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: isSelected ? "brightness(0.8)" : "brightness(0.55)" }} />
                        {isSelected && (
                          <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#f97316", color: "#fff", borderRadius: "100px", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>✓</div>
                        )}
                      </div>
                      <div style={{ padding: "12px" }}>
                        <p style={{ fontWeight: 600, fontSize: "12px", color: isSelected ? "#fff" : "#888", margin: "0 0 4px", lineHeight: 1.3 }}>{item.name}</p>
                        <p style={{ color: "#f97316", fontSize: "13px", fontWeight: 800, margin: 0 }}>${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bundle Summary */}
        <div style={{
          borderRadius: "20px",
          border: `1px solid ${isComplete ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.06)"}`,
          backgroundColor: isComplete ? "rgba(249,115,22,0.06)" : "#111",
          padding: "28px 32px", transition: "all 0.4s",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
          boxShadow: isComplete ? "0 0 40px rgba(249,115,22,0.1)" : "none",
        }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "15px", color: isComplete ? "#fff" : "#555", margin: "0 0 12px" }}>
              {isComplete ? "🎉 Bundle complete! 15% discount unlocked." : `🧩 Select ${3 - filled.length} more item${3 - filled.length !== 1 ? "s" : ""} to unlock 15% off`}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {Object.entries(selected).map(([label, item]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: item ? "#f97316" : "rgba(255,255,255,0.06)", borderRadius: "100px", padding: "4px 12px" }}>
                  {item && <img src={item.image} alt={item.name} style={{ width: "18px", height: "18px", borderRadius: "100px", objectFit: "cover" }} />}
                  <span style={{ fontSize: "11px", color: item ? "#fff" : "#444", fontWeight: 600 }}>{item ? item.name : label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            {isComplete && <p style={{ color: "#444", fontSize: "14px", textDecoration: "line-through", margin: "0 0 2px" }}>${total.toFixed(2)}</p>}
            <p style={{ fontSize: "32px", fontWeight: 800, color: isComplete ? "#f97316" : "#555", margin: "0 0 14px", letterSpacing: "-1px" }}>
              {isComplete ? `$${discounted.toFixed(2)}` : `$${total.toFixed(2)}`}
            </p>
            <div
              onClick={handleAddToCart}
              style={{
                backgroundColor: added ? "#22c55e" : isComplete ? "#f97316" : "rgba(255,255,255,0.06)",
                color: isComplete ? "#fff" : "#444",
                padding: "12px 28px", borderRadius: "100px", fontSize: "14px", fontWeight: 700,
                cursor: isComplete ? "pointer" : "not-allowed", transition: "all 0.2s",
                boxShadow: isComplete && !added ? "0 0 30px rgba(249,115,22,0.3)" : "none",
              }}
              onMouseEnter={e => { if (isComplete && !added) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#ea6c0a" }}
              onMouseLeave={e => { if (isComplete && !added) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f97316" }}
            >
              {added ? "✓ Added to Cart!" : isComplete ? "Add Bundle to Cart →" : "Complete Bundle to Order"}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.2), transparent)" }} />
    </section>
  )
}