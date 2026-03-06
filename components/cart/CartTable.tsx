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
      <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "60px 20px", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ fontSize: "48px", marginBottom: "14px" }}>🛒</div>
        <h3 style={{ fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "8px" }}>Your cart is empty</h3>
        <p style={{ color: "#aaa", fontSize: "14px" }}>Add some delicious items from our menu!</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Table Header */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 60px", gap: "16px", padding: "14px 24px", backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
        {["PRODUCT", "QUANTITY", "PRICE", "ACTION"].map(h => (
          <span key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#aaa", letterSpacing: "0.8px" }}>{h}</span>
        ))}
      </div>

      {/* Table Rows */}
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 60px", gap: "16px", padding: "18px 24px", alignItems: "center", borderBottom: i < items.length - 1 ? "1px solid #f0f0f0" : "none", transition: "background 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fafafa")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#fff")}
        >
          {/* Product */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <img src={item.image} alt={item.name} style={{ width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <p style={{ fontWeight: 700, fontSize: "15px", color: "#111", margin: 0 }}>{item.name}</p>
                {item.isBundle && (
                  <span style={{ backgroundColor: "#fff5ee", color: "#f97316", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", letterSpacing: "0.3px", whiteSpace: "nowrap" }}>
                    🧩 Bundle −15%
                  </span>
                )}
              </div>
              <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>{item.desc}</p>
              {item.isBundle && item.originalPrice && (
                <p style={{ fontSize: "11px", color: "#bbb", margin: "3px 0 0", textDecoration: "line-through" }}>
                  Was ${item.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => onDecrease(item.id)}
              style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1.5px solid #e5e5e5", background: "#fff", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}
            >−</button>
            <span style={{ fontWeight: 700, fontSize: "15px", minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
            <button
              onClick={() => onIncrease(item.id)}
              style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1.5px solid #e5e5e5", background: "#fff", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}
            >+</button>
          </div>

          {/* Price */}
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#111" }}>${(item.price * item.qty).toFixed(2)}</span>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #f0f0f0", background: "#fff", cursor: "pointer", fontSize: "14px", color: "#ccc", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff4444"; e.currentTarget.style.color = "#ff4444" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.color = "#ccc" }}
          >🗑</button>
        </div>
      ))}
    </div>
  )
}