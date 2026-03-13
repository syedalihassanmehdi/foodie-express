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

// ── Icons ──────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.37 6.37l1.05-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const BoxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

// ── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  pending:   { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", label: "Pending" },
  confirmed: { color: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd", label: "Confirmed" },
  preparing: { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", label: "Preparing" },
  delivered: { color: "#15803d", bg: "#f0fdf4", border: "#86efac", label: "Delivered" },
  cancelled: { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", label: "Cancelled" },
}

const getSecondsLeft = (createdAt: any): number => {
  if (!createdAt?.toDate) return 0
  const elapsed = Math.floor((Date.now() - createdAt.toDate().getTime()) / 1000)
  return Math.max(0, 120 - elapsed)
}

// ── Cancel Timer ─────────────────────────────────────────────────────────────
function CancelTimer({ order, onCancel, cancelling }: { order: Order; onCancel: (id: string) => void; cancelling: string | null }) {
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
  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
      {canCancel ? (
        <>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            backgroundColor: `${urgentColor}12`, border: `2px solid ${urgentColor}40`,
            borderRadius: "999px", padding: "5px 12px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: urgentColor, animation: "pulse 1s infinite" }} />
            <span style={{ color: urgentColor, fontSize: "12px", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
              {m}:{s.toString().padStart(2, "0")}
            </span>
          </div>
          <button
            onClick={() => onCancel(order.id)} disabled={isCancelling}
            style={{
              backgroundColor: "#fff", border: "2px solid #fca5a5",
              color: "#ef4444", borderRadius: "999px",
              padding: "6px 16px", fontSize: "12px", fontWeight: 700,
              cursor: isCancelling ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s", opacity: isCancelling ? 0.6 : 1,
              boxShadow: "2px 2px 0px #fca5a5",
            }}
            onMouseEnter={e => { if (!isCancelling) e.currentTarget.style.backgroundColor = "#fef2f2" }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff" }}
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        </>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          backgroundColor: "#f5f5f5", border: "2px solid #e8e8e8",
          borderRadius: "999px", padding: "5px 12px",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ color: "#aaa", fontSize: "11px", fontWeight: 600 }}>Cancellation closed</span>
        </div>
      )}
    </div>
  )
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ order, onCancel, cancelling }: { order: Order; onCancel: (id: string) => void; cancelling: string | null }) {
  const cfg = statusConfig[order.status] ?? statusConfig.pending
  const isCancelled = order.status === "cancelled"

  return (
    <div style={{
      backgroundColor: "#fff", borderRadius: "16px",
      border: "2px solid #111", boxShadow: "4px 4px 0px #111",
      overflow: "hidden", opacity: isCancelled ? 0.65 : 1,
    }}>
      {/* Header */}
      <div style={{ backgroundColor: "#fafaf8", borderBottom: "2px solid #111", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: "14px", color: "#111", fontFamily: "'Syne', sans-serif" }}>
            #{order.id.slice(-6).toUpperCase()}
          </span>
          <span style={{ color: "#aaa", fontSize: "12px", marginLeft: "10px" }}>
            {order.createdAt?.toDate
              ? order.createdAt.toDate().toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
              : "Just now"}
          </span>
        </div>
        <div style={{
          backgroundColor: cfg.bg, color: cfg.color,
          border: `2px solid ${cfg.border}`, borderRadius: "999px",
          padding: "4px 14px", fontSize: "11px", fontWeight: 800,
          fontFamily: "'Syne', sans-serif", letterSpacing: "0.3px",
        }}>
          {cfg.label}
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: "16px 20px", borderBottom: "2px solid #f0f0f0" }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < order.items.length - 1 ? "6px" : 0 }}>
            <span style={{ color: "#888", fontSize: "13px" }}>{item.qty}× {item.name}</span>
            <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{
          backgroundColor: "#f97316", color: "#fff",
          borderRadius: "10px", padding: "8px 14px",
          border: "2px solid #111", boxShadow: "2px 2px 0px #111",
        }}>
          <span style={{ fontWeight: 800, fontSize: "15px", fontFamily: "'Syne', sans-serif" }}>
            ${order.total.toFixed(2)}
          </span>
        </div>
        <CancelTimer order={order} onCancel={onCancel} cancelling={cancelling} />
      </div>
    </div>
  )
}

