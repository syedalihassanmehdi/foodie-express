"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import {
  subscribeToBundles, addBundle, updateBundle, deleteBundle, Bundle,
  subscribeToMenu, subscribeToCategories, MenuItem, Category
} from "@/lib/firestore"

type BundleCategory = Bundle["categories"][0]
const EMOJIS = ["🥗","🍔","🍕","🍝","🍰","🍩","🥤","🍜","🌮","🍱"]

const PlusIcon  = (): React.ReactElement => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
const EditIcon  = (): React.ReactElement => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const TrashIcon = (): React.ReactElement => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const CloseIcon = (): React.ReactElement => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
const CheckIcon = (): React.ReactElement => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: "8px",
  border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none",
  fontFamily: "'Inter', sans-serif", color: "#111",
  transition: "border-color 0.15s", boxSizing: "border-box",
}
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280",
  textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "5px",
  fontFamily: "'Inter', sans-serif",
}

export default function BundlesPage() {
  const [bundles, setBundles]       = useState<Bundle[]>([])
  const [menuItems, setMenuItems]   = useState<MenuItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  const [saving, setSaving]         = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [name, setName]             = useState("")
  const [description, setDescription] = useState("")
  const [discount, setDiscount]     = useState(15)
  const [active, setActive]         = useState(true)
  const [bundleCategories, setBundleCategories] = useState<BundleCategory[]>([
    { label: "Starter", emoji: "🥗", items: [] },
    { label: "Main",    emoji: "🍔", items: [] },
    { label: "Dessert", emoji: "🍰", items: [] },
  ])

  useEffect(() => {
    const u1 = subscribeToBundles(b => { setBundles(b); setLoading(false) })
    const u2 = subscribeToMenu(setMenuItems)
    const u3 = subscribeToCategories(() => {})
    return () => { u1(); u2(); u3() }
  }, [])

  const resetForm = () => {
    setName(""); setDescription(""); setDiscount(15); setActive(true)
    setBundleCategories([
      { label: "Starter", emoji: "🥗", items: [] },
      { label: "Main",    emoji: "🍔", items: [] },
      { label: "Dessert", emoji: "🍰", items: [] },
    ])
    setEditingBundle(null)
  }

  const openEdit = (bundle: Bundle) => {
    setEditingBundle(bundle); setName(bundle.name); setDescription(bundle.description)
    setDiscount(bundle.discount); setActive(bundle.active); setBundleCategories(bundle.categories)
    setShowForm(true)
  }

  const toggleItemInCategory = (catIndex: number, menuItem: MenuItem) => {
    setBundleCategories(prev => {
      const updated = [...prev]
      const cat = { ...updated[catIndex] }
      const exists = cat.items.find(i => i.menuItemId === menuItem.id)
      cat.items = exists
        ? cat.items.filter(i => i.menuItemId !== menuItem.id)
        : [...cat.items, { id: menuItem.id, name: menuItem.name, price: menuItem.price, image: menuItem.image, menuItemId: menuItem.id }]
      updated[catIndex] = cat
      return updated
    })
  }

  const updateCategoryLabel = (index: number, label: string) =>
    setBundleCategories(prev => { const u = [...prev]; u[index] = { ...u[index], label }; return u })
  const updateCategoryEmoji = (index: number, emoji: string) =>
    setBundleCategories(prev => { const u = [...prev]; u[index] = { ...u[index], emoji }; return u })
  const addBundleCategory = () =>
    setBundleCategories(prev => [...prev, { label: "New Category", emoji: "🍽️", items: [] }])
  const removeCategory = (index: number) =>
    setBundleCategories(prev => prev.filter((_, i) => i !== index))

  const handleSave = async () => {
    if (!name.trim()) return alert("Bundle name is required")
    if (bundleCategories.some(c => c.items.length === 0)) return alert("Each category must have at least one item")
    setSaving(true)
    try {
      const data = { name, description, discount, active, categories: bundleCategories }
      if (editingBundle) await updateBundle(editingBundle.id, data)
      else await addBundle(data)
      resetForm(); setShowForm(false)
    } catch { alert("Error saving bundle") }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bundle?")) return
    setDeletingId(id); await deleteBundle(id); setDeletingId(null)
  }

  const itemsByCategory: Record<string, MenuItem[]> = {}
  menuItems.forEach(item => {
    if (!itemsByCategory[item.category]) itemsByCategory[item.category] = []
    itemsByCategory[item.category].push(item)
  })

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .b-main { margin-left: 216px; flex: 1; padding: 32px; max-width: calc(100% - 216px); }
        .b-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
        .b-form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .b-items-2col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        @media (max-width: 768px) {
          .b-main { margin-left: 0 !important; max-width: 100% !important; padding: 70px 16px 32px !important; }
          .b-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 540px) {
          .b-form-2col { grid-template-columns: 1fr; }
          .b-items-2col { grid-template-columns: 1fr; }
        }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .b-input:focus { border-color: #f97316 !important; }
        .b-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07) !important; }
      `}</style>

      <main className="b-main">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: "20px", color: "#111", margin: "0 0 3px", letterSpacing: "-0.3px" }}>Bundle Manager</h1>
            <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>Create dynamic bundle offers for customers</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true) }} style={{
            display: "flex", alignItems: "center", gap: "6px",
            backgroundColor: "#f97316", color: "#fff",
            border: "2px solid #111", borderRadius: "10px",
            padding: "9px 18px", fontWeight: 600, fontSize: "13px",
            cursor: "pointer", boxShadow: "3px 3px 0px #111",
            fontFamily: "'Inter', sans-serif",
          }}>
            <PlusIcon /> New Bundle
          </button>
        </div>

        {/* Modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", width: "100%", maxWidth: "680px", padding: "24px", border: "2px solid #e5e7eb", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
                <h2 style={{ fontWeight: 700, fontSize: "16px", color: "#111", margin: 0 }}>
                  {editingBundle ? "Edit Bundle" : "Create Bundle"}
                </h2>
                <button onClick={() => { setShowForm(false); resetForm() }} style={{ background: "none", border: "1.5px solid #e5e7eb", borderRadius: "8px", cursor: "pointer", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                  <CloseIcon />
                </button>
              </div>

              <div className="b-form-2col">
                <div>
                  <label style={labelStyle}>Bundle Name *</label>
                  <input className="b-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Date Night Special" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Discount %</label>
                  <input className="b-input" type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} min={1} max={50} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Description</label>
                <textarea className="b-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this bundle offer..." rows={2}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              {/* Active toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", padding: "12px 14px", backgroundColor: "#f9fafb", borderRadius: "10px", border: "1.5px solid #e5e7eb" }}>
                <div onClick={() => setActive(p => !p)} style={{ width: "40px", height: "22px", borderRadius: "100px", backgroundColor: active ? "#f97316" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: "2px", left: active ? "20px" : "2px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
                <span style={{ fontWeight: 500, fontSize: "13px", color: "#374151", fontFamily: "'Inter', sans-serif" }}>
                  {active ? "Active — visible on Offers page" : "Inactive — hidden from customers"}
                </span>
              </div>

              {/* Bundle Categories */}
              <div style={{ marginBottom: "22px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Bundle Categories</label>
                  <button onClick={addBundleCategory} style={{ fontSize: "12px", color: "#f97316", background: "none", border: "1.5px solid rgba(249,115,22,0.3)", borderRadius: "7px", padding: "3px 10px", cursor: "pointer", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>+ Add</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {bundleCategories.map((cat, catIndex) => (
                    <div key={catIndex} style={{ border: "1.5px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
                      <div style={{ padding: "10px 12px", backgroundColor: "#f9fafb", borderBottom: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", gap: "8px" }}>
                        <select value={cat.emoji} onChange={e => updateCategoryEmoji(catIndex, e.target.value)} style={{ padding: "3px 5px", borderRadius: "6px", border: "1.5px solid #e5e7eb", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
                          {EMOJIS.map(em => <option key={em} value={em}>{em}</option>)}
                        </select>
                        <input value={cat.label} onChange={e => updateCategoryLabel(catIndex, e.target.value)}
                          style={{ flex: 1, minWidth: 0, padding: "5px 9px", borderRadius: "7px", border: "1.5px solid #e5e7eb", fontSize: "13px", fontWeight: 600, outline: "none", fontFamily: "'Inter', sans-serif" }} />
                        <span style={{ fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>{cat.items.length} selected</span>
                        {bundleCategories.length > 1 && (
                          <button onClick={() => removeCategory(catIndex)} style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", padding: 0, display: "flex" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#d1d5db")}><TrashIcon /></button>
                        )}
                      </div>
                      <div style={{ padding: "12px", maxHeight: "240px", overflowY: "auto" }}>
                        {Object.keys(itemsByCategory).length === 0
                          ? <p style={{ color: "#9ca3af", fontSize: "13px", textAlign: "center", padding: "12px 0" }}>No menu items found.</p>
                          : Object.entries(itemsByCategory).map(([catName, catItems]) => (
                            <div key={catName} style={{ marginBottom: "10px" }}>
                              <p style={{ fontSize: "10px", fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 6px", fontFamily: "'Inter', sans-serif" }}>{catName}</p>
                              <div className="b-items-2col">
                                {catItems.map(menuItem => {
                                  const isSelected = cat.items.some(i => i.menuItemId === menuItem.id)
                                  return (
                                    <div key={menuItem.id} onClick={() => toggleItemInCategory(catIndex, menuItem)}
                                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 9px", borderRadius: "8px", border: `1.5px solid ${isSelected ? "#f97316" : "#e5e7eb"}`, backgroundColor: isSelected ? "#fff7ed" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
                                      <img src={menuItem.image} alt={menuItem.name} style={{ width: "30px", height: "30px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />
                                      <div style={{ minWidth: 0, flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: "12px", color: "#111", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>{menuItem.name}</p>
                                        <p style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, margin: 0, fontFamily: "'Inter', sans-serif" }}>${menuItem.price.toFixed(2)}</p>
                                      </div>
                                      {isSelected && <span style={{ color: "#f97316", display: "flex", flexShrink: 0 }}><CheckIcon /></span>}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={() => { setShowForm(false); resetForm() }} style={{ padding: "9px 18px", borderRadius: "8px", border: "1.5px solid #e5e7eb", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{ padding: "9px 22px", borderRadius: "8px", border: "2px solid #111", background: saving ? "#e5e7eb" : "#f97316", color: saving ? "#9ca3af" : "#fff", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", boxShadow: saving ? "none" : "3px 3px 0px #111" }}>
                  {saving ? "Saving..." : editingBundle ? "Save Changes" : "Create Bundle"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bundle List */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height: "160px", borderRadius: "12px", backgroundColor: "#f0f0f0", animation: "shimmer 1.5s ease-in-out infinite" }} />)}
          </div>
        ) : bundles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📦</div>
            <h3 style={{ fontWeight: 600, fontSize: "15px", color: "#9ca3af", marginBottom: "4px" }}>No bundles yet</h3>
            <p style={{ fontSize: "13px", color: "#d1d5db", fontFamily: "'Inter', sans-serif" }}>Create your first bundle offer above.</p>
          </div>
        ) : (
          <div className="b-grid">
            {bundles.map(bundle => (
              <div key={bundle.id} className="b-card" style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #f3f4f6", overflow: "hidden", transition: "box-shadow 0.2s" }}>
                <div style={{ padding: "16px 16px 12px", borderBottom: "1.5px solid #f3f4f6" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "14px", color: "#111", margin: 0, flex: 1, minWidth: 0, fontFamily: "'Inter', sans-serif" }}>{bundle.name}</h3>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", flexShrink: 0, fontFamily: "'Inter', sans-serif", backgroundColor: bundle.active ? "#dcfce7" : "#f3f4f6", color: bundle.active ? "#16a34a" : "#9ca3af" }}>
                      {bundle.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 10px", lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{bundle.description || "No description"}</p>
                  <span style={{ display: "inline-block", backgroundColor: "#fff7ed", color: "#f97316", fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", border: "1px solid #fed7aa", fontFamily: "'Inter', sans-serif" }}>
                    {bundle.discount}% off
                  </span>
                </div>
                <div style={{ padding: "10px 16px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {bundle.categories.map(cat => (
                    <span key={cat.label} style={{ display: "flex", alignItems: "center", gap: "3px", backgroundColor: "#f9fafb", borderRadius: "6px", padding: "3px 8px", border: "1px solid #e5e7eb", fontSize: "11px", color: "#374151", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                      {cat.emoji} {cat.label} ({cat.items.length})
                    </span>
                  ))}
                </div>
                <div style={{ padding: "8px 16px 14px", display: "flex", gap: "7px" }}>
                  <button onClick={() => openEdit(bundle)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "7px", borderRadius: "8px", border: "1.5px solid #e5e7eb", background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#374151", fontFamily: "'Inter', sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151" }}>
                    <EditIcon /> Edit
                  </button>
                  <button onClick={() => updateBundle(bundle.id, { active: !bundle.active })} style={{ flex: 1, padding: "7px", borderRadius: "8px", border: `1.5px solid ${bundle.active ? "#fecaca" : "#bbf7d0"}`, background: bundle.active ? "#fff5f5" : "#f0fdf4", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: bundle.active ? "#ef4444" : "#16a34a", fontFamily: "'Inter', sans-serif" }}>
                    {bundle.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDelete(bundle.id)} disabled={deletingId === bundle.id} style={{ padding: "7px 11px", borderRadius: "8px", border: "1.5px solid #fecaca", background: "#fff5f5", fontSize: "12px", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {deletingId === bundle.id ? "…" : <TrashIcon />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}