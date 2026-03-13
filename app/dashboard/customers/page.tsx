"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { subscribeToOrders, Order } from "@/lib/firestore"

interface Customer {
  name: string; phone: string; address: string
  totalOrders: number; totalSpent: number; lastOrder: Date | null
}

const SearchIcon = (): React.ReactElement => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>

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

  const avgOrder = orders.length ? Math.round(orders.reduce((a, o) => a + (o.total || 0), 0) / orders.length) : 0

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .dash-main { margin-left: 216px; flex: 1; padding: 32px; max-width: calc(100% - 216px); }
        .cust-tbl { display: block; }
        .cust-mob { display: none; }
        @media (max-width: 768px) {
          .dash-main { margin-left: 0 !important; max-width: 100% !important; padding: 70px 16px 32px !important; }
          .cust-tbl { display: none; }
          .cust-mob { display: flex; flex-direction: column; gap: 10px; }
        }
        .cust-tr:hover td { background: #fafaf8 !important; }
      `}</style>

      <main className="dash-main">
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111", margin: "0 0 3px", letterSpacing: "-0.3px" }}>Customers</h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>Derived from your order history</p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
          {[
            { label: "Total Customers", value: customers.length, color: "#f97316" },
            { label: "Total Orders",    value: orders.length,    color: "#3b82f6" },
            { label: "Avg Order Value", value: `$${avgOrder}`,   color: "#10b981" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "14px 18px", border: "1.5px solid #f3f4f6", flex: 1, minWidth: "110px" }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color, letterSpacing: "-0.5px", fontFamily: "'Inter', sans-serif" }}>{value}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: "300px", marginBottom: "16px" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}><SearchIcon /></span>
          <input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "9px 12px 9px 32px", borderRadius: "9px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }}
            onFocus={e => e.currentTarget.style.borderColor = "#f97316"}
            onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Desktop table */}
        <div className="cust-tbl" style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {["Customer", "Phone", "Address", "Orders", "Total Spent", "Last Order"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.6px", fontFamily: "'Inter', sans-serif" }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.phone} className="cust-tr" style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                        <div style={{ width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0, backgroundColor: `hsl(${(i * 47) % 360},65%,88%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: `hsl(${(i * 47) % 360},65%,32%)`, fontFamily: "'Inter', sans-serif" }}>
                          {c.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "13px", color: "#111", fontFamily: "'Inter', sans-serif" }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: "12px", color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>{c.phone}</td>
                    <td style={{ padding: "11px 16px", fontSize: "12px", color: "#6b7280", maxWidth: "150px", fontFamily: "'Inter', sans-serif" }}>{c.address?.slice(0, 34)}{c.address?.length > 34 ? "…" : ""}</td>
                    <td style={{ padding: "11px 16px", fontWeight: 600, fontSize: "13px", color: "#111", fontFamily: "'Inter', sans-serif" }}>{c.totalOrders}</td>
                    <td style={{ padding: "11px 16px", fontWeight: 700, fontSize: "13px", color: "#f97316", fontFamily: "'Inter', sans-serif" }}>${c.totalSpent.toFixed(2)}</td>
                    <td style={{ padding: "11px 16px", fontSize: "11px", color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>
                      {c.lastOrder?.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>No customers yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile */}
        <div className="cust-mob">
          {customers.map((c, i) => (
            <div key={c.phone} style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1.5px solid #f3f4f6", padding: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0, backgroundColor: `hsl(${(i * 47) % 360},65%,88%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: `hsl(${(i * 47) % 360},65%,32%)`, fontFamily: "'Inter', sans-serif" }}>
                  {c.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "13px", color: "#111", fontFamily: "'Inter', sans-serif" }}>{c.name}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>{c.phone}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#f97316", fontFamily: "'Inter', sans-serif" }}>${c.totalSpent.toFixed(2)}</div>
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px", fontFamily: "'Inter', sans-serif" }}>{c.address?.slice(0, 45)}…</div>
              <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>
                <span>{c.totalOrders} orders</span>
                <span>{c.lastOrder?.toLocaleDateString([], { day: "numeric", month: "short" }) ?? "—"}</span>
              </div>
            </div>
          ))}
          {customers.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>No customers yet</p>}
        </div>
      </main>
    </div>
  )
}