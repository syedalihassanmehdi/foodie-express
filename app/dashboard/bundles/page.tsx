"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import {
  subscribeToBundles, addBundle, updateBundle, deleteBundle, Bundle,
  subscribeToMenu, subscribeToCategories, MenuItem, Category
} from "@/lib/firestore"

type BundleCategory = Bundle["categories"][0]
type BundleItem = BundleCategory["items"][0]

const EMOJIS = ["🥗","🍔","🍕","🍝","🍰","🍩","🥤","🍜","🌮","🍱"]

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [discount, setDiscount] = useState(15)
  const [active, setActive] = useState(true)
  const [bundleCategories, setBundleCategories] = useState<BundleCategory[]>([
    { label: "Starter", emoji: "🥗", items: [] },
    { label: "Main",    emoji: "🍔", items: [] },
    { label: "Dessert", emoji: "🍰", items: [] },
  ])

  useEffect(() => {
    const unsub1 = subscribeToBundles(b => { setBundles(b); setLoading(false) })
    const unsub2 = subscribeToMenu(setMenuItems)
    const unsub3 = subscribeToCategories(setCategories)
    return () => { unsub1(); unsub2(); unsub3() }
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
    setEditingBundle(bundle)
    setName(bundle.name)
    setDescription(bundle.description)
    setDiscount(bundle.discount)
    setActive(bundle.active)
    setBundleCategories(bundle.categories)
    setShowForm(true)
  }

  const toggleItemInCategory = (catIndex: number, menuItem: MenuItem) => {
    setBundleCategories(prev => {
      const updated = [...prev]
      const cat = { ...updated[catIndex] }
      const exists = cat.items.find(i => i.menuItemId === menuItem.id)
      if (exists) {
        cat.items = cat.items.filter(i => i.menuItemId !== menuItem.id)
      } else {
        cat.items = [...cat.items, {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          menuItemId: menuItem.id,
        }]
      }
      updated[catIndex] = cat
      return updated
    })
  }

  const updateCategoryLabel = (index: number, label: string) => {
    setBundleCategories(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], label }
      return updated
    })
  }

  const updateCategoryEmoji = (index: number, emoji: string) => {
    setBundleCategories(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], emoji }
      return updated
    })
  }

  const addCategory = () => {
    setBundleCategories(prev => [...prev, { label: "New Category", emoji: "🍽️", items: [] }])
  }

  const removeCategory = (index: number) => {
    setBundleCategories(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!name.trim()) return alert("Bundle name is required")
    if (bundleCategories.some(c => c.items.length === 0)) return alert("Each category must have at least one item")
    setSaving(true)
    try {
      const data = { name, description, discount, active, categories: bundleCategories }
      if (editingBundle) {
        await updateBundle(editingBundle.id, data)
      } else {
        await addBundle(data)
      }
      resetForm()
      setShowForm(false)
    } catch (e) {
      alert("Error saving bundle")
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bundle?")) return
    setDeletingId(id)
    await deleteBundle(id)
    setDeletingId(null)
  }

  const toggleActive = async (bundle: Bundle) => {
    await updateBundle(bundle.id, { active: !bundle.active })
  }

  // Group menu items by category for the picker
  const itemsByCategory: Record<string, MenuItem[]> = {}
  menuItems.forEach(item => {
    if (!itemsByCategory[item.category]) itemsByCategory[item.category] = []
    itemsByCategory[item.category].push(item)
  })

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", maxWidth: "calc(100% - 220px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "24px", color: "#111", margin: "0 0 4px", letterSpacing: "-0.5px" }}>🧩 Bundle Manager</h1>
            <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>Create dynamic bundle offers — customers pick from your allowed items</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true) }} style={{
            backgroundColor: "#f97316", color: "#fff", border: "none",
            borderRadius: "12px", padding: "12px 20px", fontWeight: 700,
            fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
          }}>
            + New Bundle
          </button>
        </div>

        {/* Bundle Form Modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px", overflowY: "auto" }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", width: "100%", maxWidth: "760px", padding: "32px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", position: "relative", marginBottom: "24px" }}>

              {/* Modal Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
                <h2 style={{ fontWeight: 800, fontSize: "20px", color: "#111", margin: 0 }}>
                  {editingBundle ? "Edit Bundle" : "Create New Bundle"}
                </h2>
                <button onClick={() => { setShowForm(false); resetForm() }} style={{ background: "none", border: "1px solid #f0f0f0", borderRadius: "8px", cursor: "pointer", fontSize: "16px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>

              {/* Basic Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Bundle Name *</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Date Night Special"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #f0f0f0", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#f97316"}
                    onBlur={e => e.currentTarget.style.borderColor = "#f0f0f0"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Discount %</label>
                  <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} min={1} max={50}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #f0f0f0", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#f97316"}
                    onBlur={e => e.currentTarget.style.borderColor = "#f0f0f0"}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this bundle offer..." rows={2}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #f0f0f0", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#f97316"}
                  onBlur={e => e.currentTarget.style.borderColor = "#f0f0f0"}
                />
              </div>

              {/* Active Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", padding: "14px", backgroundColor: "#fafafa", borderRadius: "12px" }}>
                <div onClick={() => setActive(p => !p)} style={{ width: "44px", height: "24px", borderRadius: "100px", backgroundColor: active ? "#f97316" : "#e5e5e5", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: "2px", left: active ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#111" }}>{active ? "Active — visible on Offers page" : "Inactive — hidden from customers"}</p>
                </div>
              </div>

              {/* Bundle Categories */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>Bundle Categories</label>
                  <button onClick={addCategory} style={{ fontSize: "12px", color: "#f97316", background: "none", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "8px", padding: "4px 12px", cursor: "pointer", fontWeight: 700 }}>+ Add Category</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {bundleCategories.map((cat, catIndex) => (
                    <div key={catIndex} style={{ border: "1.5px solid #f0f0f0", borderRadius: "14px", overflow: "hidden" }}>

                      {/* Category Header */}
                      <div style={{ padding: "14px 16px", backgroundColor: "#fafafa", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #f0f0f0" }}>
                        <select value={cat.emoji} onChange={e => updateCategoryEmoji(catIndex, e.target.value)}
                          style={{ padding: "4px 8px", borderRadius: "8px", border: "1px solid #f0f0f0", fontSize: "16px", cursor: "pointer" }}>
                          {EMOJIS.map(em => <option key={em} value={em}>{em}</option>)}
                        </select>
                        <input value={cat.label} onChange={e => updateCategoryLabel(catIndex, e.target.value)}
                          style={{ flex: 1, padding: "6px 10px", borderRadius: "8px", border: "1px solid #f0f0f0", fontSize: "14px", fontWeight: 700, outline: "none", fontFamily: "'DM Sans', sans-serif" }}
                          onFocus={e => e.currentTarget.style.borderColor = "#f97316"}
                          onBlur={e => e.currentTarget.style.borderColor = "#f0f0f0"}
                        />
                        <span style={{ fontSize: "12px", color: "#aaa" }}>{cat.items.length} item{cat.items.length !== 1 ? "s" : ""} allowed</span>
                        {bundleCategories.length > 1 && (
                          <button onClick={() => removeCategory(catIndex)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "16px", padding: "0" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                            onMouseLeave={e => e.currentTarget.style.color = "#ccc"}
                          >🗑</button>
                        )}
                      </div>

                      {/* Item Picker — grouped by menu category */}
                      <div style={{ padding: "14px 16px", maxHeight: "280px", overflowY: "auto" }}>
                        {Object.keys(itemsByCategory).length === 0 ? (
                          <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>No menu items found. Add items in Menu Items first.</p>
                        ) : (
                          Object.entries(itemsByCategory).map(([catName, catItems]) => (
                            <div key={catName} style={{ marginBottom: "14px" }}>
                              <p style={{ fontSize: "11px", fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>{catName}</p>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                                {catItems.map(menuItem => {
                                  const isSelected = cat.items.some(i => i.menuItemId === menuItem.id)
                                  return (
                                    <div key={menuItem.id} onClick={() => toggleItemInCategory(catIndex, menuItem)}
                                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "10px", border: `1.5px solid ${isSelected ? "#f97316" : "#f0f0f0"}`, backgroundColor: isSelected ? "rgba(249,115,22,0.05)" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
                                      <img src={menuItem.image} alt={menuItem.name} style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                                      <div style={{ minWidth: 0, flex: 1 }}>
                                        <p style={{ fontWeight: 700, fontSize: "12px", color: "#111", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{menuItem.name}</p>
                                        <p style={{ fontSize: "12px", color: "#f97316", fontWeight: 700, margin: 0 }}>${menuItem.price.toFixed(2)}</p>
                                      </div>
                                      {isSelected && <span style={{ color: "#f97316", fontSize: "14px", flexShrink: 0 }}>✓</span>}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={() => { setShowForm(false); resetForm() }} style={{ padding: "12px 20px", borderRadius: "12px", border: "1px solid #f0f0f0", background: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", color: "#777", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: saving ? "#ccc" : "#f97316", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: saving ? "none" : "0 4px 14px rgba(249,115,22,0.3)" }}>
                  {saving ? "Saving..." : editingBundle ? "Save Changes" : "Create Bundle"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bundle List */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: "180px", borderRadius: "16px", backgroundColor: "#f0f0f0", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : bundles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#ccc" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧩</div>
            <h3 style={{ fontWeight: 700, fontSize: "18px", color: "#aaa", marginBottom: "8px" }}>No bundles yet</h3>
            <p style={{ fontSize: "14px" }}>Create your first bundle offer above.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
            {bundles.map(bundle => (
              <div key={bundle.id} style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>

                {/* Card Header */}
                <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <h3 style={{ fontWeight: 800, fontSize: "16px", color: "#111", margin: 0 }}>{bundle.name}</h3>
                        <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "100px", backgroundColor: bundle.active ? "rgba(34,197,94,0.1)" : "rgba(0,0,0,0.05)", color: bundle.active ? "#16a34a" : "#aaa" }}>
                          {bundle.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#888", margin: "0 0 10px", lineHeight: 1.4 }}>{bundle.description || "No description"}</p>
                      <span style={{ display: "inline-block", backgroundColor: "rgba(249,115,22,0.08)", color: "#f97316", fontSize: "13px", fontWeight: 800, padding: "4px 12px", borderRadius: "100px", border: "1px solid rgba(249,115,22,0.2)" }}>
                        {bundle.discount}% off
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categories preview */}
                <div style={{ padding: "14px 20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {bundle.categories.map(cat => (
                    <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#fafafa", borderRadius: "8px", padding: "4px 10px", border: "1px solid #f0f0f0" }}>
                      <span style={{ fontSize: "13px" }}>{cat.emoji}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#555" }}>{cat.label}</span>
                      <span style={{ fontSize: "11px", color: "#bbb" }}>({cat.items.length})</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ padding: "12px 20px 16px", display: "flex", gap: "8px" }}>
                  <button onClick={() => openEdit(bundle)} style={{ flex: 1, padding: "8px", borderRadius: "10px", border: "1px solid #f0f0f0", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#555", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.color = "#555" }}
                  >✏️ Edit</button>
                  <button onClick={() => toggleActive(bundle)} style={{ flex: 1, padding: "8px", borderRadius: "10px", border: `1px solid ${bundle.active ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`, background: bundle.active ? "rgba(239,68,68,0.04)" : "rgba(34,197,94,0.04)", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: bundle.active ? "#ef4444" : "#16a34a", fontFamily: "'DM Sans', sans-serif" }}>
                    {bundle.active ? "⏸ Deactivate" : "▶ Activate"}
                  </button>
                  <button onClick={() => handleDelete(bundle.id)} disabled={deletingId === bundle.id} style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)", fontSize: "13px", cursor: "pointer", color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>
                    {deletingId === bundle.id ? "..." : "🗑"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </main>
    </div>
  )
}