"use client"
import { useEffect, useState, useRef } from "react"
import { subscribeToOrders, updateOrderStatus, deleteOrder, Order, OrderStatus } from "@/lib/firestore"

const STATUSES: OrderStatus[] = ["pending","preparing","out_for_delivery","delivered","cancelled"]
const STATUS_COLORS: Record<string, string> = { pending: "#f59e0b", preparing: "#3b82f6", out_for_delivery: "#8b5cf6", delivered: "#10b981", cancelled: "#ef4444" }
const STATUS_LABELS: Record<string, string> = { pending: "Pending", preparing: "Preparing", out_for_delivery: "Out for Delivery", delivered: "Delivered", cancelled: "Cancelled" }

const getSecondsOld  = (createdAt: any): number => !createdAt?.toDate ? 999 : Math.floor((Date.now() - createdAt.toDate().getTime()) / 1000)
const isNew          = (createdAt: any) => getSecondsOld(createdAt) < 120
const shouldAutoConf = (order: Order) => order.status === "pending" && getSecondsOld(order.createdAt) >= 120

const timeAgo = (createdAt: any): string => {
  if (!createdAt?.toDate) return "Just now"
  const sec = getSecondsOld(createdAt)
  if (sec < 60) return `${sec}s ago`
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  return createdAt.toDate().toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })
}

// — Icons —
const CloseIcon  = (): React.ReactElement => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
const TrashIcon  = (): React.ReactElement => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
const UserIcon   = (): React.ReactElement => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const PhoneIcon  = (): React.ReactElement => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const MapPinIcon = (): React.ReactElement => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const NoteIcon   = (): React.ReactElement => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>

