"use client"
import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CartTable } from "@/components/cart/CartTable"
import { OrderSummary } from "@/components/cart/OrderSummary"
import { FrequentlyAdded } from "@/components/cart/FrequentlyAdded"
import { useCart } from "@/context/CartContext"

export default function CartPage() {
  const { cart, increase, decrease, remove, addToCart } = useCart()
  const [instructions, setInstructions] = useState("")

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const handleAddSuggestion = (item: { id: string; name: string; image: string; price: number; desc: string }) => {
    addToCart(item)
  }

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <style>{`
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; }

        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: flex-start;
        }

        .cart-summary-mobile {
          display: none;
        }

        .cart-summary-desktop {
          display: block;
        }

        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr;
          }
          .cart-summary-desktop {
            display: none;
          }
          .cart-summary-mobile {
            display: block;
            margin-top: 8px;
          }
        }

        .cart-instructions textarea {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 14px;
          outline: none;
          font-family: "'DM Sans', sans-serif";
          color: #fff;
          resize: vertical;
          box-sizing: border-box;
          background-color: #111;
          transition: border-color 0.2s;
        }

        .cart-instructions textarea:focus {
          border-color: rgba(249,115,22,0.5);
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "20px 1.25rem 0",
        fontSize: "13px", color: "#555",
        display: "flex", gap: "6px", alignItems: "center",
      }}>
        <Link href="/" style={{ color: "#f97316", textDecoration: "none" }}>Home</Link>
        <span>›</span>
        <span style={{ color: "#888", fontWeight: 600 }}>Shopping Cart</span>
      </div>

      {/* Header */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px 1.25rem 28px" }}>
        <h1 style={{
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: 800, color: "#fff",
          letterSpacing: "-1px", marginBottom: "6px",
        }}>
          Review Your Order
        </h1>
        <p style={{ color: "#555", fontSize: "15px", margin: 0 }}>
          You're just one step away from delicious food.
        </p>
      </div>

      {/* Main Layout */}
      <div className="cart-grid" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.25rem 80px" }}>

        {/* Left */}
        <div>
          <CartTable
            items={cart}
            onIncrease={increase}
            onDecrease={decrease}
            onRemove={remove}
          />

          {/* Special Instructions */}
          {cart.length > 0 && (
            <div className="cart-instructions" style={{ marginTop: "24px" }}>
              <label style={{
                display: "block", fontWeight: 700,
                fontSize: "13px", color: "#888",
                textTransform: "uppercase", letterSpacing: "0.5px",
                marginBottom: "10px",
              }}>
                Special Instructions
              </label>
              <textarea
                placeholder="e.g. Please leave the parcel at the door..."
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {/* Order Summary on mobile — shown below cart */}
          <div className="cart-summary-mobile">
            <OrderSummary subtotal={subtotal} />
          </div>

          {/* Frequently Added */}
          <FrequentlyAdded onAdd={handleAddSuggestion} />
        </div>

        {/* Right — Order Summary on desktop */}
        <div className="cart-summary-desktop">
          <OrderSummary subtotal={subtotal} />
        </div>
      </div>

      <Footer />
    </main>
  )
}