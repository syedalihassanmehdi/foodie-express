"use client"
import { useState } from "react"

export type SummaryItem = {
  id: string
  name: string
  image: string
  price: number
  qty: number
}

export function CheckoutSummary({ items, onPlaceOrder, loading = false }: { items: SummaryItem[]; onPlaceOrder: () => void; loading?: boolean }) {
  const [promo, setPromo] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery = subtotal > 0 ? 2.50 : 0
  const tax = subtotal * 0.15
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal + delivery + tax - discount

  const handlePromo = () => {
    if (promo.toLowerCase() === "save10") setPromoApplied(true)
    else alert("Invalid promo code. Try: SAVE10")
  }

  return (
    <div style={{ position: "sticky", top: "84px", display: "flex", flexDirection: "column", gap: "16px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Order Summary Card */}
      <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #f0f0f0" }}>
        <h2 style={{ fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "20px" }}>Order Summary</h2>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
          {items.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>No items in cart</p>
          ) : items.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={item.image} alt={item.name} style={{ width: "52px", height: "52px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "13px", color: "#111", margin: "0 0 2px" }}>{item.name}</p>
                <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>Qty: {item.qty}</p>
              </div>
              <span style={{ fontWeight: 700, fontSize: "13px", color: "#111" }}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", marginBottom: "16px" }}>
          {[
            ["Subtotal", `$${subtotal.toFixed(2)}`],
            ["Delivery Fee", delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`],
            ["Tax (15%)", `$${tax.toFixed(2)}`],
            ...(promoApplied ? [["Discount (10%)", `-$${discount.toFixed(2)}`]] : []),
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ color: "#777", fontSize: "13px" }}>{label}</span>
              <span style={{ fontWeight: 600, fontSize: "13px", color: label === "Discount (10%)" ? "#22c55e" : "#111" }}>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f0f0f0" }}>
            <span style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: "18px", color: "#f97316" }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={onPlaceOrder}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            backgroundColor: loading ? "#fdba74" : "#f97316",
            color: "#fff", border: "none", borderRadius: "12px",
            fontWeight: 700, fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.2s", marginBottom: "10px",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#ea6c0a" }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#f97316" }}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
        <p style={{ textAlign: "center", color: "#aaa", fontSize: "12px", margin: 0 }}>🔒 Secure encrypted checkout</p>
      </div>

      {/* Promo Code Card */}
      <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #f0f0f0" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "10px" }}>Promo Code</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Enter code"
            value={promo}
            onChange={e => setPromo(e.target.value)}
            disabled={promoApplied}
            style={{ flex: 1, padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e5e5e5", fontSize: "13px", outline: "none", fontFamily: "'DM Sans', sans-serif", backgroundColor: promoApplied ? "#f9f9f9" : "#fff" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
            onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
          />
          <button
            onClick={handlePromo}
            disabled={promoApplied}
            style={{ padding: "11px 18px", backgroundColor: promoApplied ? "#22c55e" : "#111", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 600, fontSize: "13px", cursor: promoApplied ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            {promoApplied ? "✓ Applied" : "Apply"}
          </button>
        </div>
        {!promoApplied && <p style={{ color: "#aaa", fontSize: "11px", marginTop: "6px", margin: "6px 0 0" }}>Try: SAVE10</p>}
      </div>

    </div>
  )
}