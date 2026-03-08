"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { subscribeToOrders, updateOrderStatus, deleteOrder, Order, OrderStatus } from "@/lib/firestore"

const STATUSES: OrderStatus[] = ["pending", "preparing", "out_for_delivery", "delivered", "cancelled"]
const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", preparing: "#3b82f6", out_for_delivery: "#8b5cf6", delivered: "#10b981", cancelled: "#ef4444",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<"all" | OrderStatus>("all")
  const [selected, setSelected] = useState<Order | null>(null)

  useEffect(() => { return subscribeToOrders(setOrders) }, [])

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter)

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />
      <style>{`
        * { box-sizing: border-box; }
        .dash-main { margin-left: 220px; flex: 1; padding: 32px; max-width: calc(100% - 220px); }
        .orders-tbl { display: block; }
        .orders-mob { display: none; }
        @media (max-width: 768px) {
          .dash-main { margin-left: 0 !important; max-width: 100% !important; padding: 72px 16px 32px !important; }
          .orders-tbl { display: none; }
          .orders-mob { display: flex; flex-direction: column; gap: 12px; }
        }
      `}</style>

      <main className="dash-main">
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111", margin: 0 }}>Orders</h1>
          <p style={{ fontSize: "14px", color: "#999", marginTop: "4px" }}>Manage and update customer orders in real-time.</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {(["all", ...STATUSES] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, border: "1px solid", borderColor: filter === s ? "#f97316" : "#e5e5e5", backgroundColor: filter === s ? "#f97316" : "#fff", color: filter === s ? "#fff" : "#666", cursor: "pointer" }}>
              {s === "all" ? "All" : s.replace(/_/g, " ")} ({s === "all" ? orders.length : orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <div className="orders-tbl" style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafafa" }}>
                  {["Customer", "Phone", "Items", "Total", "Status", "Time", ""].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.5px" }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} style={{ borderTop: "1px solid #f5f5f5" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>{order.customerName}</div>
                      <div style={{ fontSize: "11px", color: "#aaa" }}>{order.customerAddress?.slice(0, 25)}…</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#666" }}>{order.customerPhone}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => setSelected(order)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f97316", fontWeight: 600, fontSize: "12px", padding: 0 }}>{order.items?.length} item(s)</button>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#111" }}>${order.total}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, border: `1.5px solid ${STATUS_COLORS[order.status]}`, color: STATUS_COLORS[order.status], backgroundColor: `${STATUS_COLORS[order.status]}15`, cursor: "pointer" }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "11px", color: "#aaa" }}>
                      {order.createdAt?.toDate?.()?.toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" }) ?? "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => deleteOrder(order.id)} style={{ background: "none", border: "1px solid #fee2e2", color: "#ef4444", borderRadius: "8px", padding: "4px 10px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>Del</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#ccc" }}>No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="orders-mob">
          {filtered.map(order => (
            <div key={order.id} style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #f0f0f0", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#111", marginBottom: "2px" }}>{order.customerName}</div>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>{order.customerPhone}</div>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#f97316" }}>${order.total}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>📍 {order.customerAddress?.slice(0, 40)}…</div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  style={{ flex: 1, padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${STATUS_COLORS[order.status]}`, color: STATUS_COLORS[order.status], backgroundColor: `${STATUS_COLORS[order.status]}15`, cursor: "pointer" }}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
                <button onClick={() => setSelected(order)} style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #f0f0f0", background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#f97316" }}>
                  {order.items?.length} items
                </button>
                <button onClick={() => deleteOrder(order.id)} style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #fee2e2", background: "#fff5f5", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#ef4444" }}>Del</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ textAlign: "center", color: "#ccc", padding: "40px 0" }}>No orders found</p>}
        </div>

        {/* Order Detail Modal */}
        {selected && (
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "24px", width: "100%", maxWidth: "420px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111", marginBottom: "16px" }}>Order — {selected.customerName}</h3>
              <div style={{ marginBottom: "16px" }}>
                {selected.items?.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f5f5", fontSize: "14px" }}>
                    <span>{item.name} × {item.qty}</span>
                    <span style={{ fontWeight: 700 }}>${item.price * item.qty}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontWeight: 800, fontSize: "15px" }}>
                  <span>Total</span>
                  <span style={{ color: "#f97316" }}>${selected.total}</span>
                </div>
              </div>
              <div style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>📍 {selected.customerAddress}<br />📞 {selected.customerPhone}</div>
              <button onClick={() => setSelected(null)} style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "#f97316", color: "#fff", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}