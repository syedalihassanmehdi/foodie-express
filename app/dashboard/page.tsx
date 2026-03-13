"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { subscribeToOrders, subscribeToMenu, subscribeToOffers, Order, MenuItem, Offer } from "@/lib/firestore"

const OrdersIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
const ClockIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
const MoneyIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const ForkIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
const TagIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
const ArrowIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  pending:          { label: "Pending",          bg: "#fffbeb", color: "#d97706", border: "#fcd34d" },
  preparing:        { label: "Preparing",        bg: "#eff6ff", color: "#2563eb", border: "#93c5fd" },
  out_for_delivery: { label: "Out for Delivery", bg: "#f5f3ff", color: "#7c3aed", border: "#c4b5fd" },
  delivered:        { label: "Delivered",        bg: "#f0fdf4", color: "#16a34a", border: "#86efac" },
  cancelled:        { label: "Cancelled",        bg: "#fff1f2", color: "#e11d48", border: "#fda4af" },
}

function StatCard({ Icon, label, value, sub, accent }: {
  Icon: () => React.ReactElement; label: string; value: string | number; sub?: string; accent: string
}) {
  return (
    <div style={{
      backgroundColor: "#fff", borderRadius: "14px", padding: "18px 20px",
      border: "2px solid #ebebeb",
      display: "flex", flexDirection: "column", gap: "10px",
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `3px 3px 0px ${accent}` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.boxShadow = "none" }}
    >
      <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: `${accent}18`, border: `1.5px solid ${accent}40`, display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>
        <Icon />
      </div>
      <div style={{ fontSize: "26px", fontWeight: 800, color: "#111", fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>{value}</div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#555", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>{sub}</div>}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: "#f5f5f5", color: "#555", border: "#e0e0e0" }
  return (
    <span style={{
      padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
      backgroundColor: cfg.bg, color: cfg.color, border: `1.5px solid ${cfg.border}`,
      fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", textTransform: "capitalize",
    }}>
      {cfg.label}
    </span>
  )
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [menu,   setMenu]   = useState<MenuItem[]>([])
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    const u1 = subscribeToOrders(setOrders)
    const u2 = subscribeToMenu(setMenu)
    const u3 = subscribeToOffers(setOffers)
    return () => { u1(); u2(); u3() }
  }, [])

  const todayOrders  = orders.filter(o => { const d = o.createdAt?.toDate?.(); return d?.toDateString() === new Date().toDateString() })
  const revenue      = orders.filter(o => o.status === "delivered").reduce((acc, o) => acc + (o.total || 0), 0)
  const pendingCount = orders.filter(o => o.status === "pending").length

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .dashboard-main { margin-left: 216px; flex: 1; padding: 32px; max-width: calc(100% - 216px); }
        .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 28px; }
        .orders-table-wrap { display: block; overflow-x: auto; }
        .orders-cards-wrap  { display: none; }
        @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .dashboard-main     { margin-left: 0 !important; max-width: 100% !important; padding: 70px 16px 32px !important; }
          .stats-grid         { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .orders-table-wrap  { display: none; }
          .orders-cards-wrap  { display: flex; flex-direction: column; gap: 10px; }
        }
        @media (max-width: 380px) { .stats-grid { grid-template-columns: 1fr; } }
        .dash-tr:hover td { background-color: #fafaf8 !important; }
      `}</style>

      <main className="dashboard-main">

        {/* Header */}
        <div style={{ marginBottom: "28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111", margin: "0 0 4px", fontFamily: "'Inter', sans-serif",  }}>Overview</h1>
            <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>Welcome back — here's what's happening today.</p>
          </div>
          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", backgroundColor: "#fff", border: "2px solid #ebebeb", borderRadius: "10px", padding: "7px 14px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#555", fontFamily: "'Inter', sans-serif" }}>Live</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard Icon={OrdersIcon} label="Total Orders"   value={orders.length}                          sub={`${todayOrders.length} today`}           accent="#f97316" />
          <StatCard Icon={ClockIcon}  label="Pending"        value={pendingCount}                           sub="Needs attention"                         accent="#f59e0b" />
          <StatCard Icon={MoneyIcon}  label="Revenue"        value={`$${revenue.toLocaleString()}`}         sub="Delivered orders"                        accent="#22c55e" />
          <StatCard Icon={ForkIcon}   label="Menu Items"     value={menu.length}                            sub={`${menu.filter(m => m.available).length} available`} accent="#3b82f6" />
          <StatCard Icon={TagIcon}    label="Active Offers"  value={offers.filter(o => o.active).length}   sub={`${offers.length} total`}                accent="#8b5cf6" />
        </div>

        {/* Recent Orders */}
        <div style={{ backgroundColor: "#fff", borderRadius: "14px", border: "2px solid #ebebeb", overflow: "hidden" }}>

          {/* Card header */}
          <div style={{ padding: "14px 20px", borderBottom: "2px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f97316" }} />
              <h2 style={{ fontSize: "14px", fontWeight: 800, color: "#111", margin: 0, fontFamily: "'Inter', sans-serif" }}>Recent Orders</h2>
            </div>
            <a href="/dashboard/orders" style={{ fontSize: "12px", color: "#f97316", textDecoration: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px", fontFamily: "'Inter', sans-serif" }}>
              View all <ArrowIcon />
            </a>
          </div>

          {/* Desktop table */}
          <div className="orders-table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafaf8" }}>
                  {["Customer", "Items", "Total", "Status", "Time"].map(h => (
                    <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "1px", fontFamily: "'Inter', sans-serif" }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 7).map(order => (
                  <tr key={order.id} className="dash-tr" style={{ borderTop: "1px solid #f5f5f5", cursor: "default" }}>
                    <td style={{ padding: "13px 18px", fontSize: "13px", fontWeight: 700, color: "#111", fontFamily: "'Inter', sans-serif" }}>{order.customerName}</td>
                    <td style={{ padding: "13px 18px", fontSize: "13px", color: "#888" }}>{order.items?.length} item(s)</td>
                    <td style={{ padding: "13px 18px", fontSize: "13px", fontWeight: 800, color: "#f97316", fontFamily: "'Inter', sans-serif" }}>${order.total}</td>
                    <td style={{ padding: "13px 18px" }}><StatusBadge status={order.status} /></td>
                    <td style={{ padding: "13px 18px", fontSize: "12px", color: "#bbb" }}>
                      {order.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? "—"}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#ddd", fontSize: "14px" }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="orders-cards-wrap" style={{ padding: "14px" }}>
            {orders.slice(0, 7).map(order => (
              <div key={order.id} style={{ backgroundColor: "#fafaf8", borderRadius: "10px", padding: "12px 14px", border: "1.5px solid #ebebeb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#111", fontFamily: "'Inter', sans-serif" }}>{order.customerName}</div>
                  <StatusBadge status={order.status} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888" }}>
                  <span>{order.items?.length} item(s)</span>
                  <span style={{ fontWeight: 800, color: "#f97316", fontFamily: "'Inter', sans-serif" }}>${order.total}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p style={{ textAlign: "center", color: "#ccc", padding: "32px 0", fontSize: "14px" }}>No orders yet</p>}
          </div>
        </div>

      </main>
    </div>
  )
}