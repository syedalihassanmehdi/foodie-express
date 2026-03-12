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

const getSecondsLeft = (createdAt: any): number => {
  if (!createdAt?.toDate) return 0
  const created = createdAt.toDate().getTime()
  const now = Date.now()
  const elapsed = Math.floor((now - created) / 1000)
  return Math.max(0, 120 - elapsed)
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function CancelTimer({ order, onCancel, cancelling }: {
  order: Order
  onCancel: (id: string) => void
  cancelling: string | null
}) {
  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsLeft(order.createdAt))

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => {
      const left = getSecondsLeft(order.createdAt)
      setSecondsLeft(left)
      if (left <= 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [order.createdAt])

  if (order.status !== "pending" && order.status !== "confirmed") return null

  const isCancelling = cancelling === order.id
  const canCancel = secondsLeft > 0
  const urgentColor = secondsLeft <= 30 ? "#ef4444" : secondsLeft <= 60 ? "#f59e0b" : "#22c55e"

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
      {canCancel ? (
        <>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            backgroundColor: `${urgentColor}12`,
            border: `1px solid ${urgentColor}30`,
            borderRadius: "999px", padding: "5px 12px",
          }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              backgroundColor: urgentColor,
              animation: "pulse 1s infinite",
            }} />
            <span style={{ color: urgentColor, fontSize: "12px", fontWeight: 700 }}>
              {formatTime(secondsLeft)}
            </span>
          </div>

          <button
            onClick={() => onCancel(order.id)}
            disabled={isCancelling}
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444", borderRadius: "999px",
              padding: "8px 20px", fontSize: "12px", fontWeight: 700,
              cursor: isCancelling ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s", opacity: isCancelling ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!isCancelling) e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)" }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent" }}
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        </>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "999px", padding: "5px 12px",
        }}>
          <span style={{ fontSize: "11px" }}>🔒</span>
          <span style={{ color: "#444", fontSize: "12px", fontWeight: 600 }}>
            Cancellation window closed
          </span>
        </div>
      )}
    </div>
  )
}

// ── Guest Order Lookup ─────────────────────────────────────────────────────────

