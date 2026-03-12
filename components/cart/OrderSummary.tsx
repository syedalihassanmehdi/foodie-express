"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { subscribeToOffers, Offer } from "@/lib/firestore"

export function OrderSummary({ subtotal, bundleDiscount = 0 }: { subtotal: number; bundleDiscount?: number }) {
  const [promo, setPromo] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null)
  const [promoError, setPromoError] = useState("")
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => { return subscribeToOffers(setOffers) }, [])

  const delivery = appliedOffer?.type === "free_delivery" ? 0 : subtotal > 0 ? 2.50 : 0
  const tax = subtotal * 0.08
  const total = Math.max(0, subtotal + delivery + tax - promoDiscount - bundleDiscount)

  const handlePromo = () => {
    setPromoError("")
    const code = promo.trim().toUpperCase()
    const offer = offers.find(o => o.code.toUpperCase() === code && o.active)
    if (!offer) { setPromoError("Invalid or inactive promo code."); return }
    if (offer.expiresAt && new Date(offer.expiresAt) < new Date()) { setPromoError("This code has expired."); return }

    setPromoCode(code)
    setAppliedOffer(offer)
    if (offer.type === "percent") setPromoDiscount(Math.round(subtotal * offer.value / 100))
    else if (offer.type === "flat") setPromoDiscount(offer.value)
    else if (offer.type === "free_delivery") setPromoDiscount(0)
    else if (offer.type === "bogo") setPromoDiscount(Math.round(subtotal * 0.5))
  }

  const removePromo = () => {
    setPromo("")
    setPromoCode("")
    setPromoDiscount(0)
    setAppliedOffer(null)
    setPromoError("")
  }

  const activeOffers = offers.filter(o => o.active && (!o.expiresAt || new Date(o.expiresAt) >= new Date()))

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
            ["Delivery Fee", delivery === 0 && subtotal > 0 ? "Free 🎉" : `$${delivery.toFixed(2)}`, false],
            ...(bundleDiscount > 0 ? [["🧩 Bundle Discount", `-$${bundleDiscount.toFixed(2)}`, true]] : []),
            ...(promoDiscount > 0 ? [[`🏷️ Promo (${promoCode})`, `-$${promoDiscount.toFixed(2)}`, true]] : []),
            ...(appliedOffer?.type === "free_delivery" ? [["🚚 Free Delivery", "Applied!", true]] : []),
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

        {/* Savings callouts */}
        {(bundleDiscount > 0 || promoDiscount > 0) && (
          <div style={{
            backgroundColor: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "10px", padding: "10px 14px",
            marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{ fontSize: "16px" }}>🎉</span>
            <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>
              You're saving ${(bundleDiscount + promoDiscount).toFixed(2)} on this order!
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

          {appliedOffer ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#22c55e", fontSize: "14px" }}>✓</span>
                <div>
                  <span style={{ color: "#22c55e", fontSize: "13px", fontWeight: 700 }}>{appliedOffer.code}</span>
                  <span style={{ color: "#555", fontSize: "12px", marginLeft: "6px" }}>{appliedOffer.title}</span>
                </div>
              </div>
              <button onClick={removePromo} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", padding: "2px 6px" }}>
                ✕
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promo}
                  onChange={e => { setPromo(e.target.value.toUpperCase()); setPromoError("") }}
                  className="summary-input"
                  onKeyDown={e => e.key === "Enter" && handlePromo()}
                />
                <button
                  onClick={handlePromo}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#f97316",
                    color: "#fff", border: "none", borderRadius: "10px",
                    fontWeight: 700, fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.2s", whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ea6c0a"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#f97316"}
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0" }}>{promoError}</p>
              )}
              {/* Quick-apply offer chips */}
              {activeOffers.length > 0 && (
                <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {activeOffers.map(o => (
                    <button key={o.id} onClick={() => { setPromo(o.code); setPromoError("") }}
                      style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, border: "1px solid rgba(249,115,22,0.3)", backgroundColor: "rgba(249,115,22,0.06)", color: "#f97316", cursor: "pointer", letterSpacing: "0.5px", fontFamily: "'DM Sans', sans-serif" }}>
                      {o.code}
                    </button>
                  ))}
                </div>
              )}
            </>
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