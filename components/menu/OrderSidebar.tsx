"use client"
import Link from "next/link"
import { CartItem } from "@/context/CartContext"

export function OrderSidebar({ cart, onIncrease, onDecrease, onRemove }: {
  cart: CartItem[]
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
}) {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const delivery = subtotal > 0 ? 2.50 : 0
  const total = subtotal + delivery

  return (
    <>
      <style>{`
        .order-sidebar { width: 300px; flex-shrink: 0; }
        @media (max-width: 900px) { .order-sidebar { width: 100%; position: static !important; } }
      `}</style>
      <div className="order-sidebar" style={{
        backgroundColor: "#161616", borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "22px", position: "sticky", top: "84px",
        height: "fit-content", fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <div style={{ width: "36px", height: "36px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🛒</div>
          <h2 style={{ fontWeight: 800, fontSize: "18px", color: "#fff", margin: 0 }}>Your Order</h2>
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "20px" }}>
          {cart.length === 0 ? "No items yet" : `${cart.reduce((s, i) => s + i.qty, 0)} item(s) selected`}
        </p>

        {/* Empty state */}
        {cart.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🍽️</div>
            <p style={{ fontSize: "13px" }}>Add items to get started</p>
          </div>
        )}

        {/* Cart Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "12px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)" }}>
              <img src={item.image} alt={item.name} style={{ width: "52px", height: "52px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ fontWeight: 700, fontSize: "13px", color: "#fff", margin: 0, lineHeight: 1.3 }}>{item.name}</p>
                  <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", fontSize: "14px", padding: "0 0 0 6px", flexShrink: 0, transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#f97316")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                  >✕</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button onClick={() => onDecrease(item.id)} style={{ width: "26px", height: "26px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>−</button>
                    <span style={{ fontWeight: 700, fontSize: "13px", minWidth: "16px", textAlign: "center", color: "#fff" }}>{item.qty}</span>
                    <button onClick={() => onIncrease(item.id)} style={{ width: "26px", height: "26px", borderRadius: "8px", border: "1px solid rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.1)", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>+</button>
                  </div>
                  <span style={{ color: "#f97316", fontWeight: 800, fontSize: "14px" }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        {cart.length > 0 && (
          <>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>Subtotal</span>
                <span style={{ fontWeight: 600, fontSize: "13px", color: "#fff" }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>Delivery Fee</span>
                <span style={{ fontWeight: 600, fontSize: "13px", color: "#fff" }}>${delivery.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: "12px" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: "#fff" }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: "15px", color: "#f97316" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" style={{
              display: "block", width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff", textAlign: "center", borderRadius: "14px",
              fontWeight: 800, fontSize: "14px", textDecoration: "none",
              boxShadow: "0 4px 16px rgba(249,115,22,0.35)", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(249,115,22,0.5)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(249,115,22,0.35)" }}
            >
              Checkout Now →
            </Link>
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "10px" }}>🔒 Secure checkout</p>
          </>
        )}
      </div>
    </>
  )
}