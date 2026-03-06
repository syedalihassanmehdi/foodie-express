"use client"
import { useEffect, useState } from "react"
import { subscribeToOrders, Order } from "@/lib/firestore"

interface Customer {
  name: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  lastOrder: Date | null
}

export default function CustomersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => subscribeToOrders(setOrders), [])

  // Build unique customers from orders
  const customerMap: Record<string, Customer> = {}
  for (const order of orders) {
    const key = order.customerPhone
    if (!customerMap[key]) {
      customerMap[key] = { name: order.customerName, phone: order.customerPhone, address: order.customerAddress, totalOrders: 0, totalSpent: 0, lastOrder: null }
    }
    customerMap[key].totalOrders++
    customerMap[key].totalSpent += order.total || 0
    const d = order.createdAt?.toDate?.()
    if (d && (!customerMap[key].lastOrder || d > customerMap[key].lastOrder!)) {
      customerMap[key].lastOrder = d
    }
  }

  const customers = Object.values(customerMap).filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  ).sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111", margin: 0 }}>Customers</h1>
        <p style={{ fontSize: "14px", color: "#999", marginTop: "4px" }}>All customers derived from your order history.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Total Customers", value: customers.length, color: "#f97316" },
          { label: "Total Orders", value: orders.length, color: "#3b82f6" },
          { label: "Avg Order Value", value: `₹${orders.length ? Math.round(orders.reduce((a, o) => a + (o.total || 0), 0) / orders.length) : 0}`, color: "#10b981" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "16px 24px", border: "1px solid #f0f0f0", minWidth: "140px" }}>
            <div style={{ fontSize: "22px", fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: "13px", color: "#999", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", width: "300px", maxWidth: "100%", boxSizing: "border-box" }}
        />
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fafafa" }}>
                {["Customer", "Phone", "Address", "Orders", "Total Spent", "Last Order"].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.5px" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.phone} style={{ borderTop: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                        backgroundColor: `hsl(${(i * 47) % 360},70%,90%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: 700, color: `hsl(${(i * 47) % 360},70%,35%)`,
                      }}>
                        {c.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "#111" }}>{c.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#666" }}>{c.phone}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#666", maxWidth: "180px" }}>{c.address?.slice(0, 40)}{c.address?.length > 40 ? "…" : ""}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>{c.totalOrders}</span>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: "14px", color: "#f97316" }}>₹{c.totalSpent.toLocaleString()}</td>
                  <td style={{ padding: "14px 20px", fontSize: "12px", color: "#aaa" }}>
                    {c.lastOrder?.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#ccc" }}>No customers yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}