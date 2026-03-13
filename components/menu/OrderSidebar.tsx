"use client"
import Link from "next/link"
import { CartItem } from "@/context/CartContext"

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const PlateIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)
const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)

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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .order-sidebar { width: 300px; flex-shrink: 0; }
        @media (max-width: 900px) { .order-sidebar { width: 100%; position: static !important; } }
        .qty-btn-dec:hover { border-color: #f97316 !important; color: #f97316 !important; }
        .qty-btn-inc:hover { background: #ea6c0a !important; }
        .remove-btn:hover { color: #f97316 !important; }
        .checkout-btn:hover { transform: translateY(-2px) !important; box-shadow: 5px 5px 0px #111 !important; }
      `}</style>

      <div className="order-sidebar" style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "2px solid #111",
        padding: "22px",
        position: "sticky", top: "84px",
        height: "fit-content",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "6px 6px 0px #111",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <div style={{
            width: "38px", height: "38px",
            backgroundColor: "#fff3e8", border: "2px solid #f97316",
            borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "2px 2px 0px #f97316",
          }}>
            <CartIcon />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "17px", color: "#111", margin: 0, fontFamily: "'Syne', sans-serif" }}>Your Order</h2>
        </div>
        <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "18px", fontWeight: 500 }}>
          {cart.length === 0 ? "No items yet" : `${cart.reduce((s, i) => s + i.qty, 0)} item(s) selected`}
        </p>

        {/* Empty state */}
        {cart.length === 0 && (
          <div style={{ textAlign: "center", padding: "28px 0", borderTop: "2px solid #f0f0f0" }}>
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}><PlateIcon /></div>
            <p style={{ fontSize: "13px", color: "#ccc", fontWeight: 500 }}>Add items to get started</p>
          </div>
        )}

        {/* Cart Items */}
        {cart.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px", borderTop: "2px solid #f0f0f0", paddingTop: "16px" }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: "flex", gap: "10px", alignItems: "flex-start",
                padding: "10px", backgroundColor: "#fafaf8",
                borderRadius: "12px", border: "2px solid #ebebeb",
              }}>
                <img src={item.image} alt={item.name} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", flexShrink: 0, border: "1.5px solid #111" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <p style={{ fontWeight: 700, fontSize: "12px", color: "#111", margin: 0, lineHeight: 1.3, fontFamily: "'Syne', sans-serif" }}>{item.name}</p>
                    <button
                      className="remove-btn"
                      onClick={() => onRemove(item.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: "0 0 0 6px", flexShrink: 0, transition: "color 0.2s", display: "flex" }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        className="qty-btn-dec"
                        onClick={() => onDecrease(item.id)}
                        style={{
                          width: "24px", height: "24px", borderRadius: "6px",
                          border: "2px solid #e0e0e0", background: "#fff",
                          cursor: "pointer", fontSize: "14px", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          color: "#555", transition: "all 0.15s", fontWeight: 700,
                        }}
                      >−</button>
                      <span style={{ fontWeight: 800, fontSize: "13px", minWidth: "16px", textAlign: "center", color: "#111", fontFamily: "'Syne', sans-serif" }}>{item.qty}</span>
                      <button
                        className="qty-btn-inc"
                        onClick={() => onIncrease(item.id)}
                        style={{
                          width: "24px", height: "24px", borderRadius: "6px",
                          border: "2px solid #111", background: "#f97316",
                          cursor: "pointer", fontSize: "14px", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          color: "#fff", transition: "all 0.15s", fontWeight: 700,
                        }}
                      >+</button>
                    </div>
                    <span style={{ color: "#f97316", fontWeight: 800, fontSize: "13px", fontFamily: "'Syne', sans-serif" }}>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {cart.length > 0 && (
          <>
            <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: "14px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#888", fontSize: "13px" }}>Subtotal</span>
                <span style={{ fontWeight: 700, fontSize: "13px", color: "#111" }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
                <span style={{ color: "#888", fontSize: "13px" }}>Delivery Fee</span>
                <span style={{ fontWeight: 700, fontSize: "13px", color: "#111" }}>${delivery.toFixed(2)}</span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                padding: "12px 14px",
                backgroundColor: "#fff3e8",
                border: "2px solid #f97316",
                borderRadius: "12px",
                boxShadow: "3px 3px 0px #f97316",
              }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: "#111", fontFamily: "'Syne', sans-serif" }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: "15px", color: "#f97316", fontFamily: "'Syne', sans-serif" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="checkout-btn" style={{
              display: "block", width: "100%", padding: "13px",
              backgroundColor: "#f97316", color: "#fff",
              textAlign: "center", borderRadius: "12px",
              fontWeight: 800, fontSize: "14px", textDecoration: "none",
              border: "2px solid #111",
              boxShadow: "4px 4px 0px #111",
              transition: "all 0.15s",
              fontFamily: "'Syne', sans-serif",
            }}>
              Checkout Now →
            </Link>

            <p style={{ textAlign: "center", color: "#aaa", fontSize: "11px", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <LockIcon /> Secure checkout
            </p>
          </>
        )}
      </div>
    </>
  )
}