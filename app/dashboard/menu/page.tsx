"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { subscribeToMenu, subscribeToCategories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, updateCategory, deleteCategory, MenuItem, Category } from "@/lib/firestore"

const EMPTY_ITEM: Omit<MenuItem, "id"> = {
  name: "", desc: "", price: 0, category: "",
  image: "", available: true, veg: false, rating: 4.5, reviews: 0,
}
const EMPTY_CAT: Omit<Category, "id"> = { slug: "", name: "", desc: "", image: "" }

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [rawCategories, setRawCategories] = useState<Category[]>([])
  const [tab, setTab] = useState<"items" | "categories">("items")
  const [filterCat, setFilterCat] = useState("All")
  const [itemForm, setItemForm] = useState(EMPTY_ITEM)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [showItemForm, setShowItemForm] = useState(false)
  const [catForm, setCatForm] = useState(EMPTY_CAT)
  const [editCatId, setEditCatId] = useState<string | null>(null)
  const [showCatForm, setShowCatForm] = useState(false)

  useEffect(() => {
    const u1 = subscribeToMenu(setItems)
    const u2 = subscribeToCategories(setRawCategories)
    return () => { u1(); u2() }
  }, [])

  const categories = [...new Map(rawCategories.map(c => [c.slug, c])).values()]
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

  const catNames = ["All", ...categories.map(c => c.name)]
  const filteredItems = filterCat === "All" ? uniqueItems
    : uniqueItems.filter(i => { const cat = categories.find(c => c.name === filterCat); return cat ? i.category === cat.slug : true })

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />
      <style>{`
        * { box-sizing: border-box; }
        .dash-main { margin-left: 220px; flex: 1; padding: 32px; max-width: calc(100% - 220px); }
        .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
        .cats-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .modal-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .item-actions { display: flex; gap: 6px; }
        @media (max-width: 768px) {
          .dash-main { margin-left: 0 !important; max-width: 100% !important; padding: 72px 16px 32px !important; }
          .items-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .cats-grid  { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 520px) {
          .items-grid { grid-template-columns: 1fr; }
          .cats-grid  { grid-template-columns: 1fr; }
          .modal-2col { grid-template-columns: 1fr; }
          .item-actions button { padding: 5px 6px !important; font-size: 11px !important; }
        }
      `}</style>

      <main className="dash-main">
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111", margin: 0 }}>Menu Management</h1>
            <p style={{ fontSize: "14px", color: "#999", marginTop: "4px" }}>{uniqueItems.length} items across {categories.length} categories</p>
          </div>
          <button onClick={() => { if (tab === "items") { setItemForm(EMPTY_ITEM); setEditItemId(null); setShowItemForm(true) } else { setCatForm(EMPTY_CAT); setEditCatId(null); setShowCatForm(true) } }}
            style={{ padding: "10px 20px", backgroundColor: "#f97316", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
            + {tab === "items" ? "Add Item" : "Add Category"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "20px", backgroundColor: "#f5f5f5", padding: "4px", borderRadius: "12px", width: "fit-content" }}>
          {(["items", "categories"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer", textTransform: "capitalize", backgroundColor: tab === t ? "#fff" : "transparent", color: tab === t ? "#111" : "#888", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>{t}</button>
          ))}
        </div>

        {/* ITEMS TAB */}
        {tab === "items" && (
          <>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {catNames.map((c, i) => (
                <button key={i} onClick={() => setFilterCat(c)} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 600, border: "1px solid", borderColor: filterCat === c ? "#f97316" : "#e5e5e5", backgroundColor: filterCat === c ? "#f97316" : "#fff", color: filterCat === c ? "#fff" : "#666", cursor: "pointer" }}>{c}</button>
              ))}
            </div>
            <div className="items-grid">
              {filteredItems.map((item, i) => (
                <div key={`${item.id}-${i}`} style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
                  {item.image
                    ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "130px", objectFit: "cover" }} />
                    : <div style={{ height: "130px", backgroundColor: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>🍽️</div>
                  }
                  <div style={{ padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px", gap: "4px" }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#111", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                      <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
                        <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 5px", borderRadius: "20px", backgroundColor: item.veg ? "#dcfce7" : "#fee2e2", color: item.veg ? "#16a34a" : "#dc2626" }}>{item.veg ? "VEG" : "NON"}</span>
                        <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 5px", borderRadius: "20px", backgroundColor: item.available ? "#dbeafe" : "#f3f4f6", color: item.available ? "#2563eb" : "#9ca3af" }}>{item.available ? "ON" : "OFF"}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "2px" }}>{item.category}</div>
                    <div style={{ fontSize: "11px", color: "#f97316", marginBottom: "6px", fontWeight: 600 }}>★ {item.rating ?? 4.5} ({item.reviews ?? 0})</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 800, fontSize: "15px", color: "#f97316" }}>${item.price}</div>
                      <div className="item-actions">
                        <button onClick={() => updateMenuItem(item.id, { available: !item.available })} style={{ padding: "5px 8px", borderRadius: "7px", fontSize: "11px", fontWeight: 600, border: "1px solid #e5e5e5", backgroundColor: "#fff", cursor: "pointer", color: "#555" }}>Toggle</button>
                        <button onClick={() => handleEditItem(item)} style={{ padding: "5px 8px", borderRadius: "7px", fontSize: "11px", fontWeight: 600, border: "1px solid #dbeafe", backgroundColor: "#eff6ff", cursor: "pointer", color: "#2563eb" }}>Edit</button>
                        <button onClick={() => deleteMenuItem(item.id)} style={{ padding: "5px 8px", borderRadius: "7px", fontSize: "11px", fontWeight: 600, border: "1px solid #fee2e2", backgroundColor: "#fff5f5", cursor: "pointer", color: "#ef4444" }}>Del</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px", color: "#ccc" }}>No items found.</div>}
            </div>
          </>
        )}

        {/* CATEGORIES TAB */}
        {tab === "categories" && (
          <div className="cats-grid">
            {categories.map((cat, i) => (
              <div key={`${cat.slug}-${i}`} style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
                {cat.image
                  ? <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "110px", objectFit: "cover" }} />
                  : <div style={{ height: "110px", backgroundColor: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>📂</div>
                }
                <div style={{ padding: "14px" }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "#111", marginBottom: "3px" }}>{cat.name}</div>
                  <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "4px" }}>/{cat.slug}</div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>{cat.desc?.slice(0, 50)}…</div>
                  <div style={{ fontSize: "11px", color: "#999", marginBottom: "10px" }}>{uniqueItems.filter(i => i.category === cat.slug).length} items</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleEditCat(cat)} style={{ flex: 1, padding: "7px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #dbeafe", backgroundColor: "#eff6ff", cursor: "pointer", color: "#2563eb" }}>Edit</button>
                    <button onClick={() => deleteCategory(cat.id)} style={{ flex: 1, padding: "7px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #fee2e2", backgroundColor: "#fff5f5", cursor: "pointer", color: "#ef4444" }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {categories.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px", color: "#ccc" }}>No categories yet.</div>}
          </div>
        )}

        {/* ITEM MODAL */}
        {showItemForm && (
          <div onClick={() => setShowItemForm(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "24px", width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111", marginBottom: "18px" }}>{editItemId ? "Edit Item" : "Add New Item"}</h3>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Item Name *</label>
                <input value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Image URL</label>
                <input value={itemForm.image} onChange={e => setItemForm({ ...itemForm, image: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", boxSizing: "border-box" }} />
                {itemForm.image && <img src={itemForm.image} alt="preview" style={{ width: "100%", height: "110px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }} />}
              </div>
              <div className="modal-2col">
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Price *</label>
                  <input type="number" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: Number(e.target.value) })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Category</label>
                  <select value={itemForm.category} onChange={e => setItemForm({ ...itemForm, category: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px" }}>
                    <option value="">Select...</option>
                    {categories.map((c, i) => <option key={i} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-2col">
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Rating (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={itemForm.rating ?? 4.5} onChange={e => setItemForm({ ...itemForm, rating: Number(e.target.value) })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Reviews Count</label>
                  <input type="number" min="0" value={itemForm.reviews ?? 0} onChange={e => setItemForm({ ...itemForm, reviews: Number(e.target.value) })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>Description</label>
                <textarea value={itemForm.desc} onChange={e => setItemForm({ ...itemForm, desc: e.target.value })} rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#555", cursor: "pointer" }}>
                  <input type="checkbox" checked={itemForm.available} onChange={e => setItemForm({ ...itemForm, available: e.target.checked })} />Available
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#555", cursor: "pointer" }}>
                  <input type="checkbox" checked={itemForm.veg} onChange={e => setItemForm({ ...itemForm, veg: e.target.checked })} />Vegetarian
                </label>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setShowItemForm(false)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #e5e5e5", backgroundColor: "#fff", fontWeight: 600, fontSize: "14px", cursor: "pointer", color: "#555" }}>Cancel</button>
                <button onClick={handleSaveItem} style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#f97316", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>{editItemId ? "Save Changes" : "Add Item"}</button>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY MODAL */}
        {showCatForm && (
          <div onClick={() => setShowCatForm(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "24px", width: "100%", maxWidth: "440px", maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111", marginBottom: "18px" }}>{editCatId ? "Edit Category" : "Add Category"}</h3>
              {[{ label: "Category Name *", key: "name" }, { label: "Slug * (e.g. pizzas)", key: "slug" }, { label: "Image URL", key: "image" }, { label: "Description", key: "desc" }].map(({ label, key }) => (
                <div key={key} style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>{label}</label>
                  <input value={(catForm as any)[key]} onChange={e => setCatForm({ ...catForm, [key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e5e5", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button onClick={() => setShowCatForm(false)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #e5e5e5", backgroundColor: "#fff", fontWeight: 600, fontSize: "14px", cursor: "pointer", color: "#555" }}>Cancel</button>
                <button onClick={handleSaveCat} style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#f97316", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>{editCatId ? "Save Changes" : "Add Category"}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}