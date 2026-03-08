"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CustomerInfo, CustomerData } from "@/components/checkout/CustomerInfo"
import { DeliveryDetails, DeliveryData } from "@/components/checkout/DeliveryDetails"
import { PaymentMethod, PaymentData } from "@/components/checkout/PaymentMethod"
import { CheckoutSummary, SummaryItem } from "@/components/checkout/CheckoutSummary"
import { addOrder, subscribeToOffers, Offer } from "@/lib/firestore"
import { useUserAuth } from "@/context/UserAuthContext"
import { useCart } from "@/context/CartContext"

export default function CheckoutPage() {
  const { user } = useUserAuth()
  const { cart, clearCart } = useCart()
  const [customer, setCustomer] = useState<CustomerData>({ fullName: "", phone: "" })
  const [delivery, setDelivery] = useState<DeliveryData>({ address: "", notes: "" })
  const [payment, setPayment] = useState<PaymentData>({ method: "card", cardNumber: "", expiry: "", cvv: "" })
  const [ordered, setOrdered] = useState(false)
  const [loading, setLoading] = useState(false)

  // Promo code state
  const [offers, setOffers] = useState<Offer[]>([])
  const [promoInput, setPromoInput] = useState("")
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null)
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")

  useEffect(() => {
    const unsub = subscribeToOffers(all => setOffers(all.filter(o => o.active)))
    return unsub
  }, [])

  // Build items from real cart
  const cartItems: SummaryItem[] = cart.map(item => ({
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.price,
    qty: item.qty,
  }))

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  const delivery_fee = subtotal > 0 ? 2.50 : 0
  const tax = subtotal * 0.08

  // Calculate discount
  const getDiscount = () => {
    if (!appliedOffer) return 0
    if (appliedOffer.type === "percent") return subtotal * (appliedOffer.value / 100)
    if (appliedOffer.type === "flat") return Math.min(appliedOffer.value, subtotal)
    if (appliedOffer.type === "free_delivery") return delivery_fee
    return 0
  }

  const discount = getDiscount()
  const total = Math.max(0, subtotal + delivery_fee + tax - discount)

  const handleApplyPromo = () => {
    setPromoError("")
    setPromoSuccess("")
    const code = promoInput.trim().toUpperCase()
    if (!code) return

    const offer = offers.find(o => o.code.toUpperCase() === code)
    if (!offer) {
      setPromoError("Invalid promo code. Please check and try again.")
      setAppliedOffer(null)
      return
    }

    // Check expiry
    if (offer.expiresAt) {
      const expDate = new Date(offer.expiresAt)
      expDate.setHours(23, 59, 59)
      if (expDate < new Date()) {
        setPromoError("This promo code has expired.")
        setAppliedOffer(null)
        return
      }
    }

    setAppliedOffer(offer)
    const label =
      offer.type === "percent" ? `${offer.value}% off applied!` :
      offer.type === "flat" ? `$${offer.value} off applied!` :
      offer.type === "free_delivery" ? "Free delivery applied!" :
      "Offer applied!"
    setPromoSuccess(`🎉 ${label}`)
  }

  const handleRemovePromo = () => {
    setAppliedOffer(null)
    setPromoInput("")
    setPromoError("")
    setPromoSuccess("")
  }

  const handlePlaceOrder = async () => {
    if (!customer.fullName || !customer.phone || !delivery.address) {
      alert("Please fill in your name, phone, and delivery address.")
      return
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }
    setLoading(true)
    try {
      await addOrder({
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerAddress: delivery.address,
        items: cartItems.map(item => ({ name: item.name, qty: item.qty, price: item.price })),
        total: Math.round(total * 100) / 100,
        status: "pending",
        userId: user?.uid ?? "guest",
      })
      clearCart()
      setOrdered(true)
    } catch (error) {
      console.error("Order failed:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (ordered) {
    return (
      <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <div style={{ maxWidth: "500px", margin: "80px auto", textAlign: "center", padding: "0 2rem" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "12px", letterSpacing: "-1px" }}>Order Placed!</h1>
          <p style={{ color: "#555", fontSize: "15px", marginBottom: "32px", lineHeight: 1.7 }}>
            Thanks, {customer.fullName}! Your order is being prepared. Estimated delivery: 25–35 mins.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {user && (
              <Link href="/account/orders" style={{ backgroundColor: "#f97316", color: "#fff", padding: "14px 28px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, textDecoration: "none", boxShadow: "0 0 30px rgba(249,115,22,0.3)" }}>
                Track Order →
              </Link>
            )}
            <Link href="/categories" style={{ backgroundColor: "transparent", color: "#fff", padding: "14px 28px", borderRadius: "999px", fontSize: "14px", fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
              Order Again
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <style>{`
        * { box-sizing: border-box; }
        .checkout-grid { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: flex-start; }
        @media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr; } }
        .promo-input { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.08); color: #fff; padding: 10px 14px; border-radius: 10px; font-size: 14px; outline: none; font-family: 'DM Sans', sans-serif; width: 100%; transition: border-color 0.2s; box-sizing: border-box; }
        .promo-input:focus { border-color: rgba(249,115,22,0.5); }
        .promo-input:disabled { opacity: 0.5; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 1.25rem 0", fontSize: "13px", color: "#555", display: "flex", gap: "6px", alignItems: "center" }}>
        <Link href="/" style={{ color: "#f97316", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/cart" style={{ color: "#f97316", textDecoration: "none" }}>Cart</Link>
        <span>/</span>
        <span style={{ color: "#888", fontWeight: 600 }}>Checkout</span>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 1.25rem 32px" }}>
        <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: "6px" }}>Checkout</h1>
        <p style={{ color: "#555", fontSize: "15px", margin: 0 }}>Finish your order and we'll start preparing your meal.</p>
      </div>

      {/* Guest warning */}
      {!user && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.25rem 20px" }}>
          <div style={{ backgroundColor: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "12px", padding: "14px 20px" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>
              💡 <Link href="/account/login" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Sign in</Link> to track your orders and view order history.
            </span>
          </div>
        </div>
      )}

      <div className="checkout-grid" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.25rem 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <CustomerInfo data={customer} onChange={setCustomer} />
          <DeliveryDetails data={delivery} onChange={setDelivery} />
          <PaymentMethod data={payment} onChange={setPayment} />

          {/* Promo Code Section */}
          <div style={{ backgroundColor: "#111", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", padding: "24px" }}>
            <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
              🏷️ Promo Code
            </h3>

            {appliedOffer ? (
              <div style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <p style={{ color: "#22c55e", fontWeight: 700, fontSize: "14px", margin: "0 0 2px" }}>{promoSuccess}</p>
                  <p style={{ color: "#555", fontSize: "12px", margin: 0, fontFamily: "monospace", letterSpacing: "1px" }}>{appliedOffer.code}</p>
                </div>
                <button onClick={handleRemovePromo} style={{ background: "none", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    className="promo-input"
                    placeholder="Enter promo code..."
                    value={promoInput}
                    onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); setPromoSuccess("") }}
                    onKeyDown={e => e.key === "Enter" && handleApplyPromo()}
                  />
                  <button onClick={handleApplyPromo} style={{ padding: "10px 20px", backgroundColor: "#f97316", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 0 16px rgba(249,115,22,0.2)" }}>
                    Apply
                  </button>
                </div>
                {promoError && <p style={{ color: "#ef4444", fontSize: "12px", margin: "8px 0 0" }}>❌ {promoError}</p>}
                {/* Hint — show available codes */}
                {offers.length > 0 && !promoError && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                    {offers.slice(0, 3).map(o => (
                      <button key={o.id} onClick={() => { setPromoInput(o.code); setPromoError(""); }}
                        style={{ fontSize: "11px", fontWeight: 700, color: "#f97316", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "6px", padding: "3px 10px", cursor: "pointer", fontFamily: "monospace", letterSpacing: "1px" }}>
                        {o.code}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <CheckoutSummary
          items={cartItems}
          onPlaceOrder={handlePlaceOrder}
          loading={loading}
          discount={discount}
          appliedOffer={appliedOffer}
          deliveryFee={delivery_fee}
          tax={tax}
          total={total}
        />
      </div>
      <Footer />
    </main>
  )
}