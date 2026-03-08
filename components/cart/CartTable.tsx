"use client"

export type CartItem = {
  id: string
  name: string
  desc: string
  image: string
  price: number
  qty: number
  isBundle?: boolean
  originalPrice?: number
}

export function CartTable({ items, onIncrease, onDecrease, onRemove }: {
  items: CartItem[]
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
}) {
  if (items.length === 0) {
    return (
      <div style={{
        backgroundColor: "#111", borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "60px 20px", textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "14px" }}>🛒</div>
        <h3 style={{ fontWeight: 700, fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Your cart is empty</h3>
        <p style={{ color: "#555", fontSize: "14px" }}>Add some delicious items from our menu!</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .cart-table-desktop { display: block; }
        .cart-table-mobile { display: none; }

        @media (max-width: 640px) {
          .cart-table-desktop { display: none; }
          .cart-table-mobile { display: flex; flex-direction: column; gap: 12px; }
        }
      `}</style>

      {/* ── DESKTOP TABLE ── */}
      <div className="cart-table-desktop" style={{
        backgroundColor: "#111", borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden", fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 48px",
          gap: "16px", padding: "14px 24px",
          backgroundColor: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {["PRODUCT", "QUANTITY", "PRICE", ""].map(h => (
            <span key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "0.8px" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 48px",
              gap: "16px", padding: "18px 24px", alignItems: "center",
              borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {/* Product */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
              <img src={item.image} alt={item.name} style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <p style={{ fontWeight: 700, fontSize: "14px", color: "#fff", margin: 0 }}>{item.name}</p>
                  {item.isBundle && (
                    <span style={{ backgroundColor: "rgba(249,115,22,0.1)", color: "#f97316", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", whiteSpace: "nowrap", border: "1px solid rgba(249,115,22,0.2)" }}>
                      🧩 −15%
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "12px", color: "#444", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</p>
                {item.isBundle && item.originalPrice && (
                  <p style={{ fontSize: "11px", color: "#444", margin: "3px 0 0", textDecoration: "line-through" }}>
                    Was ${item.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => onDecrease(item.id)} style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>−</button>
              <span style={{ fontWeight: 700, fontSize: "14px", minWidth: "20px", textAlign: "center", color: "#fff" }}>{item.qty}</span>
              <button onClick={() => onIncrease(item.id)} style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1px solid rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.1)", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>+</button>
            </div>

            {/* Price */}
            <span style={{ fontWeight: 800, fontSize: "15px", color: "#f97316" }}>${(item.price * item.qty).toFixed(2)}</span>

            {/* Remove */}
            <button onClick={() => onRemove(item.id)}
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", cursor: "pointer", fontSize: "14px", color: "#444", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "#ef4444" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#444" }}
            >🗑</button>
          </div>
        ))}
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="cart-table-mobile">
        {items.map(item => (
          <div key={item.id} style={{
            backgroundColor: "#111",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px", padding: "16px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {/* Top row — image + info + remove */}
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "14px" }}>
              <img src={item.image} alt={item.name} style={{ width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <p style={{ fontWeight: 700, fontSize: "14px", color: "#fff", margin: "0 0 4px", lineHeight: 1.3 }}>{item.name}</p>
                  <button onClick={() => onRemove(item.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#444", fontSize: "16px", flexShrink: 0, padding: 0, transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                    onMouseLeave={e => e.currentTarget.style.color = "#444"}
                  >✕</button>
                </div>
                {item.isBundle && (
                  <span style={{ display: "inline-block", backgroundColor: "rgba(249,115,22,0.1)", color: "#f97316", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", border: "1px solid rgba(249,115,22,0.2)", marginBottom: "4px" }}>
                    🧩 Bundle −15%
                  </span>
                )}
                <p style={{ fontSize: "12px", color: "#444", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            </div>

            {/* Bottom row — qty controls + price */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => onDecrease(item.id)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>−</button>
                <span style={{ fontWeight: 800, fontSize: "15px", minWidth: "24px", textAlign: "center", color: "#fff" }}>{item.qty}</span>
                <button onClick={() => onIncrease(item.id)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.1)", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>+</button>
              </div>
              <div style={{ textAlign: "right" }}>
                {item.isBundle && item.originalPrice && (
                  <p style={{ fontSize: "11px", color: "#444", margin: "0 0 2px", textDecoration: "line-through" }}>
                    Was ${(item.originalPrice * item.qty).toFixed(2)}
                  </p>
                )}
                <span style={{ fontWeight: 800, fontSize: "18px", color: "#f97316" }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}