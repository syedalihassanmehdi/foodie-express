"use client"
import { useEffect, useState } from "react"
import { subscribeToOrders, subscribeToMenu, subscribeToOffers, Order, MenuItem, Offer } from "@/lib/firestore"

function StatCard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "16px",
      padding: "24px",
      border: "1px solid #f0f0f0",
      display: "flex", flexDirection: "column", gap: "8px",
    }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        backgroundColor: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
      }}>{icon}</div>
      <div style={{ fontSize: "28px", fontWeight: 800, color: "#111" }}>{value}</div>
      <div style={{ fontSize: "14px", fontWeight: 600, color: "#555" }}>{label}</div>
      {sub && <div style={{ fontSize: "12px", color: "#aaa" }}>{sub}</div>}
    </div>
  )
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  preparing: "#3b82f6",
  out_for_delivery: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    const u1 = subscribeToOrders(setOrders)
    const u2 = subscribeToMenu(setMenu)
    const u3 = subscribeToOffers(setOffers)
    return () => { u1(); u2(); u3() }
  }, [])

  const todayOrders = orders.filter((o) => {
    const d = o.createdAt?.toDate?.()
    if (!d) return false
    const today = new Date()
    return d.toDateString() === today.toDateString()
  })

  const revenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((acc, o) => acc + (o.total || 0), 0)

  const pendingCount = orders.filter((o) => o.status === "pending").length

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111", margin: 0 }}>Overview</h1>
        <p style={{ fontSize: "14px", color: "#999", marginTop: "4px" }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <StatCard icon="🧾" label="Total Orders" value={orders.length} sub={`${todayOrders.length} today`} color="#f97316" />
        <StatCard icon="⏳" label="Pending" value={pendingCount} sub="Needs attention" color="#f59e0b" />
        <StatCard icon="💰" label="Revenue" value={`$${revenue.toLocaleString()}`} sub="From delivered orders" color="#10b981" />
        <StatCard icon="🍽️" label="Menu Items" value={menu.length} sub={`${menu.filter(m => m.available).length} available`} color="#3b82f6" />
        <StatCard icon="🏷️" label="Active Offers" value={offers.filter(o => o.active).length} sub={`${offers.length} total`} color="#8b5cf6" />
      </div>

      {/* Recent Orders */}
      <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: 0 }}>Recent Orders</h2>
          <a href="/dashboard/orders" style={{ fontSize: "13px", color: "#f97316", textDecoration: "none", fontWeight: 600 }}>View all →</a>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fafafa" }}>
                {["Customer", "Items", "Total", "Status", "Time"].map((h) => (
                  <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#999", letterSpacing: "0.5px" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} style={{ borderTop: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: 600, color: "#111" }}>{order.customerName}</td>
                  <td style={{ padding: "14px 24px", fontSize: "13px", color: "#666" }}>{order.items?.length} item(s)</td>
                  <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: 700, color: "#111" }}>${order.total}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                      backgroundColor: `${STATUS_COLORS[order.status]}20`,
                      color: STATUS_COLORS[order.status],
                    }}>{order.status?.replace(/_/g, " ")}</span>
                  </td>
                  <td style={{ padding: "14px 24px", fontSize: "12px", color: "#aaa" }}>
                    {order.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? "—"}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#ccc", fontSize: "14px" }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}