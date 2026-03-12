"use client"
import { useEffect, useState, useRef } from "react"
import { subscribeToOrders, updateOrderStatus, deleteOrder, Order, OrderStatus } from "@/lib/firestore"

const STATUSES: OrderStatus[] = ["pending", "preparing", "out_for_delivery", "delivered", "cancelled"]

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  preparing: "#3b82f6",
  out_for_delivery: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const getSecondsOld = (createdAt: any): number => {
  if (!createdAt?.toDate) return 999
  return Math.floor((Date.now() - createdAt.toDate().getTime()) / 1000)
}

const isNew = (createdAt: any) => getSecondsOld(createdAt) < 120
const shouldAutoConfirm = (order: Order) =>
  order.status === "pending" && getSecondsOld(order.createdAt) >= 120

const timeAgo = (createdAt: any): string => {
  if (!createdAt?.toDate) return "Just now"
  const sec = getSecondsOld(createdAt)
  if (sec < 60) return `${sec}s ago`
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  return createdAt.toDate().toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })
}

// ── New Badge Timer ───────────────────────────────────────────────────────────

function NewBadge({ createdAt }: { createdAt: any }) {
  const [secondsOld, setSecondsOld] = useState(() => getSecondsOld(createdAt))

  useEffect(() => {
    if (secondsOld >= 120) return
    const interval = setInterval(() => {
      const s = getSecondsOld(createdAt)
      setSecondsOld(s)
      if (s >= 120) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [createdAt])

  if (secondsOld >= 120) return null

  const secondsLeft = 120 - secondsOld
  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60
  const timerStr = `${m}:${s.toString().padStart(2, "0")}`

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "5px",
        backgroundColor: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "999px", padding: "2px 8px",
      }}>
        <div style={{
          width: "6px", height: "6px", borderRadius: "50%",
          backgroundColor: "#ef4444",
          animation: "newpulse 0.8s infinite",
        }} />
        <span style={{ color: "#ef4444", fontSize: "10px", fontWeight: 800, letterSpacing: "0.5px" }}>NEW</span>
      </div>
      <div style={{
        backgroundColor: "rgba(245,158,11,0.1)",
        border: "1px solid rgba(245,158,11,0.2)",
        borderRadius: "999px", padding: "2px 8px",
        fontSize: "10px", fontWeight: 700, color: "#f59e0b",
      }}>
        ⏱ Cancel window: {timerStr}
      </div>
    </div>
  )
}

// ── Order Detail Modal ────────────────────────────────────────────────────────

