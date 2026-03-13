"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CartTable } from "@/components/cart/CartTable"
import { OrderSummary } from "@/components/cart/OrderSummary"
import { FrequentlyAdded } from "@/components/cart/FrequentlyAdded"
import { useCart } from "@/context/CartContext"

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)
const NoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
)

export default function CartPage() {
  const { cart, increase, decrease, remove, addToCart } = useCart()
  const [instructions, setInstructions] = useState("")
  const router = useRouter()

  const handleAddSuggestion = (item: { id: string; name: string; image: string; price: number; desc: string; qty: number }) => {
    addToCart(item)
  }

  const handlePlaceOrder = () => {
    router.push("/checkout")
  }

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; }

        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: flex-start;
        }
        .cart-summary-mobile  { display: none;  }
        .cart-summary-desktop { display: block; }

        @media (max-width: 900px) {
          .cart-grid                { grid-template-columns: 1fr; }
          .cart-summary-desktop     { display: none;  }
          .cart-summary-mobile      { display: block; margin-top: 8px; }
        }

        .cart-textarea {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 2px solid #e8e8e8;
          font-size: 14px;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          color: #111;
          resize: vertical;
          box-sizing: border-box;
          background-color: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 3px 3px 0px #f0f0f0;
        }
        .cart-textarea:focus {
          border-color: #f97316;
          box-shadow: 3px 3px 0px #f97316;
        }
        .cart-textarea::placeholder { color: #ccc; }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "20px 1.25rem 0",
        fontSize: "12px", color: "#aaa",
        display: "flex", gap: "6px", alignItems: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <Link href="/" style={{ color: "#f97316", textDecoration: "none", fontWeight: 600 }}>Home</Link>
        <span style={{ color: "#ddd" }}><ChevronIcon /></span>
        <span style={{ color: "#888", fontWeight: 600 }}>Shopping Cart</span>
      </div>

      {/* ── Page header ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "14px 1.25rem 24px" }}>
        <h1 style={{
          fontSize: "clamp(24px, 5vw, 38px)",
          fontWeight: 800, color: "#111",
          letterSpacing: "-1.5px", marginBottom: "6px",
          fontFamily: "'Syne', sans-serif", lineHeight: 1.1,
        }}>
          Review Your <span style={{ color: "#f97316", fontStyle: "italic" }}>Order</span>
        </h1>
        <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>
          You're just one step away from delicious food.
        </p>
      </div>

      {/* ── Main layout ── */}
      <div className="cart-grid" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.25rem 80px" }}>

        {/* LEFT COLUMN */}
        <div>
          <CartTable
            items={cart}
            onIncrease={increase}
            onDecrease={decrease}
            onRemove={remove}
          />

          {/* Special Instructions */}
          {cart.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <label style={{
                display: "flex", alignItems: "center", gap: "7px",
                fontWeight: 700, fontSize: "12px", color: "#888",
                textTransform: "uppercase", letterSpacing: "0.8px",
                marginBottom: "10px", fontFamily: "'Syne', sans-serif",
              }}>
                <NoteIcon /> Special Instructions
              </label>
              <textarea
                className="cart-textarea"
                placeholder="e.g. Please leave the parcel at the door..."
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {/* Mobile order summary */}
          <div className="cart-summary-mobile">
            <OrderSummary
              items={cart}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>

          {/* Frequently added */}
          <FrequentlyAdded onAdd={handleAddSuggestion} />
        </div>

        {/* RIGHT COLUMN — desktop only */}
        <div className="cart-summary-desktop">
          <OrderSummary
            items={cart}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>

      <Footer />
    </main>
  )
}