// ── Guest Lookup ──────────────────────────────────────────────────────────────
function GuestOrderLookup({ onFound }: { onFound: (orders: Order[]) => void }) {
  const [phone, setPhone] = useState("")
  const [searching, setSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = async () => {
    const trimmed = phone.trim()
    if (!trimmed) return
    setSearching(true); setNotFound(false)
    try {
      const q = query(collection(db, "orders"), where("userId", "==", "guest"), where("customerPhone", "==", trimmed), orderBy("createdAt", "desc"))
      const unsub = onSnapshot(q, snap => {
        unsub()
        const found = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
        if (found.length === 0) setNotFound(true)
        else onFound(found)
        setSearching(false)
      })
    } catch (e) { console.error(e); setSearching(false); setNotFound(true) }
  }

  return (
    <div style={{ maxWidth: "460px", margin: "0 auto", padding: "40px 20px 80px" }}>
      {/* Card */}
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "2px solid #111", boxShadow: "6px 6px 0px #111", overflow: "hidden" }}>
        <div style={{ backgroundColor: "#f97316", padding: "20px 28px", borderBottom: "2px solid #111" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, margin: "0 0 4px", fontFamily: "'Syne', sans-serif" }}>Track Your Order</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", margin: 0 }}>Enter your phone number to find recent orders</p>
        </div>

        <div style={{ padding: "28px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px", fontFamily: "'Syne', sans-serif" }}>
            Phone Number
          </label>
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><PhoneIcon /></span>
            <input
              value={phone}
              onChange={e => { setPhone(e.target.value); setNotFound(false) }}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="+92 300 0000000"
              style={{
                width: "100%", padding: "12px 14px 12px 40px",
                borderRadius: "12px", border: "2px solid #e8e8e8",
                fontSize: "14px", outline: "none",
                fontFamily: "'DM Sans', sans-serif", color: "#111",
                boxSizing: "border-box", backgroundColor: "#fff",
                boxShadow: "3px 3px 0px #f0f0f0", transition: "all 0.2s",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.boxShadow = "3px 3px 0px #f97316" }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.boxShadow = "3px 3px 0px #f0f0f0" }}
            />
          </div>

          {notFound && (
            <div style={{ backgroundColor: "#fef2f2", border: "2px solid #fca5a5", borderRadius: "10px", padding: "10px 14px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "7px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{ color: "#ef4444", fontSize: "13px", fontWeight: 600 }}>No orders found for that number.</span>
            </div>
          )}

          <button
            onClick={handleSearch} disabled={searching || !phone.trim()}
            style={{
              width: "100%", padding: "13px",
              backgroundColor: !phone.trim() ? "#f5f5f5" : "#111",
              color: !phone.trim() ? "#aaa" : "#fff",
              border: "2px solid #111", borderRadius: "12px",
              fontWeight: 800, fontSize: "14px",
              cursor: (searching || !phone.trim()) ? "not-allowed" : "pointer",
              fontFamily: "'Syne', sans-serif",
              boxShadow: phone.trim() ? "4px 4px 0px #f97316" : "none",
              transition: "all 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {searching ? "Searching..." : <><SearchIcon /><span>Find My Orders</span></>}
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center", padding: "20px", backgroundColor: "#fff", borderRadius: "14px", border: "2px solid #e8e8e8", boxShadow: "3px 3px 0px #f0f0f0" }}>
        <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>Want to track orders easily next time?</p>
        <Link href="/account/signup" style={{ color: "#f97316", fontWeight: 800, fontSize: "13px", textDecoration: "none", fontFamily: "'Syne', sans-serif" }}>
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

  useEffect(() => {
    if (loading || !user) { setOrdersLoading(false); return }
    const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
    return onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
      setOrdersLoading(false)
    })
  }, [user, loading])

  const handleCancel = async (orderId: string) => {
    const list = user ? orders : (guestOrders ?? [])
    const order = list.find(o => o.id === orderId)
    if (!order || getSecondsLeft(order.createdAt) <= 0) { alert("Cancellation window has expired."); return }
    setCancelling(orderId)
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "cancelled" })
      setCancelled(true)
    } catch (e) { console.error(e) }
    finally { setCancelling(null) }
  }

  const sharedStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      @keyframes spin { to { transform: rotate(360deg) } }
      @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
    `}</style>
  )

  if (loading) return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {sharedStyles}
      <div style={{ width: "32px", height: "32px", border: "3px solid #f0f0f0", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </main>
  )

  if (cancelled) return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />{sharedStyles}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "24px" }}>
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "2px solid #111", boxShadow: "6px 6px 0px #111", overflow: "hidden", textAlign: "center" }}>
            <div style={{ backgroundColor: "#fef2f2", padding: "32px 24px", borderBottom: "2px solid #111" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "12px" }}>
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <h2 style={{ color: "#ef4444", fontSize: "22px", fontWeight: 800, margin: "0 0 6px", fontFamily: "'Syne', sans-serif" }}>Order Cancelled</h2>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Your order has been cancelled successfully.</p>
            </div>
            <div style={{ padding: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => setCancelled(false)} style={{ flex: 1, padding: "12px 20px", borderRadius: "12px", backgroundColor: "#fafaf8", color: "#888", border: "2px solid #e8e8e8", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "3px 3px 0px #f0f0f0" }}>
                View Orders
              </button>
              <button onClick={() => router.push("/menu")} style={{ flex: 1, padding: "12px 20px", borderRadius: "12px", backgroundColor: "#111", color: "#fff", border: "2px solid #111", fontWeight: 800, fontSize: "14px", cursor: "pointer", fontFamily: "'Syne', sans-serif", boxShadow: "4px 4px 0px #f97316" }}>
                Order Again →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )

  if (!user) {
    if (!guestOrders) return (
      <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />{sharedStyles}
        <GuestOrderLookup onFound={setGuestOrders} />
        <Footer />
      </main>
    )

    return (
      <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />{sharedStyles}
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 20px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <h1 style={{ color: "#111", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.8px", margin: 0, fontFamily: "'Syne', sans-serif" }}>Your Orders</h1>
            <button onClick={() => setGuestOrders(null)} style={{ color: "#aaa", fontSize: "13px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              ← Search again
            </button>
          </div>

          <div style={{ backgroundColor: "#fff3e8", border: "2px solid #f97316", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "3px 3px 0px #f97316" }}>
            <ClockIcon />
            <p style={{ color: "#c2540a", fontSize: "12px", fontWeight: 600, margin: 0 }}>
              You can cancel a <strong>pending</strong> order within <strong>2 minutes</strong> of placing it.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {guestOrders.map(order => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} cancelling={cancelling} />
            ))}
          </div>

          <div style={{ marginTop: "24px", textAlign: "center", padding: "20px 24px", backgroundColor: "#fff", borderRadius: "14px", border: "2px solid #e8e8e8", boxShadow: "3px 3px 0px #f0f0f0" }}>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>Create an account to track all your orders in one place</p>
            <Link href="/account/signup" style={{ backgroundColor: "#111", color: "#fff", padding: "10px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: 800, textDecoration: "none", fontFamily: "'Syne', sans-serif", boxShadow: "3px 3px 0px #f97316" }}>
              Create Account →
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />{sharedStyles}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <Link href="/account" style={{ color: "#aaa", textDecoration: "none", fontSize: "13px", fontWeight: 600, transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
          >← Account</Link>
          <span style={{ color: "#ddd" }}>/</span>
          <span style={{ color: "#111", fontSize: "13px", fontWeight: 700 }}>My Orders</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ color: "#111", fontSize: "28px", fontWeight: 800, letterSpacing: "-1px", margin: 0, fontFamily: "'Syne', sans-serif" }}>My Orders</h1>
          <span style={{
            backgroundColor: "#fff3e8", color: "#f97316",
            border: "2px solid #f97316", borderRadius: "999px",
            padding: "4px 14px", fontSize: "12px", fontWeight: 800,
            fontFamily: "'Syne', sans-serif",
          }}>
            {orders.length} total
          </span>
        </div>

        <div style={{ backgroundColor: "#fff3e8", border: "2px solid #f97316", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "3px 3px 0px #f97316" }}>
          <ClockIcon />
          <p style={{ color: "#c2540a", fontSize: "12px", fontWeight: 600, margin: 0 }}>
            Cancel a <strong>pending</strong> order within <strong>2 minutes</strong> of placing it.
          </p>
        </div>

        {ordersLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid #f0f0f0", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ marginBottom: "20px" }}><BoxIcon /></div>
            <h2 style={{ color: "#111", fontSize: "20px", fontWeight: 800, margin: "0 0 8px", fontFamily: "'Syne', sans-serif" }}>No orders yet</h2>
            <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "24px" }}>Your order history will appear here once you place an order.</p>
            <Link href="/menu" style={{
              backgroundColor: "#111", color: "#fff",
              padding: "12px 28px", borderRadius: "12px",
              fontSize: "14px", fontWeight: 800, textDecoration: "none",
              fontFamily: "'Syne', sans-serif",
              boxShadow: "4px 4px 0px #f97316",
              display: "inline-flex", alignItems: "center", gap: "8px",
            }}>
              Browse Menu <ArrowIcon />
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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