function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const subtotal = order.items?.reduce((s, i) => s + i.price * i.qty, 0) ?? 0
  const discount = (order as any).discount ?? 0
  const promoCode = (order as any).promoCode
  const deliveryFee = order.total - subtotal + discount
  const notes = (order as any).notes

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "16px" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: "#fff", borderRadius: "20px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Modal Header */}
        <div style={{ padding: "24px 24px 0", borderBottom: "1px solid #f0f0f0", paddingBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#111", margin: "0 0 4px" }}>
                Order #{order.id.slice(-6).toUpperCase()}
              </h3>
              <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>
                {order.createdAt?.toDate?.()?.toLocaleString([], {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                }) ?? "Just now"}
              </p>
            </div>
            <div style={{
              backgroundColor: `${STATUS_COLORS[order.status]}18`,
              color: STATUS_COLORS[order.status],
              border: `1px solid ${STATUS_COLORS[order.status]}40`,
              borderRadius: "999px", padding: "5px 14px",
              fontSize: "12px", fontWeight: 700,
            }}>
              {STATUS_LABELS[order.status] ?? order.status}
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>

          {/* Customer Info */}
          <div style={{ backgroundColor: "#fafafa", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>Customer Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "14px" }}>👤</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>{order.customerName}</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "14px" }}>📞</span>
                <span style={{ fontSize: "14px", color: "#555" }}>{order.customerPhone}</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "14px" }}>📍</span>
                <span style={{ fontSize: "14px", color: "#555", lineHeight: 1.5 }}>{order.customerAddress}</span>
              </div>
              {notes && (
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "14px" }}>📝</span>
                  <span style={{ fontSize: "13px", color: "#888", fontStyle: "italic", lineHeight: 1.5 }}>{notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>Order Items</p>
          <div style={{ marginBottom: "20px" }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "#999" }}>
                    {item.qty}×
                  </div>
                  <span style={{ fontSize: "14px", color: "#111", fontWeight: 500 }}>{item.name}</span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div style={{ backgroundColor: "#fafafa", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>Price Breakdown</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}>
                <span>Delivery Fee</span>
                <span>${Math.max(0, deliveryFee).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#10b981" }}>
                  <span>Discount {promoCode && <span style={{ backgroundColor: "rgba(16,185,129,0.1)", borderRadius: "4px", padding: "1px 6px", fontSize: "11px", fontWeight: 700 }}>{promoCode}</span>}</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, color: "#111", paddingTop: "10px", borderTop: "1px solid #eee", marginTop: "4px" }}>
                <span>Total</span>
                <span style={{ color: "#f97316" }}>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Change Status */}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px" }}>Update Status</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => updateOrderStatus(order.id, s)}
                style={{
                  padding: "7px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 700,
                  cursor: "pointer", border: "1px solid",
                  borderColor: order.status === s ? STATUS_COLORS[s] : "#e5e5e5",
                  backgroundColor: order.status === s ? `${STATUS_COLORS[s]}18` : "#fff",
                  color: order.status === s ? STATUS_COLORS[s] : "#888",
                  transition: "all 0.15s",
                }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{ width: "100%", padding: "13px", borderRadius: "12px", backgroundColor: "#f97316", color: "#fff", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<"all" | OrderStatus>("all")
  const [selected, setSelected] = useState<Order | null>(null)
  const [tick, setTick] = useState(0)
  const prevOrderIds = useRef<Set<string>>(new Set())
  const audioCtx = useRef<AudioContext | null>(null)

  // Tick every second to re-render timers + trigger auto-confirm
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto-confirm pending orders after 2 min
  useEffect(() => {
    orders.forEach(order => {
      if (shouldAutoConfirm(order)) {
        updateOrderStatus(order.id, "preparing")
      }
    })
  }, [tick, orders])

  // Ping sound on new order
  const playPing = () => {
    try {
      if (!audioCtx.current) audioCtx.current = new AudioContext()
      const ctx = audioCtx.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch (e) {}
  }

  useEffect(() => {
    return subscribeToOrders((incoming) => {
      // Detect new orders
      const newIds = new Set(incoming.map(o => o.id))
      const isFirstLoad = prevOrderIds.current.size === 0
      if (!isFirstLoad) {
        incoming.forEach(o => {
          if (!prevOrderIds.current.has(o.id)) playPing()
        })
      }
      prevOrderIds.current = newIds
      setOrders(incoming)
    })
  }, [])

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter)
  const newOrdersCount = orders.filter(o => isNew(o.createdAt) && o.status === "pending").length

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes newpulse { 0%, 100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.5; transform: scale(1.3) } }
        @keyframes rowin { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }
        .orders-tbl { display: block; }
        .orders-mob { display: none; }
        tr.order-row { animation: rowin 0.2s ease; }
        tr.order-row:hover { background: #fafafa !important; }
        @media (max-width: 768px) {
          .orders-tbl { display: none; }
          .orders-mob { display: flex; flex-direction: column; gap: 12px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111", margin: "0 0 4px" }}>Orders</h1>
          <p style={{ fontSize: "14px", color: "#999", margin: 0 }}>Real-time order management — auto-confirms after 2 min</p>
        </div>
        {newOrdersCount > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "999px", padding: "8px 16px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444", animation: "newpulse 0.8s infinite" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#ef4444" }}>
              {newOrdersCount} new order{newOrdersCount > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {(["all", ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, border: "1px solid", borderColor: filter === s ? "#f97316" : "#e5e5e5", backgroundColor: filter === s ? "#f97316" : "#fff", color: filter === s ? "#fff" : "#666", cursor: "pointer", transition: "all 0.15s" }}>
            {s === "all" ? "All" : STATUS_LABELS[s]} ({s === "all" ? orders.length : orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="orders-tbl" style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fafafa" }}>
                {["Customer", "Phone", "Items", "Total", "Status", "Time", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const orderIsNew = isNew(order.createdAt) && order.status === "pending"
                return (
                  <tr key={order.id} className="order-row"
                    style={{ borderTop: "1px solid #f5f5f5", backgroundColor: orderIsNew ? "rgba(239,68,68,0.02)" : "#fff", cursor: "pointer" }}
                    onClick={() => setSelected(order)}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>{order.customerName}</div>
                          <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{order.customerAddress?.slice(0, 28)}{order.customerAddress?.length > 28 ? "…" : ""}</div>
                        </div>
                      </div>
                      {orderIsNew && <div style={{ marginTop: "6px" }}><NewBadge createdAt={order.createdAt} /></div>}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#666" }}>{order.customerPhone}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: "#f97316", fontWeight: 600, fontSize: "13px" }}>{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#111" }}>${order.total?.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                      <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        style={{ padding: "5px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, border: `1.5px solid ${STATUS_COLORS[order.status]}`, color: STATUS_COLORS[order.status], backgroundColor: `${STATUS_COLORS[order.status]}15`, cursor: "pointer", outline: "none" }}>
                        {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "11px", color: "#aaa", whiteSpace: "nowrap" }}>
                      {timeAgo(order.createdAt)}
                    </td>
                    <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => deleteOrder(order.id)}
                        style={{ background: "none", border: "1px solid #fee2e2", color: "#ef4444", borderRadius: "8px", padding: "4px 10px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>
                        Del
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#ccc", fontSize: "14px" }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="orders-mob">
        {filtered.map(order => {
          const orderIsNew = isNew(order.createdAt) && order.status === "pending"
          return (
            <div key={order.id}
              onClick={() => setSelected(order)}
              style={{ backgroundColor: "#fff", borderRadius: "14px", border: `1px solid ${orderIsNew ? "rgba(239,68,68,0.2)" : "#f0f0f0"}`, padding: "16px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#111", marginBottom: "2px" }}>{order.customerName}</div>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>{order.customerPhone}</div>
                </div>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#f97316" }}>${order.total?.toFixed(2)}</span>
              </div>
              {orderIsNew && <div style={{ marginBottom: "10px" }}><NewBadge createdAt={order.createdAt} /></div>}
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>📍 {order.customerAddress?.slice(0, 45)}…</div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
                <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  style={{ flex: 1, padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${STATUS_COLORS[order.status]}`, color: STATUS_COLORS[order.status], backgroundColor: `${STATUS_COLORS[order.status]}15`, cursor: "pointer" }}>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                <span style={{ fontSize: "11px", color: "#aaa" }}>{timeAgo(order.createdAt)}</span>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <p style={{ textAlign: "center", color: "#ccc", padding: "40px 0" }}>No orders found</p>}
      </div>

      {/* Order Detail Modal */}
      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}