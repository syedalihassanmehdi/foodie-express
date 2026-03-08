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
    <div style={{
      position: "sticky", top: "84px",
      display: "flex", flexDirection: "column", gap: "16px",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      <style>{`
        .summary-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 13px;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          background-color: #0a0a0a;
          color: #fff;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .summary-input:focus {
          border-color: rgba(249,115,22,0.5);
        }
        .summary-input:disabled {
          opacity: 0.5;
        }
      `}</style>

      <div style={{
        backgroundColor: "#111",
        borderRadius: "20px", padding: "24px",
        border: "1px solid rgba(255,255,255,0.06)",
        boxSizing: "border-box", width: "100%",
      }}>

        <h2 style={{ fontWeight: 800, fontSize: "18px", color: "#fff", marginBottom: "20px", letterSpacing: "-0.3px" }}>
          Order Summary
        </h2>

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
              <span style={{ color: isGreen ? "#22c55e" : "#555", fontSize: "14px", fontWeight: isGreen ? 600 : 400 }}>
                {label as string}
              </span>
              <span style={{ fontWeight: 600, fontSize: "14px", color: isGreen ? "#22c55e" : "#fff" }}>
                {value as string}
              </span>
            </div>
          ))}
        </div>

        {/* Bundle savings callout */}
        {bundleDiscount > 0 && (
          <div style={{
            backgroundColor: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "10px", padding: "10px 14px",
            marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{ fontSize: "16px" }}>🎉</span>
            <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>
              You're saving ${bundleDiscount.toFixed(2)} with your bundle!
            </span>
          </div>
        )}

        {/* Total */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "16px", marginBottom: "20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontWeight: 700, fontSize: "16px", color: "#fff" }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: "22px", color: "#f97316", letterSpacing: "-0.5px" }}>
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Promo Code */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block", fontSize: "11px", fontWeight: 700,
            color: "#555", letterSpacing: "1px",
            textTransform: "uppercase", marginBottom: "8px",
          }}>
            Promo Code
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Enter code"
              value={promo}
              onChange={e => setPromo(e.target.value)}
              disabled={promoApplied}
              className="summary-input"
              onKeyDown={e => e.key === "Enter" && handlePromo()}
            />
            <button
              onClick={handlePromo}
              disabled={promoApplied}
              style={{
                padding: "10px 16px",
                backgroundColor: promoApplied ? "#22c55e" : "#f97316",
                color: "#fff", border: "none", borderRadius: "10px",
                fontWeight: 700, fontSize: "13px",
                cursor: promoApplied ? "default" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.2s", whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (!promoApplied) e.currentTarget.style.backgroundColor = "#ea6c0a" }}
              onMouseLeave={e => { if (!promoApplied) e.currentTarget.style.backgroundColor = promoApplied ? "#22c55e" : "#f97316" }}
            >
              {promoApplied ? "✓ Applied" : "Apply"}
            </button>
          </div>
          {!promoApplied && (
            <p style={{ color: "#444", fontSize: "11px", margin: "6px 0 0" }}>Try: SAVE10</p>
          )}
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", width: "100%", padding: "15px",
            backgroundColor: "#f97316", color: "#fff",
            borderRadius: "999px", fontWeight: 700, fontSize: "15px",
            textDecoration: "none", transition: "all 0.2s",
            boxSizing: "border-box",
            boxShadow: "0 0 30px rgba(249,115,22,0.25)",
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#ea6c0a"; e.currentTarget.style.boxShadow = "0 0 40px rgba(249,115,22,0.4)" }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#f97316"; e.currentTarget.style.boxShadow = "0 0 30px rgba(249,115,22,0.25)" }}
        >
          Proceed to Checkout →
        </Link>

        {/* Trust badges */}
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            ["✅", "Secure checkout guaranteed"],
            ["⏱️", "Estimated delivery: 25–35 mins"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px" }}>{icon}</span>
              <span style={{ color: "#444", fontSize: "12px" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}