// — New Badge —
function NewBadge({ createdAt }: { createdAt: any }) {
  const [secondsOld, setSecondsOld] = useState(() => getSecondsOld(createdAt))
  useEffect(() => {
    if (secondsOld >= 120) return
    const iv = setInterval(() => { const s = getSecondsOld(createdAt); setSecondsOld(s); if (s >= 120) clearInterval(iv) }, 1000)
    return () => clearInterval(iv)
  }, [createdAt])
  if (secondsOld >= 120) return null
  const left = 120 - secondsOld
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "100px", padding: "2px 8px" }}>
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#ef4444", animation: "newpulse 0.8s infinite" }} />
        <span style={{ color: "#ef4444", fontSize: "10px", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>NEW</span>
      </div>
      <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fed7aa", borderRadius: "100px", padding: "2px 8px", fontSize: "10px", fontWeight: 600, color: "#b45309", fontFamily: "'Inter', sans-serif" }}>
        {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")} cancel window
      </div>
    </div>
  )
}

// — Order Modal —
function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const subtotal   = order.items?.reduce((s, i) => s + i.price * i.qty, 0) ?? 0
  const discount   = (order as any).discount ?? 0
  const promoCode  = (order as any).promoCode
  const deliveryFee = Math.max(0, order.total - subtotal + discount)
  const notes      = (order as any).notes

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "16px" }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "14px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", fontFamily: "'Inter', sans-serif", border: "1.5px solid #e5e7eb" }}>
        {/* Header */}
        <div style={{ padding: "18px 20px", borderBottom: "1.5px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 3px" }}>Order #{order.id.slice(-6).toUpperCase()}</h3>
            <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
              {order.createdAt?.toDate?.()?.toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) ?? "Just now"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", backgroundColor: `${STATUS_COLORS[order.status]}15`, color: STATUS_COLORS[order.status], border: `1px solid ${STATUS_COLORS[order.status]}30`, fontFamily: "'Inter', sans-serif" }}>
              {STATUS_LABELS[order.status]}
            </span>
            <button onClick={onClose} style={{ background: "none", border: "1.5px solid #e5e7eb", borderRadius: "7px", cursor: "pointer", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}><CloseIcon /></button>
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {/* Customer */}
          <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "14px", marginBottom: "16px", border: "1.5px solid #f3f4f6" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.6px", margin: "0 0 10px", fontFamily: "'Inter', sans-serif" }}>Customer</p>
            {[
              { icon: <UserIcon />,   val: order.customerName },
              { icon: <PhoneIcon />,  val: order.customerPhone },
              { icon: <MapPinIcon />, val: order.customerAddress },
              ...(notes ? [{ icon: <NoteIcon />, val: notes }] : []),
            ].map(({ icon, val }, i) => (
              <div key={i} style={{ display: "flex", gap: "9px", alignItems: "flex-start", marginBottom: "7px" }}>
                <span style={{ color: "#9ca3af", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
                <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.6px", margin: "0 0 10px", fontFamily: "'Inter', sans-serif" }}>Items</p>
          <div style={{ marginBottom: "16px" }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "6px", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>{item.qty}×</div>
                  <span style={{ fontSize: "13px", color: "#111", fontFamily: "'Inter', sans-serif" }}>{item.name}</span>
                </div>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", fontFamily: "'Inter', sans-serif" }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "14px", marginBottom: "16px", border: "1.5px solid #f3f4f6" }}>
            {[
              { label: "Subtotal",     val: `$${subtotal.toFixed(2)}`,     color: "#374151" },
              { label: "Delivery",     val: `$${deliveryFee.toFixed(2)}`,  color: "#374151" },
              ...(discount > 0 ? [{ label: `Discount${promoCode ? ` (${promoCode})` : ""}`, val: `-$${discount.toFixed(2)}`, color: "#10b981" }] : []),
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color, marginBottom: "7px", fontFamily: "'Inter', sans-serif" }}>
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 700, color: "#111", paddingTop: "10px", borderTop: "1.5px solid #e5e7eb", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>
              <span>Total</span><span style={{ color: "#f97316" }}>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Status */}
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.6px", margin: "0 0 10px", fontFamily: "'Inter', sans-serif" }}>Update Status</p>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "16px" }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => updateOrderStatus(order.id, s)} style={{ padding: "6px 12px", borderRadius: "7px", fontSize: "11px", fontWeight: 600, cursor: "pointer", border: "1.5px solid", fontFamily: "'Inter', sans-serif", borderColor: order.status === s ? STATUS_COLORS[s] : "#e5e7eb", backgroundColor: order.status === s ? `${STATUS_COLORS[s]}15` : "#fff", color: order.status === s ? STATUS_COLORS[s] : "#6b7280", transition: "all 0.15s" }}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          <button onClick={onClose} style={{ width: "100%", padding: "11px", borderRadius: "9px", border: "2px solid #111", backgroundColor: "#f97316", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif", boxShadow: "3px 3px 0px #111" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// — Main Page —
export default function DashboardOrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([])
  const [filter, setFilter]   = useState<"all" | OrderStatus>("all")
  const [selected, setSelected] = useState<Order | null>(null)
  const [tick, setTick]       = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const prevIds               = useRef<Set<string>>(new Set())
  const audioCtx              = useRef<AudioContext | null>(null)

  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(iv) }, [])
  useEffect(() => { orders.forEach(o => { if (shouldAutoConf(o)) updateOrderStatus(o.id, "preparing") }) }, [tick, orders])

  const playPing = () => {
    try {
      if (!audioCtx.current) audioCtx.current = new AudioContext()
      const ctx = audioCtx.current, osc = ctx.createOscillator(), gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5)
    } catch {}
  }

  useEffect(() => subscribeToOrders(incoming => {
    const newIds = new Set(incoming.map(o => o.id))
    if (prevIds.current.size > 0) incoming.forEach(o => { if (!prevIds.current.has(o.id)) playPing() })
    prevIds.current = newIds; setOrders(incoming)
  }), [])

  const filtered        = filter === "all" ? orders : orders.filter(o => o.status === filter)
  const newOrdersCount  = orders.filter(o => isNew(o.createdAt) && o.status === "pending").length

  const handleExportAndCleanup = async () => {
    if (filtered.length === 0) return alert("No orders to export in the current view.")
    let webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK || localStorage.getItem("sheetWebhookUrl")
    if (!webhookUrl) {
      webhookUrl = prompt("Enter your Google Apps Script Webhook URL (you only need to do this once):")
      if (!webhookUrl) return
      localStorage.setItem("sheetWebhookUrl", webhookUrl)
    }

    const confirmMsg = `Are you sure you want to export and permanently DELETE ${filtered.length} order(s) from Firebase?`
    if (!confirm(confirmMsg)) return

    setIsExporting(true)
    try {
      const payload = filtered.map(o => ({
        id: o.id,
        date: o.createdAt?.toDate?.()?.toLocaleString() || "N/A",
        customerName: o.customerName,
        phone: o.customerPhone,
        address: o.customerAddress,
        items: o.items?.map(i => `${i.qty}x ${i.name}`).join(", ") || "",
        total: `$${o.total.toFixed(2)}`,
        status: o.status
      }))

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.status === "success") {
        for (const order of filtered) {
          await deleteOrder(order.id)
        }
        alert(`Successfully exported and deleted ${data.count} orders!`)
      } else {
        alert("Failed to export: " + (data.message || "Unknown error"))
      }
    } catch (err: any) {
      alert("Error: " + err.message + "\n\nMake sure your Web App access is set to 'Anyone'.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes newpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        @keyframes rowin { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        .orders-tbl { display: block; }
        .orders-mob { display: none; }
        tr.order-row { animation: rowin 0.2s ease; cursor: pointer; }
        tr.order-row:hover td { background: #fafaf8 !important; }
        @media (max-width: 768px) {
          .orders-tbl { display: none; }
          .orders-mob { display: flex; flex-direction: column; gap: 10px; }
        }
      `}</style>

      <div style={{ marginBottom: "22px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111", margin: "0 0 3px", letterSpacing: "-0.3px" }}>Orders</h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>Auto-confirms pending orders after 2 min</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {newOrdersCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "7px", backgroundColor: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: "9px", padding: "7px 14px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#ef4444", animation: "newpulse 0.8s infinite" }} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#ef4444", fontFamily: "'Inter', sans-serif" }}>
                {newOrdersCount} new order{newOrdersCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
          <button 
            onClick={handleExportAndCleanup} 
            disabled={isExporting}
            style={{ padding: "8px 14px", borderRadius: "9px", border: "1.5px solid #d1d5db", backgroundColor: "#fff", color: "#374151", fontWeight: 600, fontSize: "12px", cursor: isExporting ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", opacity: isExporting ? 0.7 : 1, transition: "all 0.2s" }}
          >
            {isExporting ? "Exporting..." : "📤 Export & Cleanup"}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "7px", marginBottom: "18px", flexWrap: "wrap" }}>
        {(["all", ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 13px", borderRadius: "7px", fontSize: "12px", fontWeight: 500, border: "1.5px solid", fontFamily: "'Inter', sans-serif", borderColor: filter === s ? "#f97316" : "#e5e7eb", backgroundColor: filter === s ? "#fff7ed" : "#fff", color: filter === s ? "#f97316" : "#6b7280", cursor: "pointer", transition: "all 0.15s" }}>
            {s === "all" ? "All" : STATUS_LABELS[s]} ({s === "all" ? orders.length : orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="orders-tbl" style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #f3f4f6", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                {["Customer", "Phone", "Items", "Total", "Status", "Time", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.6px", fontFamily: "'Inter', sans-serif" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const orderIsNew = isNew(order.createdAt) && order.status === "pending"
                return (
                  <tr key={order.id} className="order-row" style={{ borderTop: "1px solid #f3f4f6", backgroundColor: orderIsNew ? "#fffef0" : "#fff" }} onClick={() => setSelected(order)}>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "2px", fontFamily: "'Inter', sans-serif" }}>{order.customerName}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>{order.customerAddress?.slice(0, 28)}{order.customerAddress?.length > 28 ? "…" : ""}</div>
                      {orderIsNew && <div style={{ marginTop: "5px" }}><NewBadge createdAt={order.createdAt} /></div>}
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: "12px", color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>{order.customerPhone}</td>
                    <td style={{ padding: "11px 16px", fontSize: "12px", fontWeight: 600, color: "#f97316", fontFamily: "'Inter', sans-serif" }}>{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</td>
                    <td style={{ padding: "11px 16px", fontSize: "13px", fontWeight: 700, color: "#111", fontFamily: "'Inter', sans-serif" }}>${order.total?.toFixed(2)}</td>
                    <td style={{ padding: "11px 16px" }} onClick={e => e.stopPropagation()}>
                      <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)} style={{ padding: "4px 8px", borderRadius: "7px", fontSize: "11px", fontWeight: 600, border: `1.5px solid ${STATUS_COLORS[order.status]}30`, color: STATUS_COLORS[order.status], backgroundColor: `${STATUS_COLORS[order.status]}12`, cursor: "pointer", outline: "none", fontFamily: "'Inter', sans-serif" }}>
                        {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap" as const, fontFamily: "'Inter', sans-serif" }}>{timeAgo(order.createdAt)}</td>
                    <td style={{ padding: "11px 16px" }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => deleteOrder(order.id)} style={{ background: "none", border: "1.5px solid #fecaca", color: "#ef4444", borderRadius: "7px", padding: "4px 9px", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="orders-mob">
        {filtered.map(order => {
          const orderIsNew = isNew(order.createdAt) && order.status === "pending"
          return (
            <div key={order.id} onClick={() => setSelected(order)} style={{ backgroundColor: "#fff", borderRadius: "10px", border: `1.5px solid ${orderIsNew ? "#fecaca" : "#f3f4f6"}`, padding: "14px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "7px" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "13px", color: "#111", marginBottom: "2px", fontFamily: "'Inter', sans-serif" }}>{order.customerName}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>{order.customerPhone}</div>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#f97316", fontFamily: "'Inter', sans-serif" }}>${order.total?.toFixed(2)}</span>
              </div>
              {orderIsNew && <div style={{ marginBottom: "9px" }}><NewBadge createdAt={order.createdAt} /></div>}
              <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "10px", fontFamily: "'Inter', sans-serif" }}>{order.customerAddress?.slice(0, 45)}…</div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
                <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)} style={{ flex: 1, padding: "6px 9px", borderRadius: "7px", fontSize: "11px", fontWeight: 600, border: `1.5px solid ${STATUS_COLORS[order.status]}30`, color: STATUS_COLORS[order.status], backgroundColor: `${STATUS_COLORS[order.status]}12`, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>{timeAgo(order.createdAt)}</span>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>No orders found</p>}
      </div>

      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}