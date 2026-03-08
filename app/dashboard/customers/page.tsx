"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { subscribeToOrders, Order } from "@/lib/firestore"

interface Customer {
  name: string; phone: string; address: string
  totalOrders: number; totalSpent: number; lastOrder: Date | null
}

export default function CustomersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => subscribeToOrders(setOrders), [])

  const customerMap: Record<string, Customer> = {}
  for (const order of orders) {
    const key = order.customerPhone
    if (!customerMap[key]) customerMap[key] = { name: order.customerName, phone: order.customerPhone, address: order.customerAddress, totalOrders: 0, totalSpent: 0, lastOrder: null }
    customerMap[key].totalOrders++
    customerMap[key].totalSpent += order.total || 0
    const d = order.createdAt?.toDate?.()
    if (d && (!customerMap[key].lastOrder || d > customerMap[key].lastOrder!)) customerMap[key].lastOrder = d
  }

  const customers = Object.values(customerMap)
    .filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search))
    .sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />
      <style>{`
        * { box-sizing: border-box; }
        .dash-main { margin-left: 220px; flex: 1; padding: 32px; max-width: calc(100% - 220px); }
        .cust-tbl { display: block; }
        .cust-mob { display: none; }
        .stats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .dash-main { margin-left: 0 !important; max-width: 100% !important; padding: 72px 16px 32px !important; }
          .cust-tbl { display: none; }
          .cust-mob { display: flex; flex-direction: column; gap: 12px; }
        }
      `}</style>

      <main className="dash-main">
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111", margin: 0 }}>Customers</h1>
          <p style={{ fontSize: "14px", color: "#999", marginTop: "4px" }}>All customers derived from your order history.</p>
        </div>

        <div className="stats-row" style={{ marginBottom: "20px" }}>
          {[
            { label: "Total Customers", value: customers.length, color: "#f97316" },
            { label: "Total Orders", value: orders.length, color: "#3b82f6" },
            { label: "Avg Order Value", value: `$${orders.length ? Math.round(orders.reduce((a, o) => a + (o.total || 0), 0) / orders.length) : 0}`, color: "#10b981" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "16px 20px", border: "1px solid #f0f0f0", minWidth: "120px", flex: 1 }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>

        <input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", width: "100%", maxWidth: "320px", marginBottom: "16px", boxSizing: "border-box" }} />

        {/* Desktop table */}
        <div className="cust-tbl" style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafafa" }}>
                  {["Customer", "Phone", "Address", "Orders", "Total Spent", "Last Order"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.5px" }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.phone} style={{ borderTop: "1px solid #f5f5f5" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0, backgroundColor: `hsl(${(i * 47) % 360},70%,90%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: `hsl(${(i * 47) % 360},70%,35%)` }}>
                          {c.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "13px", color: "#111" }}>{c.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#666" }}>{c.phone}</td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#666", maxWidth: "160px" }}>{c.address?.slice(0, 35)}{c.address?.length > 35 ? "…" : ""}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: "13px", color: "#111" }}>{c.totalOrders}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: "13px", color: "#f97316" }}>${c.totalSpent.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px", fontSize: "11px", color: "#aaa" }}>
                      {c.lastOrder?.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#ccc" }}>No customers yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="cust-mob">
          {customers.map((c, i) => (
            <div key={c.phone} style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #f0f0f0", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0, backgroundColor: `hsl(${(i * 47) % 360},70%,90%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: `hsl(${(i * 47) % 360},70%,35%)` }}>
                  {c.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>{c.name}</div>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>{c.phone}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: "15px", color: "#f97316" }}>${c.totalSpent.toFixed(2)}</div>
              </div>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>📍 {c.address?.slice(0, 45)}…</div>
              <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#666" }}>
                <span>🧾 {c.totalOrders} orders</span>
                <span>📅 {c.lastOrder?.toLocaleDateString([], { day: "numeric", month: "short" }) ?? "—"}</span>
              </div>
            </div>
          ))}
          {customers.length === 0 && <p style={{ textAlign: "center", color: "#ccc", padding: "40px 0" }}>No customers yet</p>}
        </div>
      </main>
    </div>
  )
}