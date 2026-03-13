"use client"

export type SummaryItem = {
  id: string
  name: string
  image: string
  price: number
  qty: number
}

// ── Icons ──────────────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const TagIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const BagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

export function CheckoutSummary({
  items = [],
  onPlaceOrder,
  loading = false,
  discount = 0,
  appliedOffer = null,
  deliveryFee = 2.99,
  tax = 0,
  total,
}: {
  items?: SummaryItem[]
  onPlaceOrder: () => void
  loading?: boolean
  discount?: number
  appliedOffer?: { type: string; value: number; code: string } | null
  deliveryFee?: number
  tax?: number
  total?: number
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const displayTotal = total ?? Math.max(0, subtotal + deliveryFee + tax - discount)
  const isFreeDelivery = appliedOffer?.type === "free_delivery"
  const isEmpty = items.length === 0
  const totalQty = items.reduce((s, i) => s + i.qty, 0)

  const formatDiscount = () => {
    if (!appliedOffer) return ""
    if (appliedOffer.type === "percent") return `${appliedOffer.value}% off`
    if (appliedOffer.type === "flat") return `$${appliedOffer.value} off`
    if (appliedOffer.type === "free_delivery") return "Free delivery"
    return "Discount"
  }

  const rows = [
    { label: "Subtotal", value: `$${subtotal.toFixed(2)}`, accent: false },
    { label: "Delivery Fee", value: isFreeDelivery ? "Free" : `$${deliveryFee.toFixed(2)}`, accent: isFreeDelivery },
    { label: "Tax (8%)", value: `$${tax.toFixed(2)}`, accent: false },
    ...(discount > 0 && !isFreeDelivery
      ? [{ label: `Promo (${formatDiscount()})`, value: `-$${discount.toFixed(2)}`, accent: true }]
      : []),
  ]

  return (
    <div style={{ position: "sticky", top: "84px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .cs-btn { transition: all 0.15s ease !important; }
        .cs-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 6px 6px 0px #c2540a !important; }
      `}</style>

      <div style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "2px solid #111",
        boxShadow: "5px 5px 0px #111",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{
          backgroundColor: "#fafaf8",
          borderBottom: "2px solid #111",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <div style={{
            width: "38px", height: "38px",
            backgroundColor: "#fff3e8",
            border: "2px solid #111",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#f97316", flexShrink: 0,
          }}>
            <BagIcon />
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "16px", color: "#111", margin: 0, letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif" }}>
              Order Summary
            </h2>
            <p style={{ color: "#aaa", fontSize: "12px", margin: 0, fontWeight: 500 }}>
              {isEmpty ? "No items yet" : `${totalQty} item${totalQty !== 1 ? "s" : ""} in your cart`}
            </p>
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>

          {/* Items list */}
          {!isEmpty && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={item.image} alt={item.name}
                    style={{
                      width: "48px", height: "48px", borderRadius: "12px",
                      objectFit: "cover", flexShrink: 0,
                      border: "2px solid #111", boxShadow: "2px 2px 0px #f97316",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: "13px", color: "#111", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Syne', sans-serif" }}>
                      {item.name}
                    </p>
                    <p style={{ color: "#bbb", fontSize: "11px", margin: 0, fontWeight: 500 }}>Qty: {item.qty}</p>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "13px", color: "#f97316", flexShrink: 0, fontFamily: "'Syne', sans-serif" }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: "2px", backgroundColor: "#f0f0f0", marginBottom: "16px", borderRadius: "2px" }} />

          {/* Price rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            {rows.map(({ label, value, accent }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: accent ? "#22c55e" : "#888", fontSize: "13px", fontWeight: accent ? 700 : 500, display: "flex", alignItems: "center", gap: "5px" }}>
                  {accent && <span style={{ color: "#22c55e" }}><CheckIcon /></span>}
                  {label}
                </span>
                <span style={{ fontWeight: 700, fontSize: "13px", color: accent ? "#22c55e" : "#111" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Applied offer badge */}
          {appliedOffer && (
            <div style={{
              display: "flex", alignItems: "center", gap: "7px",
              backgroundColor: "#f0fdf4",
              border: "2px solid #22c55e",
              borderRadius: "10px", padding: "8px 12px", marginBottom: "14px",
              boxShadow: "2px 2px 0px #22c55e",
            }}>
              <span style={{ color: "#22c55e" }}><TagIcon /></span>
              <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 800, fontFamily: "monospace", letterSpacing: "1px" }}>{appliedOffer.code}</span>
              <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>applied!</span>
            </div>
          )}

          {/* Total */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 18px",
            backgroundColor: "#f97316",
            borderRadius: "14px",
            border: "2px solid #111",
            boxShadow: "4px 4px 0px #111",
            marginBottom: "16px",
          }}>
            <span style={{ fontWeight: 800, fontSize: "15px", color: "#fff", fontFamily: "'Syne', sans-serif" }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: "24px", color: "#fff", letterSpacing: "-1px", fontFamily: "'Syne', sans-serif" }}>
              ${displayTotal.toFixed(2)}
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={onPlaceOrder}
            disabled={loading || isEmpty}
            className="cs-btn"
            style={{
              width: "100%",
              padding: "15px 20px",
              backgroundColor: loading ? "#fddcbb" : isEmpty ? "#f5f5f5" : "#111",
              color: isEmpty ? "#bbb" : "#fff",
              border: `2px solid ${isEmpty ? "#e8e8e8" : "#111"}`,
              borderRadius: "14px",
              fontWeight: 800,
              fontSize: "15px",
              cursor: (loading || isEmpty) ? "not-allowed" : "pointer",
              fontFamily: "'Syne', sans-serif",
              boxShadow: (loading || isEmpty) ? "none" : "4px 4px 0px #f97316",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              letterSpacing: "-0.3px",
            }}
          >
            {loading
              ? "Placing Order..."
              : isEmpty
              ? "Cart is Empty"
              : <><span>Place Order</span><ArrowIcon /></>}
          </button>

          {/* Trust line */}
          <p style={{ textAlign: "center", color: "#bbb", fontSize: "12px", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontWeight: 500 }}>
            <LockIcon /> Secure encrypted checkout
          </p>
        </div>
      </div>
    </div>
  )
}

export { CheckoutSummary as OrderSummary }