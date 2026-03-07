"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserAuth } from "@/context/UserAuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

type Order = {
  id: string
  customerName: string
  items: { name: string; qty: number; price: number }[]
  total: number
  status: string
  createdAt: any
  userId?: string
}

const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
}

const statusLabel: Record<string, string> = {
  pending: "⏳ Pending",
  confirmed: "✅ Confirmed",
  preparing: "👨‍🍳 Preparing",
  delivered: "🎉 Delivered",
  cancelled: "❌ Cancelled",
}

export default function OrdersPage() {
  const { user, loading } = useUserAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) router.push("/account/login")
  }, [user, loading])

  useEffect(() => {
    if (!user) return
    // Fetch orders belonging to this user
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
      setOrdersLoading(false)
    })
    return unsub
  }, [user])

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId)
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "cancelled" })
    } catch (e) {
      console.error(e)
    } finally {
      setCancelling(null)
    }
  }

  if (loading || !user) return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  )

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 2rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px" }}>
          <Link href="/account" style={{ color: "#555", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>← Account</Link>
          <span style={{ color: "#333" }}>/</span>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>My Orders</span>
        </div>

        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 32px" }}>My Orders</h1>

        {ordersLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛍️</div>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>No orders yet</h2>
            <p style={{ color: "#555", fontSize: "14px", marginBottom: "24px" }}>Your order history will appear here.</p>
            <Link href="/menu" style={{ backgroundColor: "#f97316", color: "#fff", padding: "12px 28px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
              Browse Menu →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map(order => (
              <div key={order.id} style={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "24px", transition: "border-color 0.2s" }}>

                {/* Order header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
                      Order #{order.id.slice(-6).toUpperCase()}
                    </div>
                    <div style={{ color: "#555", fontSize: "12px" }}>
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Just now"}
                    </div>
                  </div>
                  <div style={{ backgroundColor: `${statusColor[order.status] ?? "#555"}18`, color: statusColor[order.status] ?? "#555", border: `1px solid ${statusColor[order.status] ?? "#555"}40`, borderRadius: "999px", padding: "4px 14px", fontSize: "12px", fontWeight: 700 }}>
                    {statusLabel[order.status] ?? order.status}
                  </div>
                </div>

                {/* Items */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px", marginBottom: "16px" }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ color: "#888", fontSize: "13px" }}>{item.qty}× {item.name}</span>
                      <span style={{ color: "#666", fontSize: "13px" }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>
                    Total: <span style={{ color: "#f97316" }}>${order.total.toFixed(2)}</span>
                  </div>

                  {/* Cancel button — only for pending/confirmed */}
                  {(order.status === "pending" || order.status === "confirmed") && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancelling === order.id}
                      style={{ backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "999px", padding: "8px 20px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", opacity: cancelling === order.id ? 0.6 : 1 }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)" }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent" }}
                    >
                      {cancelling === order.id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}