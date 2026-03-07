"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CustomerInfo, CustomerData } from "@/components/checkout/CustomerInfo"
import { DeliveryDetails, DeliveryData } from "@/components/checkout/DeliveryDetails"
import { PaymentMethod, PaymentData } from "@/components/checkout/PaymentMethod"
import { CheckoutSummary, SummaryItem } from "@/components/checkout/CheckoutSummary"
import { addOrder } from "@/lib/firestore"
import { useUserAuth } from "@/context/UserAuthContext"

const mockItems: SummaryItem[] = [
  { id: "1", name: "Signature Truffle Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80", price: 18.50, qty: 1 },
  { id: "2", name: "Parmesan Truffle Fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&q=80", price: 7.00, qty: 2 },
  { id: "3", name: "Craft Cola", image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=200&q=80", price: 4.50, qty: 1 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useUserAuth()
  const [customer, setCustomer] = useState<CustomerData>({ fullName: "", phone: "" })
  const [delivery, setDelivery] = useState<DeliveryData>({ address: "", notes: "" })
  const [payment, setPayment] = useState<PaymentData>({ method: "card", cardNumber: "", expiry: "", cvv: "" })
  const [ordered, setOrdered] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePlaceOrder = async () => {
    if (!customer.fullName || !customer.phone || !delivery.address) {
      alert("Please fill in your name, phone, and delivery address.")
      return
    }
    setLoading(true)
    try {
      const total = mockItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      await addOrder({
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerAddress: delivery.address,
        items: mockItems.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
        total: Math.round(total * 100) / 100,
        status: "pending",
        userId: user?.uid ?? "guest",
      })
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

      {/* Breadcrumb */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 2rem 0", fontSize: "13px", color: "#555", display: "flex", gap: "6px", alignItems: "center" }}>
        <Link href="/" style={{ color: "#f97316", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/cart" style={{ color: "#f97316", textDecoration: "none" }}>Cart</Link>
        <span>/</span>
        <span style={{ color: "#888", fontWeight: 600 }}>Checkout</span>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 2rem 32px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: "6px" }}>Checkout</h1>
        <p style={{ color: "#555", fontSize: "15px" }}>Finish your order and we'll start preparing your meal.</p>
      </div>

      {/* Guest warning */}
      {!user && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 20px" }}>
          <div style={{ backgroundColor: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "12px", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>
              💡 <Link href="/account/login" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Sign in</Link> to track your orders and view order history.
            </span>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 80px", display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <CustomerInfo data={customer} onChange={setCustomer} />
          <DeliveryDetails data={delivery} onChange={setDelivery} />
          <PaymentMethod data={payment} onChange={setPayment} />
        </div>
        <CheckoutSummary items={mockItems} onPlaceOrder={handlePlaceOrder} loading={loading} />
      </div>
      <Footer />
    </main>
  )
}