function GuestOrderLookup({ onFound }: { onFound: (orders: Order[]) => void }) {
  const [phone, setPhone] = useState("")
  const [searching, setSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#1a1a1a",
    color: "#fff", fontSize: "14px", outline: "none",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  }

  const handleSearch = async () => {
    const trimmed = phone.trim()
    if (!trimmed) return
    setSearching(true)
    setNotFound(false)

    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", "guest"),
        where("customerPhone", "==", trimmed),
        orderBy("createdAt", "desc")
      )
      // Use a one-time get via onSnapshot
      const unsub = onSnapshot(q, snap => {
        unsub()
        const found = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
        if (found.length === 0) setNotFound(true)
        else onFound(found)
        setSearching(false)
      })
    } catch (e) {
      console.error(e)
      setSearching(false)
      setNotFound(true)
    }
  }

  return (
    <div style={{ maxWidth: "460px", margin: "0 auto", textAlign: "center", padding: "60px 1.25rem 80px" }}>
      <div style={{ fontSize: "48px", marginBottom: "20px" }}>📦</div>
      <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Track Your Order</h2>
      <p style={{ color: "#555", fontSize: "14px", marginBottom: "32px", lineHeight: 1.6 }}>
        Enter the phone number you used when placing your order to see your recent orders.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left", marginBottom: "16px" }}>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Phone Number
        </label>
        <input
          value={phone}
          onChange={e => { setPhone(e.target.value); setNotFound(false) }}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="+92 300 0000000"
          style={inputStyle}
          onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
          onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
        />
      </div>

      {notFound && (
        <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>
          No orders found for that phone number.
        </p>
      )}

      <button
        onClick={handleSearch}
        disabled={searching || !phone.trim()}
        style={{
          width: "100%", padding: "13px", borderRadius: "999px",
          backgroundColor: "#f97316", color: "#fff", border: "none",
          fontWeight: 700, fontSize: "15px", cursor: searching ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif", opacity: !phone.trim() ? 0.5 : 1,
          transition: "all 0.2s",
        }}
      >
        {searching ? "Searching..." : "Find My Orders →"}
      </button>

      <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ color: "#444", fontSize: "13px", marginBottom: "12px" }}>
          Want to track orders easily next time?
        </p>
        <Link href="/account/signup" style={{
          color: "#f97316", fontWeight: 700, fontSize: "13px", textDecoration: "none",
        }}>
          Create a free account →
        </Link>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { user, loading } = useUserAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const [guestOrders, setGuestOrders] = useState<Order[] | null>(null)

  // Load orders for logged-in users
  useEffect(() => {
    if (loading) return
    if (!user) { setOrdersLoading(false); return }

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
  }, [user, loading])

  const handleCancel = async (orderId: string) => {
    const orderList = user ? orders : (guestOrders ?? [])
    const order = orderList.find(o => o.id === orderId)
    if (!order) return
    if (getSecondsLeft(order.createdAt) <= 0) {
      alert("Cancellation window has expired. This order can no longer be cancelled.")
      return
    }
    setCancelling(orderId)
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "cancelled" })
      setCancelled(true)
    } catch (e) {
      console.error(e)
    } finally {
      setCancelling(null)
    }
  }

  // Loading spinner
  if (loading) return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  )

  // Cancellation confirmation screen
  if (cancelled) return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ textAlign: "center", maxWidth: "380px", padding: "24px" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>😔</div>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, marginBottom: "12px" }}>Order Cancelled</h2>
          <p style={{ color: "#555", fontSize: "14px", marginBottom: "32px", lineHeight: 1.6 }}>
            Your order has been cancelled successfully. We hope to serve you again soon!
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setCancelled(false)}
              style={{ padding: "12px 24px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.05)", color: "#888", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              View Orders
            </button>
            <button
              onClick={() => router.push("/menu")}
              style={{ padding: "12px 24px", borderRadius: "999px", backgroundColor: "#f97316", color: "#fff", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Order Again →
            </button>
          </div>
        </div>
      </div>
    </main>
  )

  // Guest — show lookup form if no orders found yet
  if (!user) {
    if (!guestOrders) return (
      <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <GuestOrderLookup onFound={setGuestOrders} />
        <Footer />
      </main>
    )

    // Guest orders found — show them
    return (
      <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <style>{`
          @keyframes spin { to { transform: rotate(360deg) } }
          @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
        `}</style>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 1.25rem 80px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "12px" }}>
            <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.8px", margin: 0 }}>Your Orders</h1>
            <button
              onClick={() => setGuestOrders(null)}
              style={{ color: "#555", fontSize: "13px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              ← Search again
            </button>
          </div>
          <p style={{ color: "#555", fontSize: "13px", marginBottom: "28px" }}>{guestOrders.length} order{guestOrders.length !== 1 ? "s" : ""} found</p>

          <div style={{ backgroundColor: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: "12px", padding: "12px 16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>⏱️</span>
            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
              You can cancel a <strong style={{ color: "#f97316" }}>pending</strong> order within <strong style={{ color: "#f97316" }}>2 minutes</strong> of placing it.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {guestOrders.map(order => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} cancelling={cancelling} />
            ))}
          </div>

          <div style={{ marginTop: "32px", textAlign: "center", padding: "20px", backgroundColor: "#111", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ color: "#555", fontSize: "13px", marginBottom: "12px" }}>Create an account to track all your orders in one place</p>
            <Link href="/account/signup" style={{ backgroundColor: "#f97316", color: "#fff", padding: "10px 24px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
              Create Account →
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Logged-in user view
  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 1.25rem 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
          <Link href="/account" style={{ color: "#555", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}
          >← Account</Link>
          <span style={{ color: "#333" }}>/</span>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>My Orders</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.8px", margin: 0 }}>My Orders</h1>
          <span style={{ color: "#555", fontSize: "13px" }}>{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
        </div>

        <div style={{ backgroundColor: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: "12px", padding: "12px 16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px" }}>⏱️</span>
          <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
            You can cancel a <strong style={{ color: "#f97316" }}>pending</strong> order within <strong style={{ color: "#f97316" }}>2 minutes</strong> of placing it. After that the order is locked in.
          </p>
        </div>

        {ordersLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
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
              <OrderCard key={order.id} order={order} onCancel={handleCancel} cancelling={cancelling} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

// ── Shared Order Card ─────────────────────────────────────────────────────────

function OrderCard({ order, onCancel, cancelling }: {
  order: Order
  onCancel: (id: string) => void
  cancelling: string | null
}) {
  return (
    <div style={{
      backgroundColor: "#111",
      border: `1px solid ${order.status === "cancelled" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "16px", padding: "24px",
      opacity: order.status === "cancelled" ? 0.6 : 1,
      transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
            Order #{order.id.slice(-6).toUpperCase()}
          </div>
          <div style={{ color: "#555", fontSize: "12px" }}>
            {order.createdAt?.toDate
              ? order.createdAt.toDate().toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
              : "Just now"}
          </div>
        </div>
        <div style={{
          backgroundColor: `${statusColor[order.status] ?? "#555"}18`,
          color: statusColor[order.status] ?? "#555",
          border: `1px solid ${statusColor[order.status] ?? "#555"}40`,
          borderRadius: "999px", padding: "4px 14px",
          fontSize: "12px", fontWeight: 700,
        }}>
          {statusLabel[order.status] ?? order.status}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px", marginBottom: "16px" }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>{item.qty}× {item.name}</span>
            <span style={{ color: "#666", fontSize: "13px" }}>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>
          Total: <span style={{ color: "#f97316" }}>${order.total.toFixed(2)}</span>
        </div>
        <CancelTimer order={order} onCancel={onCancel} cancelling={cancelling} />
      </div>
    </div>
  )
}