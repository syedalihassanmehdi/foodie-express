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
    <div style={{
      width: "300px", flexShrink: 0, backgroundColor: "#fff",
      borderRadius: "16px", border: "1px solid #f0f0f0",
      padding: "20px", position: "sticky", top: "84px",
      height: "fit-content", fontFamily: "'DM Sans', sans-serif",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <span style={{ fontSize: "20px" }}>🛒</span>
        <h2 style={{ fontWeight: 700, fontSize: "18px", color: "#111", margin: 0 }}>Your Order</h2>
      </div>
      <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "20px" }}>
        {cart.length === 0 ? "No items yet" : `${cart.reduce((s, i) => s + i.qty, 0)} item(s) selected`}
      </p>

      {/* Empty state */}
      {cart.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#ccc" }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>🍽️</div>
          <p style={{ fontSize: "13px" }}>Add items to get started</p>
        </div>
      )}

      {/* Cart Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
        {cart.map(item => (
          <div key={item.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <img src={item.image} alt={item.name} style={{ width: "52px", height: "52px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontWeight: 600, fontSize: "13px", color: "#111", margin: 0, lineHeight: 1.3 }}>{item.name}</p>
                <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "14px", padding: "0 0 0 6px", flexShrink: 0 }}>✕</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button onClick={() => onDecrease(item.id)} style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1.5px solid #e5e5e5", background: "#fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span style={{ fontWeight: 600, fontSize: "13px", minWidth: "16px", textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => onIncrease(item.id)} style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1.5px solid #e5e5e5", background: "#fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
                <span style={{ color: "#f97316", fontWeight: 700, fontSize: "13px" }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      {cart.length > 0 && (
        <>
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#777", fontSize: "13px" }}>Subtotal</span>
              <span style={{ fontWeight: 600, fontSize: "13px" }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ color: "#777", fontSize: "13px" }}>Delivery Fee</span>
              <span style={{ fontWeight: 600, fontSize: "13px" }}>${delivery.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: "15px", color: "#111" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: "15px", color: "#111" }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout" style={{
            display: "block", width: "100%", padding: "13px",
            backgroundColor: "#f97316", color: "#fff", textAlign: "center",
            borderRadius: "12px", fontWeight: 700, fontSize: "14px",
            textDecoration: "none", transition: "background 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ea6c0a")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f97316")}
          >
            Checkout Now
          </Link>
          <p style={{ textAlign: "center", color: "#aaa", fontSize: "11px", marginTop: "10px" }}>🔒 Secure checkout by SlicePay</p>
        </>
      )}
    </div>
  )
}