"use client"

export type SummaryItem = {
  id: string
  name: string
  image: string
  price: number
  qty: number
}

export function CheckoutSummary({
  items,
  onPlaceOrder,
  loading = false,
  discount = 0,
  appliedOffer = null,
  deliveryFee = 2.50,
  tax = 0,
  total,
}: {
  items: SummaryItem[]
  onPlaceOrder: () => void
  loading?: boolean
  discount?: number
  appliedOffer?: { type: string; value: number; code: string } | null
  deliveryFee?: number
  tax?: number
  total?: number
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const computedTotal = total ?? (subtotal + deliveryFee + tax - discount)

  const formatDiscount = () => {
    if (!appliedOffer) return ""
    if (appliedOffer.type === "percent") return `${appliedOffer.value}% off`
    if (appliedOffer.type === "flat") return `$${appliedOffer.value} off`
    if (appliedOffer.type === "free_delivery") return "Free delivery"
    return "Discount"
  }

  return (
    <div style={{ position: "sticky", top: "84px", display: "flex", flexDirection: "column", gap: "16px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Order Summary Card */}
      <div style={{ backgroundColor: "#111", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontWeight: 800, fontSize: "18px", color: "#fff", marginBottom: "20px", letterSpacing: "-0.3px" }}>Order Summary</h2>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
          {items.length === 0 ? (
            <p style={{ color: "#444", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>No items in cart</p>
          ) : items.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={item.image} alt={item.name} style={{ width: "52px", height: "52px", borderRadius: "10px", objectFit: "cover", flexShrink: 0, filter: "brightness(0.85)" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: "13px", color: "#fff", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>Qty: {item.qty}</p>
              </div>
              <span style={{ fontWeight: 700, fontSize: "13px", color: "#fff", flexShrink: 0 }}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginBottom: "16px" }}>
          {[
            { label: "Subtotal", value: `$${subtotal.toFixed(2)}`, green: false },
            { label: "Delivery Fee", value: (appliedOffer?.type === "free_delivery" && discount > 0) ? "Free 🎉" : `$${deliveryFee.toFixed(2)}`, green: appliedOffer?.type === "free_delivery" },
            { label: "Tax (8%)", value: `$${tax.toFixed(2)}`, green: false },
            ...(discount > 0 && appliedOffer?.type !== "free_delivery" ? [{
              label: `Promo (${formatDiscount()})`,
              value: `-$${discount.toFixed(2)}`,
              green: true,
            }] : []),
          ].map(({ label, value, green }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ color: green ? "#22c55e" : "#555", fontSize: "13px", fontWeight: green ? 600 : 400 }}>{label}</span>
              <span style={{ fontWeight: 600, fontSize: "13px", color: green ? "#22c55e" : "#fff" }}>{value}</span>
            </div>
          ))}

          {/* Applied code badge */}
          {appliedOffer && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", padding: "6px 12px", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px" }}>🎉</span>
              <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 700, fontFamily: "monospace", letterSpacing: "1px" }}>{appliedOffer.code}</span>
              <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>applied</span>
            </div>
          )}

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontWeight: 700, fontSize: "16px", color: "#fff" }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: "20px", color: "#f97316", letterSpacing: "-0.5px" }}>${computedTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={onPlaceOrder}
          disabled={loading || items.length === 0}
          style={{
            width: "100%", padding: "15px",
            backgroundColor: loading ? "#7c3a0e" : items.length === 0 ? "#1a1a1a" : "#f97316",
            color: items.length === 0 ? "#444" : "#fff",
            border: "none", borderRadius: "999px",
            fontWeight: 700, fontSize: "15px",
            cursor: (loading || items.length === 0) ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s", marginBottom: "10px",
            boxShadow: items.length > 0 && !loading ? "0 0 30px rgba(249,115,22,0.25)" : "none",
          }}
          onMouseEnter={e => { if (!loading && items.length > 0) e.currentTarget.style.backgroundColor = "#ea6c0a" }}
          onMouseLeave={e => { if (!loading && items.length > 0) e.currentTarget.style.backgroundColor = "#f97316" }}
        >
          {loading ? "Placing Order..." : items.length === 0 ? "Cart is Empty" : "Place Order →"}
        </button>

        <p style={{ textAlign: "center", color: "#333", fontSize: "12px", margin: 0 }}>🔒 Secure encrypted checkout</p>
      </div>
    </div>
  )
}