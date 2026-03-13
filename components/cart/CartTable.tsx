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

// ── Icons ────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const CartEmptyIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const BundleIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

export function CartTable({ items, onIncrease, onDecrease, onRemove }: {
  items: CartItem[]
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
}) {
  if (items.length === 0) {
    return (
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "2px solid #111",
        boxShadow: "4px 4px 0px #111",
        padding: "60px 20px",
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <CartEmptyIcon />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: "18px", color: "#111", marginBottom: "8px", fontFamily: "'Syne', sans-serif" }}>
          Your cart is empty
        </h3>
        <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>Add some delicious items from our menu!</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .cart-table-desktop { display: block; }
        .cart-table-mobile  { display: none;  }
        @media (max-width: 640px) {
          .cart-table-desktop { display: none !important; }
          .cart-table-mobile  { display: flex !important; flex-direction: column; gap: 12px; }
        }
        .ct-row { transition: background 0.15s; }
        .ct-row:hover { background-color: #fafaf8 !important; }
        .ct-remove { transition: all 0.2s; }
        .ct-remove:hover { border-color: #ef4444 !important; color: #ef4444 !important; background-color: #fff5f5 !important; }
        .ct-qty-dec { transition: all 0.15s; }
        .ct-qty-dec:hover { background-color: #f0f0f0 !important; }
        .ct-qty-inc { transition: all 0.15s; }
        .ct-qty-inc:hover { background-color: #f97316 !important; color: #fff !important; }
      `}</style>

      {/* ── DESKTOP TABLE ── */}
      <div className="cart-table-desktop" style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "2px solid #111",
        boxShadow: "4px 4px 0px #111",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 44px",
          gap: "16px", padding: "14px 24px",
          backgroundColor: "#f97316",
          borderBottom: "2px solid #111",
        }}>
          {["PRODUCT", "QUANTITY", "PRICE", ""].map(h => (
            <span key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "1px", fontFamily: "'Syne', sans-serif" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {items.map((item, i) => (
          <div
            key={item.id}
            className="ct-row"
            style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 44px",
              gap: "16px", padding: "18px 24px", alignItems: "center",
              borderBottom: i < items.length - 1 ? "2px solid #f5f5f5" : "none",
              backgroundColor: "transparent",
            }}
          >
            {/* Product */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
              <img src={item.image} alt={item.name} style={{ width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", flexShrink: 0, border: "2px solid #111", boxShadow: "3px 3px 0px #f97316" }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <p style={{ fontWeight: 800, fontSize: "14px", color: "#111", margin: 0, fontFamily: "'Syne', sans-serif" }}>{item.name}</p>
                  {item.isBundle && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: "#fff3e8", color: "#f97316", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", border: "1.5px solid #f97316", whiteSpace: "nowrap" }}>
                      <BundleIcon /> Bundle −15%
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "12px", color: "#aaa", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</p>
                {item.isBundle && item.originalPrice && (
                  <p style={{ fontSize: "11px", color: "#bbb", margin: "3px 0 0", textDecoration: "line-through" }}>Was ${item.originalPrice.toFixed(2)}</p>
                )}
              </div>
            </div>

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button className="ct-qty-dec" onClick={() => onDecrease(item.id)} style={{ width: "30px", height: "30px", borderRadius: "8px", border: "2px solid #111", background: "#fff", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontWeight: 700 }}>−</button>
              <span style={{ fontWeight: 800, fontSize: "15px", minWidth: "22px", textAlign: "center", color: "#111", fontFamily: "'Syne', sans-serif" }}>{item.qty}</span>
              <button className="ct-qty-inc" onClick={() => onIncrease(item.id)} style={{ width: "30px", height: "30px", borderRadius: "8px", border: "2px solid #f97316", background: "#fff3e8", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316", fontWeight: 700 }}>+</button>
            </div>

            {/* Price */}
            <span style={{ fontWeight: 800, fontSize: "16px", color: "#f97316", fontFamily: "'Syne', sans-serif" }}>${(item.price * item.qty).toFixed(2)}</span>

            {/* Remove */}
            <button className="ct-remove" onClick={() => onRemove(item.id)} style={{ width: "34px", height: "34px", borderRadius: "8px", border: "2px solid #e8e8e8", background: "#fff", cursor: "pointer", color: "#bbb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="cart-table-mobile">
        {items.map(item => (
          <div key={item.id} style={{
            backgroundColor: "#fff",
            border: "2px solid #111",
            borderRadius: "16px",
            boxShadow: "3px 3px 0px #111",
            padding: "16px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "14px" }}>
              <img src={item.image} alt={item.name} style={{ width: "68px", height: "68px", borderRadius: "12px", objectFit: "cover", flexShrink: 0, border: "2px solid #111", boxShadow: "3px 3px 0px #f97316" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <p style={{ fontWeight: 800, fontSize: "14px", color: "#111", margin: "0 0 4px", lineHeight: 1.3, fontFamily: "'Syne', sans-serif" }}>{item.name}</p>
                  <button className="ct-remove" onClick={() => onRemove(item.id)} style={{ background: "#fff", border: "2px solid #e8e8e8", borderRadius: "8px", cursor: "pointer", color: "#bbb", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <TrashIcon />
                  </button>
                </div>
                {item.isBundle && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: "#fff3e8", color: "#f97316", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", border: "1.5px solid #f97316", marginBottom: "4px" }}>
                    <BundleIcon /> Bundle −15%
                  </span>
                )}
                <p style={{ fontSize: "12px", color: "#aaa", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "2px solid #f5f5f5" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button className="ct-qty-dec" onClick={() => onDecrease(item.id)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "2px solid #111", background: "#fff", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontWeight: 700 }}>−</button>
                <span style={{ fontWeight: 800, fontSize: "16px", minWidth: "24px", textAlign: "center", color: "#111", fontFamily: "'Syne', sans-serif" }}>{item.qty}</span>
                <button className="ct-qty-inc" onClick={() => onIncrease(item.id)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "2px solid #f97316", background: "#fff3e8", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316", fontWeight: 700 }}>+</button>
              </div>
              <div style={{ textAlign: "right" }}>
                {item.isBundle && item.originalPrice && (
                  <p style={{ fontSize: "11px", color: "#bbb", margin: "0 0 2px", textDecoration: "line-through" }}>Was ${(item.originalPrice * item.qty).toFixed(2)}</p>
                )}
                <span style={{ fontWeight: 800, fontSize: "20px", color: "#f97316", fontFamily: "'Syne', sans-serif" }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}