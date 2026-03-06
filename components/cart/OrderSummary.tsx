"use client"
import { useState } from "react"
import Link from "next/link"

export function OrderSummary({ subtotal, bundleDiscount = 0 }: { subtotal: number; bundleDiscount?: number }) {
  const [promo, setPromo] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const delivery = subtotal > 0 ? 2.50 : 0
  const tax = subtotal * 0.08
  const promoDiscount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal + delivery + tax - promoDiscount

  const handlePromo = () => {
    if (promo.toLowerCase() === "save10") setPromoApplied(true)
    else alert("Invalid promo code. Try: SAVE10")
  }

  return (
    <div style={{ position: "sticky", top: "84px", display: "flex", flexDirection: "column", gap: "16px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #f0f0f0" }}>
        <h2 style={{ fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "20px" }}>Order Summary</h2>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
          {[
            ["Subtotal", `$${subtotal.toFixed(2)}`, false],
            ["Tax (8%)", `$${tax.toFixed(2)}`, false],
            ["Delivery Fee", `$${delivery.toFixed(2)}`, false],
            ...(bundleDiscount > 0 ? [["🧩 Bundle Discount", `-$${bundleDiscount.toFixed(2)}`, true]] : []),
            ...(promoApplied ? [["Promo (SAVE10)", `-$${promoDiscount.toFixed(2)}`, true]] : []),
          ].map(([label, value, isGreen]) => (
            <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: isGreen ? "#22c55e" : "#777", fontSize: "14px", fontWeight: isGreen ? 600 : 400 }}>{label as string}</span>
              <span style={{ fontWeight: 600, fontSize: "14px", color: isGreen ? "#22c55e" : "#111" }}>{value as string}</span>
            </div>
          ))}
        </div>

        {/* Bundle savings callout */}
        {bundleDiscount > 0 && (
          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🎉</span>
            <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>You're saving ${bundleDiscount.toFixed(2)} with your bundle deal!</span>
          </div>
        )}

        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <span style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: "20px", color: "#f97316" }}>${total.toFixed(2)}</span>
        </div>

        {/* Promo */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#aaa", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "8px" }}>Promo Code</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Enter code"
              value={promo}
              onChange={e => setPromo(e.target.value)}
              disabled={promoApplied}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e5e5", fontSize: "13px", outline: "none", fontFamily: "'DM Sans', sans-serif", backgroundColor: promoApplied ? "#f9f9f9" : "#fff" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
              onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
            />
            <button
              onClick={handlePromo}
              disabled={promoApplied}
              style={{ padding: "10px 16px", backgroundColor: promoApplied ? "#22c55e" : "#111", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 600, fontSize: "13px", cursor: promoApplied ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              {promoApplied ? "✓" : "Apply"}
            </button>
          </div>
          {!promoApplied && <p style={{ color: "#bbb", fontSize: "11px", margin: "5px 0 0" }}>Try: SAVE10</p>}
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px", backgroundColor: "#f97316", color: "#fff", borderRadius: "12px", fontWeight: 700, fontSize: "15px", textDecoration: "none", transition: "background 0.2s", boxSizing: "border-box" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ea6c0a")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f97316")}
        >
          Proceed to Checkout →
        </Link>

        {/* Trust badges */}
        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>✅</span>
            <span style={{ color: "#777", fontSize: "12px" }}>Secure checkout guaranteed</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>⏱</span>
            <span style={{ color: "#777", fontSize: "12px" }}>Estimated delivery: 25–35 mins</span>
          </div>
        </div>
      </div>
    </div>
  )
}