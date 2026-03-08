"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { subscribeToOffers, addOffer, updateOffer, deleteOffer, Offer } from "@/lib/firestore"

const OFFER_TYPES = [
  { value: "percent", label: "% Discount" },
  { value: "flat", label: "Flat $ Off" },
  { value: "bogo", label: "Buy 1 Get 1" },
  { value: "free_delivery", label: "Free Delivery" },
]

const EMPTY: Omit<Offer, "id" | "createdAt"> = {
  title: "", description: "", type: "percent",
  value: 0, code: "", active: true, expiresAt: "",
}

const TYPE_COLORS: Record<string, string> = {
  percent: "#f97316", flat: "#3b82f6", bogo: "#8b5cf6", free_delivery: "#10b981",
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => subscribeToOffers(setOffers), [])

  const handleSave = async () => {
    if (!form.title || !form.code) return
    if (editId) await updateOffer(editId, form)
    else await addOffer(form)
    setForm(EMPTY); setEditId(null); setShowForm(false)
  }

  const handleEdit = (offer: Offer) => {
    setForm({ title: offer.title, description: offer.description, type: offer.type, value: offer.value, code: offer.code, active: offer.active, expiresAt: offer.expiresAt })
    setEditId(offer.id); setShowForm(true)
  }

  const formatValue = (offer: Offer) => {
    if (offer.type === "percent") return `${offer.value}% off`
    if (offer.type === "flat") return `$${offer.value} off`
    if (offer.type === "bogo") return "Buy 1 Get 1"
    return "Free Delivery"
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />
      <style>{`
        * { box-sizing: border-box; }
        .dash-main { margin-left: 220px; flex: 1; padding: 32px; max-width: calc(100% - 220px); }
        .offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .stats-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
        .stat-card { background: #fff; border-radius: 12px; padding: 16px 20px; border: 1px solid #f0f0f0; flex: 1; min-width: 100px; }
        .offer-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        @media (max-width: 768px) {
          .dash-main { margin-left: 0 !important; max-width: 100% !important; padding: 72px 16px 32px !important; }
          .offers-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .offer-modal-grid { grid-template-columns: 1fr; }
          .stats-row { gap: 8px; }
          .stat-card { min-width: 80px; padding: 12px 14px; }
        }
      `}</style>

      <main className="dash-main">
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111", margin: 0 }}>Offers & Promotions</h1>
            <p style={{ fontSize: "14px", color: "#999", marginTop: "4px" }}>Create discount codes and special deals for customers.</p>
          </div>
          <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true) }} style={{ padding: "10px 20px", backgroundColor: "#f97316", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
            + New Offer
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label: "Total Offers", value: offers.length, color: "#f97316" },
            { label: "Active", value: offers.filter(o => o.active).length, color: "#10b981" },
            { label: "Inactive", value: offers.filter(o => !o.active).length, color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card">
              <div style={{ fontSize: "22px", fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="offers-grid">
          {offers.map(offer => (
            <div key={offer.id} style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", backgroundColor: TYPE_COLORS[offer.type] }} />
              <div style={{ paddingLeft: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "8px" }}>
                  <div style={{ fontWeight: 800, fontSize: "15px", color: "#111", flex: 1 }}>{offer.title}</div>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px", flexShrink: 0, backgroundColor: offer.active ? "#dcfce7" : "#f3f4f6", color: offer.active ? "#16a34a" : "#9ca3af" }}>
                    {offer.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>{offer.description}</div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, backgroundColor: `${TYPE_COLORS[offer.type]}15`, color: TYPE_COLORS[offer.type] }}>
                    {formatValue(offer)}
                  </span>
                  <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, backgroundColor: "#f5f5f5", color: "#555", letterSpacing: "1px" }}>
                    {offer.code}
                  </span>
                </div>
                {offer.expiresAt && <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "12px" }}>Expires: {offer.expiresAt}</div>}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => updateOffer(offer.id, { active: !offer.active })} style={{ flex: 1, padding: "7px 4px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #e5e5e5", backgroundColor: "#fff", cursor: "pointer", color: "#555" }}>
                    {offer.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleEdit(offer)} style={{ flex: 1, padding: "7px 4px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #dbeafe", backgroundColor: "#eff6ff", cursor: "pointer", color: "#2563eb" }}>Edit</button>
                  <button onClick={() => deleteOffer(offer.id)} style={{ flex: 1, padding: "7px 4px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #fee2e2", backgroundColor: "#fff5f5", cursor: "pointer", color: "#ef4444" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {offers.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px", color: "#ccc" }}>No offers yet. Create your first one!</div>
          )}
        </div>

        {/* Modal */}
        {showForm && (
          <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "24px", width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111", marginBottom: "20px" }}>
                {editId ? "Edit Offer" : "Create New Offer"}
              </h3>
              {[
                { label: "Offer Title *", key: "title" },
                { label: "Promo Code *", key: "code" },
                { label: "Description", key: "description" },
              ].map(({ label, key }) => (
                <div key={key} style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              <div className="offer-modal-grid">
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Offer["type"] })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px" }}>
                    {OFFER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Value</label>
                  <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Expiry Date</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                <label htmlFor="active" style={{ fontSize: "14px", fontWeight: 600, color: "#555" }}>Active immediately</label>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #e5e5e5", backgroundColor: "#fff", fontWeight: 600, fontSize: "14px", cursor: "pointer", color: "#555" }}>Cancel</button>
                <button onClick={handleSave} style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#f97316", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                  {editId ? "Save Changes" : "Create Offer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}