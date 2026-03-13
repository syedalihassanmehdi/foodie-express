"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { subscribeToOffers, addOffer, updateOffer, deleteOffer, Offer } from "@/lib/firestore"

const OFFER_TYPES = [
  { value: "percent",       label: "% Discount"   },
  { value: "flat",          label: "Flat $ Off"    },
  { value: "bogo",          label: "Buy 1 Get 1"   },
  { value: "free_delivery", label: "Free Delivery" },
]
const EMPTY: Omit<Offer, "id" | "createdAt"> = { title: "", description: "", type: "percent", value: 0, code: "", active: true, expiresAt: "" }
const TYPE_COLORS: Record<string, string> = { percent: "#f97316", flat: "#3b82f6", bogo: "#8b5cf6", free_delivery: "#10b981" }

const PlusIcon  = (): React.ReactElement => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
const EditIcon  = (): React.ReactElement => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const TrashIcon = (): React.ReactElement => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
const CloseIcon = (): React.ReactElement => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>

const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box", transition: "border-color 0.15s" }
const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "5px", fontFamily: "'Inter', sans-serif" }

export default function OffersPage() {
  const [offers, setOffers]   = useState<Offer[]>([])
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState<string | null>(null)
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
    if (offer.type === "percent")       return `${offer.value}% off`
    if (offer.type === "flat")          return `$${offer.value} off`
    if (offer.type === "bogo")          return "Buy 1 Get 1"
    return "Free Delivery"
  }

  const focusOrange = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = "#f97316" }
  const blurGray    = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = "#e5e7eb" }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .dash-main { margin-left: 216px; flex: 1; padding: 32px; max-width: calc(100% - 216px); }
        .offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px; }
        .offer-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        @media (max-width: 768px) {
          .dash-main { margin-left: 0 !important; max-width: 100% !important; padding: 70px 16px 32px !important; }
          .offers-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) { .offer-modal-grid { grid-template-columns: 1fr; } }
        .offer-card:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.07) !important; }
      `}</style>

      <main className="dash-main">
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111", margin: "0 0 3px", letterSpacing: "-0.3px" }}>Offers & Promotions</h1>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>Create discount codes and special deals</p>
          </div>
          <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true) }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", backgroundColor: "#f97316", color: "#fff", border: "2px solid #111", borderRadius: "10px", fontWeight: 600, fontSize: "13px", cursor: "pointer", boxShadow: "3px 3px 0px #111", fontFamily: "'Inter', sans-serif" }}>
            <PlusIcon /> New Offer
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
          {[
            { label: "Total Offers", value: offers.length,                         color: "#f97316" },
            { label: "Active",       value: offers.filter(o => o.active).length,   color: "#10b981" },
            { label: "Inactive",     value: offers.filter(o => !o.active).length,  color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "14px 18px", border: "1.5px solid #f3f4f6", flex: 1, minWidth: "100px" }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color, letterSpacing: "-0.5px", fontFamily: "'Inter', sans-serif" }}>{value}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="offers-grid">
          {offers.map(offer => (
            <div key={offer.id} className="offer-card" style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #f3f4f6", overflow: "hidden", position: "relative", transition: "box-shadow 0.2s" }}>
              {/* Left accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", backgroundColor: TYPE_COLORS[offer.type] }} />
              <div style={{ padding: "14px 14px 14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px", gap: "8px" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#111", flex: 1, fontFamily: "'Inter', sans-serif" }}>{offer.title}</div>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", flexShrink: 0, fontFamily: "'Inter', sans-serif", backgroundColor: offer.active ? "#dcfce7" : "#f3f4f6", color: offer.active ? "#16a34a" : "#9ca3af" }}>
                    {offer.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px", lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{offer.description}</div>
                <div style={{ display: "flex", gap: "7px", marginBottom: "10px", flexWrap: "wrap" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, fontFamily: "'Inter', sans-serif", backgroundColor: `${TYPE_COLORS[offer.type]}15`, color: TYPE_COLORS[offer.type], border: `1px solid ${TYPE_COLORS[offer.type]}30` }}>
                    {formatValue(offer)}
                  </span>
                  <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, fontFamily: "'Inter', sans-serif", backgroundColor: "#f9fafb", color: "#374151", border: "1px solid #e5e7eb", letterSpacing: "0.5px" }}>
                    {offer.code}
                  </span>
                </div>
                {offer.expiresAt && <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "10px", fontFamily: "'Inter', sans-serif" }}>Expires: {offer.expiresAt}</div>}
                <div style={{ display: "flex", gap: "7px" }}>
                  <button onClick={() => updateOffer(offer.id, { active: !offer.active })} style={{ flex: 1, padding: "7px", borderRadius: "7px", fontSize: "12px", fontWeight: 500, border: `1.5px solid ${offer.active ? "#fecaca" : "#bbf7d0"}`, background: offer.active ? "#fff5f5" : "#f0fdf4", cursor: "pointer", color: offer.active ? "#ef4444" : "#16a34a", fontFamily: "'Inter', sans-serif" }}>
                    {offer.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleEdit(offer)} style={{ padding: "7px 10px", borderRadius: "7px", border: "1.5px solid #dbeafe", backgroundColor: "#eff6ff", cursor: "pointer", color: "#2563eb", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                    <EditIcon /> Edit
                  </button>
                  <button onClick={() => deleteOffer(offer.id)} style={{ padding: "7px 10px", borderRadius: "7px", border: "1.5px solid #fecaca", backgroundColor: "#fff5f5", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center" }}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {offers.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#9ca3af", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>🏷️</div>
              No offers yet. Create your first one!
            </div>
          )}
        </div>

        {/* Modal */}
        {showForm && (
          <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "22px", width: "100%", maxWidth: "440px", maxHeight: "90vh", overflowY: "auto", border: "1.5px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: 0, fontFamily: "'Inter', sans-serif" }}>{editId ? "Edit Offer" : "Create Offer"}</h3>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "1.5px solid #e5e7eb", borderRadius: "7px", cursor: "pointer", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}><CloseIcon /></button>
              </div>

              {[
                { label: "Offer Title *", key: "title" },
                { label: "Promo Code *",  key: "code"  },
                { label: "Description",   key: "description" },
              ].map(({ label, key }) => (
                <div key={key} style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
                </div>
              ))}

              <div className="offer-modal-grid">
                <div>
                  <label style={labelStyle}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Offer["type"] })} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
                    {OFFER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Value</label>
                  <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Expiry Date</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", backgroundColor: "#f9fafb", borderRadius: "9px", border: "1.5px solid #e5e7eb", marginBottom: "18px" }}>
                <div onClick={() => setForm(f => ({ ...f, active: !f.active }))} style={{ width: "38px", height: "21px", borderRadius: "100px", backgroundColor: form.active ? "#f97316" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: "2px", left: form.active ? "18px" : "2px", width: "17px", height: "17px", borderRadius: "50%", backgroundColor: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: "'Inter', sans-serif" }}>Active immediately</span>
              </div>

              <div style={{ display: "flex", gap: "9px" }}>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1.5px solid #e5e7eb", backgroundColor: "#fff", fontWeight: 500, fontSize: "13px", cursor: "pointer", color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                <button onClick={handleSave} style={{ flex: 2, padding: "10px", borderRadius: "9px", border: "2px solid #111", backgroundColor: "#f97316", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer", boxShadow: "3px 3px 0px #111", fontFamily: "'Inter', sans-serif" }}>
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