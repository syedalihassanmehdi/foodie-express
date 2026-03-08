"use client"
import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { subscribeToBundles, Bundle } from "@/lib/firestore"

export function BuildYourBundle() {
  const { addToCart } = useCart()
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBundleIndex, setActiveBundleIndex] = useState(0)
  const [selected, setSelected] = useState<Record<string, { id: string; name: string; price: number; image: string } | null>>({})
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const unsub = subscribeToBundles(all => {
      const active = all.filter(b => b.active)
      setBundles(active)
      setLoading(false)
    })
    return unsub
  }, [])

  // Reset selections when switching bundle
  useEffect(() => {
    if (bundles.length === 0) return
    const bundle = bundles[activeBundleIndex]
    const init: Record<string, null> = {}
    bundle.categories.forEach(c => { init[c.label] = null })
    setSelected(init)
    setAdded(false)
  }, [activeBundleIndex, bundles])

  if (loading) {
    return (
      <section style={{ backgroundColor: "#0a0a0a", padding: "80px 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: "200px", height: "24px", backgroundColor: "#1a1a1a", borderRadius: "8px", margin: "0 auto 16px", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ width: "400px", maxWidth: "100%", height: "16px", backgroundColor: "#1a1a1a", borderRadius: "8px", margin: "0 auto" }} />
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </section>
    )
  }

  if (bundles.length === 0) return null

  const bundle = bundles[activeBundleIndex]
  const DISCOUNT = bundle.discount / 100

  const filled = bundle.categories.map(c => selected[c.label]).filter(Boolean)
  const isComplete = filled.length === bundle.categories.length
  const total = filled.reduce((sum, i) => sum + (i?.price ?? 0), 0)
  const discounted = total * (1 - DISCOUNT)

  const select = (label: string, item: { id: string; name: string; price: number; image: string }) => {
    setAdded(false)
    setSelected(prev => ({ ...prev, [label]: prev[label]?.id === item.id ? null : item }))
  }

  const handleAddToCart = () => {
    if (!isComplete) return
    bundle.categories.forEach(cat => {
      const item = selected[cat.label]
      if (!item) return
      addToCart({
        id: `bundle-${bundle.id}-${item.id}`,
        name: item.name,
        desc: `Part of "${bundle.name}" bundle (${bundle.discount}% off)`,
        image: item.image,
        price: parseFloat((item.price * (1 - DISCOUNT)).toFixed(2)),
        isBundle: true,
        originalPrice: item.price,
      })
    })
    setAdded(true)
    setTimeout(() => {
      const init: Record<string, null> = {}
      bundle.categories.forEach(c => { init[c.label] = null })
      setSelected(init)
      setAdded(false)
    }, 2000)
  }

  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "80px 2rem", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @media (max-width: 900px) { .bundle-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 500px) { .bundle-grid { grid-template-columns: repeat(1,1fr) !important; } }
      `}</style>

      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)" }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "999px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Build & Save {bundle.discount}%</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", margin: "0 0 12px", lineHeight: 1.1 }}>
            {bundle.name.split(" ").slice(0, -1).join(" ")}{" "}
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #f97316", fontStyle: "italic" }}>
              {bundle.name.split(" ").slice(-1)[0]}.
            </span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", margin: "0 0 24px" }}>
            {bundle.description || `Pick one from each category — unlock `}
            <span style={{ color: "#f97316", fontWeight: 700 }}>{bundle.discount}% off</span> your entire bundle.
          </p>

          {/* Bundle Tabs — if multiple active bundles */}
          {bundles.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
              {bundles.map((b, i) => (
                <button key={b.id} onClick={() => setActiveBundleIndex(i)} style={{
                  padding: "8px 18px", borderRadius: "100px", border: `1px solid ${i === activeBundleIndex ? "#f97316" : "rgba(255,255,255,0.1)"}`,
                  backgroundColor: i === activeBundleIndex ? "rgba(249,115,22,0.1)" : "transparent",
                  color: i === activeBundleIndex ? "#f97316" : "#555",
                  fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}>
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
            {bundle.categories.map(cat => (
              <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: selected[cat.label] ? "#f97316" : "#333", transition: "color 0.3s" }}>
                <span style={{ fontSize: "18px" }}>{cat.emoji}</span>
                {cat.label} {selected[cat.label] ? "✓" : ""}
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "100px", height: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", backgroundColor: "#f97316", borderRadius: "100px", width: `${(filled.length / bundle.categories.length) * 100}%`, transition: "width 0.4s ease", boxShadow: "0 0 8px rgba(249,115,22,0.5)" }} />
          </div>
        </div>

        {/* Category Grids */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px", marginBottom: "40px" }}>
          {bundle.categories.map(cat => (
            <div key={cat.label}>
              <p style={{ fontWeight: 700, fontSize: "12px", color: "#f97316", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                {cat.emoji} {cat.label}
              </p>
              {cat.items.length === 0 ? (
                <p style={{ color: "#333", fontSize: "13px" }}>No items available in this category.</p>
              ) : (
                <div className="bundle-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
                  {cat.items.map(item => {
                    const isSelected = selected[cat.label]?.id === item.id
                    return (
                      <div key={item.id} onClick={() => select(cat.label, item)}
                        style={{ borderRadius: "16px", border: `1px solid ${isSelected ? "#f97316" : "rgba(255,255,255,0.06)"}`, backgroundColor: isSelected ? "rgba(249,115,22,0.08)" : "#111", cursor: "pointer", transition: "all 0.2s", overflow: "hidden", boxShadow: isSelected ? "0 0 20px rgba(249,115,22,0.15)" : "none" }}
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
              )}
            </div>
          ))}
        </div>

        {/* Bundle Summary */}
        <div style={{ borderRadius: "20px", border: `1px solid ${isComplete ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.06)"}`, backgroundColor: isComplete ? "rgba(249,115,22,0.06)" : "#111", padding: "28px 32px", transition: "all 0.4s", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", boxShadow: isComplete ? "0 0 40px rgba(249,115,22,0.1)" : "none" }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "15px", color: isComplete ? "#fff" : "#555", margin: "0 0 12px" }}>
              {isComplete ? `🎉 Bundle complete! ${bundle.discount}% discount unlocked.` : `🧩 Select ${bundle.categories.length - filled.length} more item${bundle.categories.length - filled.length !== 1 ? "s" : ""} to unlock ${bundle.discount}% off`}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {bundle.categories.map(cat => {
                const item = selected[cat.label]
                return (
                  <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: item ? "#f97316" : "rgba(255,255,255,0.06)", borderRadius: "100px", padding: "4px 12px" }}>
                    {item && <img src={item.image} alt={item.name} style={{ width: "18px", height: "18px", borderRadius: "100px", objectFit: "cover" }} />}
                    <span style={{ fontSize: "11px", color: item ? "#fff" : "#444", fontWeight: 600 }}>{item ? item.name : cat.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            {isComplete && <p style={{ color: "#444", fontSize: "14px", textDecoration: "line-through", margin: "0 0 2px" }}>${total.toFixed(2)}</p>}
            <p style={{ fontSize: "32px", fontWeight: 800, color: isComplete ? "#f97316" : "#555", margin: "0 0 14px", letterSpacing: "-1px" }}>
              {isComplete ? `$${discounted.toFixed(2)}` : `$${total.toFixed(2)}`}
            </p>
            <div onClick={handleAddToCart} style={{ backgroundColor: added ? "#22c55e" : isComplete ? "#f97316" : "rgba(255,255,255,0.06)", color: isComplete ? "#fff" : "#444", padding: "12px 28px", borderRadius: "100px", fontSize: "14px", fontWeight: 700, cursor: isComplete ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: isComplete && !added ? "0 0 30px rgba(249,115,22,0.3)" : "none" }}
              onMouseEnter={e => { if (isComplete && !added) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#ea6c0a" }}
              onMouseLeave={e => { if (isComplete && !added) (e.currentTarget as HTMLDivElement).style.backgroundColor = added ? "#22c55e" : "#f97316" }}
            >
              {added ? "✓ Added to Cart!" : isComplete ? "Add Bundle to Cart →" : "Complete Bundle to Order"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.2), transparent)" }} />
    </section>
  )
}