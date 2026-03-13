"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { subscribeToMenu, subscribeToCategories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, updateCategory, deleteCategory, MenuItem, Category } from "@/lib/firestore"

const EMPTY_ITEM: Omit<MenuItem, "id"> = { name: "", desc: "", price: 0, category: "", image: "", available: true, veg: false, rating: 4.5, reviews: 0 }
const EMPTY_CAT:  Omit<Category, "id"> = { slug: "", name: "", desc: "", image: "" }

const PlusIcon  = (): React.ReactElement => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
const EditIcon  = (): React.ReactElement => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const TrashIcon = (): React.ReactElement => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
const CloseIcon = (): React.ReactElement => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
const StarIcon  = (): React.ReactElement => <svg width="10" height="10" viewBox="0 0 24 24" fill="#f97316"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>

const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box", transition: "border-color 0.15s" }
const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "5px", fontFamily: "'Inter', sans-serif" }

export default function MenuPage() {
  const [items, setItems]                 = useState<MenuItem[]>([])
  const [rawCategories, setRawCategories] = useState<Category[]>([])
  const [tab, setTab]                     = useState<"items" | "categories">("items")
  const [filterCat, setFilterCat]         = useState("All")
  const [itemForm, setItemForm]           = useState(EMPTY_ITEM)
  const [editItemId, setEditItemId]       = useState<string | null>(null)
  const [showItemForm, setShowItemForm]   = useState(false)
  const [catForm, setCatForm]             = useState(EMPTY_CAT)
  const [editCatId, setEditCatId]         = useState<string | null>(null)
  const [showCatForm, setShowCatForm]     = useState(false)

  useEffect(() => {
    const u1 = subscribeToMenu(setItems)
    const u2 = subscribeToCategories(setRawCategories)
    return () => { u1(); u2() }
  }, [])

  const categories  = [...new Map(rawCategories.map(c => [c.slug, c])).values()]
  const uniqueItems = [...new Map(items.map(i => [i.id, i])).values()]

  const handleSaveItem = async () => {
    if (!itemForm.name || !itemForm.price) return
    if (editItemId) await updateMenuItem(editItemId, itemForm)
    else await addMenuItem(itemForm)
    setItemForm(EMPTY_ITEM); setEditItemId(null); setShowItemForm(false)
  }
  const handleEditItem = (item: MenuItem) => {
    setItemForm({ name: item.name, desc: item.desc, price: item.price, category: item.category, image: item.image, available: item.available, veg: item.veg, rating: item.rating ?? 4.5, reviews: item.reviews ?? 0 })
    setEditItemId(item.id); setShowItemForm(true)
  }
  const handleSaveCat = async () => {
    if (!catForm.name || !catForm.slug) return
    if (editCatId) await updateCategory(editCatId, catForm)
    else await addCategory(catForm)
    setCatForm(EMPTY_CAT); setEditCatId(null); setShowCatForm(false)
  }
  const handleEditCat = (cat: Category) => {
    setCatForm({ slug: cat.slug, name: cat.name, desc: cat.desc, image: cat.image })
    setEditCatId(cat.id); setShowCatForm(true)
  }

  const catNames     = ["All", ...categories.map(c => c.name)]
  const filteredItems = filterCat === "All" ? uniqueItems
    : uniqueItems.filter(i => { const cat = categories.find(c => c.name === filterCat); return cat ? i.category === cat.slug : true })

  const focusOrange = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = "#f97316" }
  const blurGray    = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = "#e5e7eb" }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .dash-main { margin-left: 216px; flex: 1; padding: 32px; max-width: calc(100% - 216px); }
        .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
        .cats-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
        .modal-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        @media (max-width: 768px) {
          .dash-main { margin-left: 0 !important; max-width: 100% !important; padding: 70px 16px 32px !important; }
          .items-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .cats-grid  { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 480px) {
          .items-grid { grid-template-columns: 1fr; }
          .cats-grid  { grid-template-columns: 1fr; }
          .modal-2col { grid-template-columns: 1fr; }
        }
        .item-card:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.07) !important; }
      `}</style>

      <main className="dash-main">
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111", margin: "0 0 3px", letterSpacing: "-0.3px" }}>Menu Management</h1>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>{uniqueItems.length} items across {categories.length} categories</p>
          </div>
          <button onClick={() => { if (tab === "items") { setItemForm(EMPTY_ITEM); setEditItemId(null); setShowItemForm(true) } else { setCatForm(EMPTY_CAT); setEditCatId(null); setShowCatForm(true) } }}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", backgroundColor: "#f97316", color: "#fff", border: "2px solid #111", borderRadius: "10px", fontWeight: 600, fontSize: "13px", cursor: "pointer", boxShadow: "3px 3px 0px #111", fontFamily: "'Inter', sans-serif" }}>
            <PlusIcon /> {tab === "items" ? "Add Item" : "Add Category"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "3px", marginBottom: "18px", backgroundColor: "#f3f4f6", padding: "3px", borderRadius: "10px", width: "fit-content" }}>
          {(["items", "categories"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "7px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer", textTransform: "capitalize" as const, backgroundColor: tab === t ? "#fff" : "transparent", color: tab === t ? "#111" : "#9ca3af", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none", fontFamily: "'Inter', sans-serif" }}>{t}</button>
          ))}
        </div>

        {/* Items Tab */}
        {tab === "items" && (
          <>
            <div style={{ display: "flex", gap: "7px", marginBottom: "16px", flexWrap: "wrap" }}>
              {catNames.map((c, i) => (
                <button key={i} onClick={() => setFilterCat(c)} style={{ padding: "5px 13px", borderRadius: "7px", fontSize: "12px", fontWeight: 500, border: "1.5px solid", borderColor: filterCat === c ? "#f97316" : "#e5e7eb", backgroundColor: filterCat === c ? "#fff7ed" : "#fff", color: filterCat === c ? "#f97316" : "#6b7280", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>{c}</button>
              ))}
            </div>
            <div className="items-grid">
              {filteredItems.map((item, i) => (
                <div key={`${item.id}-${i}`} className="item-card" style={{ backgroundColor: "#fff", borderRadius: "11px", border: "1.5px solid #f3f4f6", overflow: "hidden", transition: "box-shadow 0.2s" }}>
                  {item.image
                    ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                    : <div style={{ height: "120px", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🍽️</div>
                  }
                  <div style={{ padding: "11px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3px", gap: "4px" }}>
                      <div style={{ fontWeight: 600, fontSize: "13px", color: "#111", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>{item.name}</div>
                      <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
                        <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 5px", borderRadius: "5px", fontFamily: "'Inter', sans-serif", backgroundColor: item.veg ? "#dcfce7" : "#fee2e2", color: item.veg ? "#16a34a" : "#dc2626" }}>{item.veg ? "VEG" : "NON"}</span>
                        <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 5px", borderRadius: "5px", fontFamily: "'Inter', sans-serif", backgroundColor: item.available ? "#dbeafe" : "#f3f4f6", color: item.available ? "#2563eb" : "#9ca3af" }}>{item.available ? "ON" : "OFF"}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "3px", fontFamily: "'Inter', sans-serif" }}>{item.category}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", color: "#6b7280", marginBottom: "9px", fontFamily: "'Inter', sans-serif" }}>
                      <StarIcon /> {item.rating ?? 4.5} ({item.reviews ?? 0})
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#f97316", fontFamily: "'Inter', sans-serif" }}>${item.price}</div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => updateMenuItem(item.id, { available: !item.available })} style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, border: "1.5px solid #e5e7eb", backgroundColor: "#fff", cursor: "pointer", color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>Toggle</button>
                        <button onClick={() => handleEditItem(item)} style={{ padding: "4px 7px", borderRadius: "6px", border: "1.5px solid #dbeafe", backgroundColor: "#eff6ff", cursor: "pointer", color: "#2563eb", display: "flex", alignItems: "center" }}><EditIcon /></button>
                        <button onClick={() => deleteMenuItem(item.id)} style={{ padding: "4px 7px", borderRadius: "6px", border: "1.5px solid #fecaca", backgroundColor: "#fff5f5", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center" }}><TrashIcon /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px", color: "#9ca3af", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>No items found.</div>}
            </div>
          </>
        )}

        {/* Categories Tab */}
        {tab === "categories" && (
          <div className="cats-grid">
            {categories.map((cat, i) => (
              <div key={`${cat.slug}-${i}`} className="item-card" style={{ backgroundColor: "#fff", borderRadius: "11px", border: "1.5px solid #f3f4f6", overflow: "hidden", transition: "box-shadow 0.2s" }}>
                {cat.image
                  ? <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
                  : <div style={{ height: "100px", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>📂</div>
                }
                <div style={{ padding: "12px" }}>
                  <div style={{ fontWeight: 600, fontSize: "13px", color: "#111", marginBottom: "2px", fontFamily: "'Inter', sans-serif" }}>{cat.name}</div>
                  <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "3px", fontFamily: "'Inter', sans-serif" }}>/{cat.slug}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "3px", fontFamily: "'Inter', sans-serif" }}>{cat.desc?.slice(0, 50)}{cat.desc?.length > 50 ? "…" : ""}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "10px", fontFamily: "'Inter', sans-serif" }}>{uniqueItems.filter(i => i.category === cat.slug).length} items</div>
                  <div style={{ display: "flex", gap: "7px" }}>
                    <button onClick={() => handleEditCat(cat)} style={{ flex: 1, padding: "7px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "1.5px solid #dbeafe", backgroundColor: "#eff6ff", cursor: "pointer", color: "#2563eb", fontFamily: "'Inter', sans-serif" }}>Edit</button>
                    <button onClick={() => deleteCategory(cat.id)} style={{ flex: 1, padding: "7px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "1.5px solid #fecaca", backgroundColor: "#fff5f5", cursor: "pointer", color: "#ef4444", fontFamily: "'Inter', sans-serif" }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {categories.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px", color: "#9ca3af", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>No categories yet.</div>}
          </div>
        )}

        {/* Item Modal */}
        {showItemForm && (
          <div onClick={() => setShowItemForm(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "22px", width: "100%", maxWidth: "440px", maxHeight: "90vh", overflowY: "auto", border: "1.5px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: 0, fontFamily: "'Inter', sans-serif" }}>{editItemId ? "Edit Item" : "Add Item"}</h3>
                <button onClick={() => setShowItemForm(false)} style={{ background: "none", border: "1.5px solid #e5e7eb", borderRadius: "7px", cursor: "pointer", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}><CloseIcon /></button>
              </div>
              {[{ label: "Item Name *", key: "name", type: "text" }, { label: "Image URL", key: "image", type: "text" }].map(({ label, key, type }) => (
                <div key={key} style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={(itemForm as any)[key]} onChange={e => setItemForm({ ...itemForm, [key]: e.target.value })} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
                  {key === "image" && itemForm.image && <img src={itemForm.image} alt="preview" style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "7px", marginTop: "7px" }} />}
                </div>
              ))}
              <div className="modal-2col">
                <div>
                  <label style={labelStyle}>Price *</label>
                  <input type="number" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: Number(e.target.value) })} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={itemForm.category} onChange={e => setItemForm({ ...itemForm, category: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
                    <option value="">Select…</option>
                    {categories.map((c, i) => <option key={i} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-2col">
                <div>
                  <label style={labelStyle}>Rating</label>
                  <input type="number" min="0" max="5" step="0.1" value={itemForm.rating ?? 4.5} onChange={e => setItemForm({ ...itemForm, rating: Number(e.target.value) })} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
                </div>
                <div>
                  <label style={labelStyle}>Reviews</label>
                  <input type="number" min="0" value={itemForm.reviews ?? 0} onChange={e => setItemForm({ ...itemForm, reviews: Number(e.target.value) })} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={labelStyle}>Description</label>
                <textarea value={itemForm.desc} onChange={e => setItemForm({ ...itemForm, desc: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" as const }} onFocus={focusOrange} onBlur={blurGray} />
              </div>
              <div style={{ display: "flex", gap: "18px", marginBottom: "18px" }}>
                {[{ label: "Available", key: "available" }, { label: "Vegetarian", key: "veg" }].map(({ label, key }) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                    <input type="checkbox" checked={(itemForm as any)[key]} onChange={e => setItemForm({ ...itemForm, [key]: e.target.checked })} style={{ accentColor: "#f97316" }} />{label}
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", gap: "9px" }}>
                <button onClick={() => setShowItemForm(false)} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1.5px solid #e5e7eb", backgroundColor: "#fff", fontWeight: 500, fontSize: "13px", cursor: "pointer", color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                <button onClick={handleSaveItem} style={{ flex: 2, padding: "10px", borderRadius: "9px", border: "2px solid #111", backgroundColor: "#f97316", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer", boxShadow: "3px 3px 0px #111", fontFamily: "'Inter', sans-serif" }}>{editItemId ? "Save Changes" : "Add Item"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showCatForm && (
          <div onClick={() => setShowCatForm(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "22px", width: "100%", maxWidth: "400px", maxHeight: "90vh", overflowY: "auto", border: "1.5px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: 0, fontFamily: "'Inter', sans-serif" }}>{editCatId ? "Edit Category" : "Add Category"}</h3>
                <button onClick={() => setShowCatForm(false)} style={{ background: "none", border: "1.5px solid #e5e7eb", borderRadius: "7px", cursor: "pointer", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}><CloseIcon /></button>
              </div>
              {[{ label: "Category Name *", key: "name" }, { label: "Slug * (e.g. pizzas)", key: "slug" }, { label: "Image URL", key: "image" }, { label: "Description", key: "desc" }].map(({ label, key }) => (
                <div key={key} style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>{label}</label>
                  <input value={(catForm as any)[key]} onChange={e => setCatForm({ ...catForm, [key]: e.target.value })} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
                </div>
              ))}
              <div style={{ display: "flex", gap: "9px", marginTop: "6px" }}>
                <button onClick={() => setShowCatForm(false)} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1.5px solid #e5e7eb", backgroundColor: "#fff", fontWeight: 500, fontSize: "13px", cursor: "pointer", color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                <button onClick={handleSaveCat} style={{ flex: 2, padding: "10px", borderRadius: "9px", border: "2px solid #111", backgroundColor: "#f97316", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer", boxShadow: "3px 3px 0px #111", fontFamily: "'Inter', sans-serif" }}>{editCatId ? "Save Changes" : "Add Category"}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}