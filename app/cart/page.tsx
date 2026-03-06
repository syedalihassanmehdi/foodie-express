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
    <main style={{ backgroundColor: "#faf9f7", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 2rem 0", fontSize: "13px", color: "#aaa", display: "flex", gap: "6px", alignItems: "center" }}>
        <Link href="/" style={{ color: "#f97316", textDecoration: "none" }}>Home</Link>
        <span>›</span>
        <span style={{ color: "#111", fontWeight: 600 }}>Shopping Cart</span>
      </div>

      {/* Header */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 2rem 32px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#111", letterSpacing: "-1px", marginBottom: "6px" }}>Review Your Order</h1>
        <p style={{ color: "#777", fontSize: "15px" }}>You're just one step away from delicious food.</p>
      </div>

      {/* Main Layout */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 80px", display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "flex-start" }}>

        {/* Left */}
        <div>
          <CartTable
            items={cart}
            onIncrease={increase}
            onDecrease={decrease}
            onRemove={remove}
          />

          {/* Special Instructions - only show if cart has items */}
          {cart.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "14px", color: "#111", marginBottom: "10px" }}>
                Add Special Instructions
              </label>
              <textarea
                placeholder="e.g. Please leave the parcel at the door..."
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows={4}
                style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1.5px solid #e5e5e5", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#111", resize: "vertical", boxSizing: "border-box", backgroundColor: "#fff" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
              />
            </div>
          )}

          {/* Frequently Added */}
          <FrequentlyAdded onAdd={handleAddSuggestion} />
        </div>

        {/* Right - Order Summary */}
        <OrderSummary subtotal={subtotal} />
      </div>

      <Footer />
    </main>
  )
}