"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserAuth } from "@/context/UserAuthContext"
import { db } from "@/lib/firebase"
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, where, serverTimestamp } from "firebase/firestore"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

type Address = {
  id: string
  label: string
  address: string
  city: string
  notes: string
  isDefault: boolean
}

// ── Icons ──────────────────────────────────────────────────────────────────
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const WorkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const NoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const CityIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const labelIcons: Record<string, React.ReactNode> = {
  Home: <HomeIcon />,
  Work: <WorkIcon />,
  Other: <PinIcon />,
}

export default function AddressesPage() {
  const { user, loading } = useUserAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ label: "Home", address: "", city: "", notes: "" })

  useEffect(() => {
    if (!loading && !user) router.push("/account/login")
  }, [user, loading])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "addresses"), where("userId", "==", user.uid))
    return onSnapshot(q, snap => {
      setAddresses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Address)))
      setAddressesLoading(false)
    })
  }, [user])

  const resetForm = () => {
    setForm({ label: "Home", address: "", city: "", notes: "" })
    setEditingId(null); setShowForm(false)
  }

  const handleSave = async () => {
    if (!form.address.trim() || !form.city.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateDoc(doc(db, "addresses", editingId), { ...form })
      } else {
        await addDoc(collection(db, "addresses"), { ...form, userId: user!.uid, isDefault: addresses.length === 0, createdAt: serverTimestamp() })
      }
      resetForm()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleEdit = (addr: Address) => {
    setForm({ label: addr.label, address: addr.address, city: addr.city, notes: addr.notes })
    setEditingId(addr.id); setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try { await deleteDoc(doc(db, "addresses", id)) }
    catch (e) { console.error(e) }
    finally { setDeleting(null) }
  }

  const handleSetDefault = async (id: string) => {
    try { await Promise.all(addresses.map(a => updateDoc(doc(db, "addresses", a.id), { isDefault: a.id === id }))) }
    catch (e) { console.error(e) }
  }

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "12px 14px 12px 40px",
    borderRadius: "12px", border: "2px solid #e8e8e8",
    fontSize: "14px", outline: "none",
    fontFamily: "'DM Sans', sans-serif", color: "#111",
    boxSizing: "border-box", backgroundColor: "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: "3px 3px 0px #f0f0f0",
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 700,
    color: "#888", textTransform: "uppercase",
    letterSpacing: "0.8px", marginBottom: "8px",
    fontFamily: "'Syne', sans-serif",
  }

  const onFocusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#f97316"
    e.currentTarget.style.boxShadow = "3px 3px 0px #f97316"
  }
  const onFocusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#e8e8e8"
    e.currentTarget.style.boxShadow = "3px 3px 0px #f0f0f0"
  }

  if (loading || !user) return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: "32px", height: "32px", border: "3px solid #f0f0f0", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </main>
  )

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        .addr-input::placeholder { color: #ccc; }
        .addr-input:focus { border-color: #f97316 !important; box-shadow: 3px 3px 0px #f97316 !important; }
        .addr-card { transition: all 0.15s ease !important; }
        .addr-card:hover { transform: translateY(-1px) !important; }
      `}</style>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <Link href="/account" style={{ color: "#aaa", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
          >← Account</Link>
          <span style={{ color: "#ddd" }}>/</span>
          <span style={{ color: "#111", fontSize: "13px", fontWeight: 700 }}>Saved Addresses</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ color: "#111", fontSize: "28px", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 4px", fontFamily: "'Syne', sans-serif" }}>
              Saved Addresses
            </h1>
            <p style={{ color: "#aaa", fontSize: "13px", margin: 0 }}>
              {addresses.length} address{addresses.length !== 1 ? "es" : ""} saved
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              style={{
                backgroundColor: "#111", color: "#fff",
                border: "2px solid #111", borderRadius: "12px",
                padding: "10px 20px", fontSize: "13px", fontWeight: 800,
                cursor: "pointer", fontFamily: "'Syne', sans-serif",
                boxShadow: "4px 4px 0px #f97316",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "7px",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0px #f97316" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "4px 4px 0px #f97316" }}
            >
              <PlusIcon /> Add Address
            </button>
          )}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div style={{
            backgroundColor: "#fff", borderRadius: "20px",
            border: "2px solid #111", boxShadow: "5px 5px 0px #111",
            overflow: "hidden", marginBottom: "24px",
            animation: "fadeIn 0.25s ease",
          }}>
            <div style={{ backgroundColor: "#f97316", padding: "16px 24px", borderBottom: "2px solid #111" }}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: 0, fontFamily: "'Syne', sans-serif" }}>
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Label selector */}
              <div>
                <label style={labelStyle}>Label</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["Home", "Work", "Other"].map(l => (
                    <button key={l} onClick={() => setForm(f => ({ ...f, label: l }))}
                      style={{
                        padding: "8px 18px", borderRadius: "999px",
                        fontSize: "13px", fontWeight: 700,
                        cursor: "pointer", border: "2px solid",
                        fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                        backgroundColor: form.label === l ? "#111" : "#fff",
                        borderColor: form.label === l ? "#111" : "#e8e8e8",
                        color: form.label === l ? "#fff" : "#888",
                        boxShadow: form.label === l ? "3px 3px 0px #f97316" : "3px 3px 0px #f0f0f0",
                        display: "flex", alignItems: "center", gap: "6px",
                      }}
                    >
                      <span style={{ color: form.label === l ? "#f97316" : "#aaa" }}>{labelIcons[l]}</span>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label style={labelStyle}>Street Address *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "13px", top: "14px", pointerEvents: "none" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  <textarea
                    className="addr-input"
                    placeholder="e.g. House 12, Street 5, Block A"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    rows={2}
                    style={{ ...inputBase, resize: "vertical" }}
                    onFocus={onFocusIn} onBlur={onFocusOut}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label style={labelStyle}>City *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><CityIcon /></span>
                  <input className="addr-input" type="text" placeholder="e.g. Lahore" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Delivery Notes <span style={{ color: "#ccc", textTransform: "none", fontWeight: 400, letterSpacing: 0, fontSize: "11px" }}>(optional)</span></label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "13px", top: "14px", pointerEvents: "none" }}><NoteIcon /></span>
                  <textarea className="addr-input" placeholder="e.g. Ring the bell twice" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inputBase, resize: "vertical" }} onFocus={onFocusIn} onBlur={onFocusOut} />
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.address.trim() || !form.city.trim()}
                  style={{
                    flex: 1, minWidth: "140px", padding: "13px",
                    backgroundColor: (!form.address.trim() || !form.city.trim()) ? "#f5f5f5" : "#f97316",
                    color: (!form.address.trim() || !form.city.trim()) ? "#bbb" : "#fff",
                    border: `2px solid ${(!form.address.trim() || !form.city.trim()) ? "#e8e8e8" : "#111"}`,
                    borderRadius: "12px", fontSize: "14px", fontWeight: 800,
                    cursor: (saving || !form.address.trim() || !form.city.trim()) ? "not-allowed" : "pointer",
                    fontFamily: "'Syne', sans-serif",
                    boxShadow: (!form.address.trim() || !form.city.trim()) ? "none" : "4px 4px 0px #111",
                    transition: "all 0.15s",
                  }}
                >
                  {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
                </button>
                <button
                  onClick={resetForm}
                  style={{
                    flex: 1, minWidth: "120px", padding: "13px",
                    backgroundColor: "#fff", color: "#888",
                    border: "2px solid #e8e8e8", borderRadius: "12px",
                    fontSize: "14px", fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "3px 3px 0px #f0f0f0", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#aaa"; e.currentTarget.style.color = "#111" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#888" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Addresses List */}
        {addressesLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid #f0f0f0", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "64px", height: "64px", margin: "0 auto 20px", backgroundColor: "#fff3e8", border: "2px solid #111", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0px #111", color: "#f97316" }}>
              <PinIcon />
            </div>
            <h2 style={{ color: "#111", fontSize: "18px", fontWeight: 800, margin: "0 0 8px", fontFamily: "'Syne', sans-serif" }}>No addresses saved</h2>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "24px" }}>Add delivery addresses for faster checkout.</p>
            <button onClick={() => setShowForm(true)} style={{ backgroundColor: "#111", color: "#fff", border: "2px solid #111", borderRadius: "12px", padding: "12px 28px", fontSize: "14px", fontWeight: 800, cursor: "pointer", fontFamily: "'Syne', sans-serif", boxShadow: "4px 4px 0px #f97316", display: "inline-flex", alignItems: "center", gap: "7px" }}>
              <PlusIcon /> Add First Address
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[...addresses].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)).map(addr => (
              <div key={addr.id} className="addr-card" style={{
                backgroundColor: "#fff",
                border: `2px solid ${addr.isDefault ? "#f97316" : "#111"}`,
                borderRadius: "16px", overflow: "hidden",
                boxShadow: addr.isDefault ? "4px 4px 0px #f97316" : "4px 4px 0px #111",
                animation: "fadeIn 0.25s ease",
              }}>
                {/* Card header */}
                <div style={{
                  backgroundColor: addr.isDefault ? "#fff3e8" : "#fafaf8",
                  borderBottom: `2px solid ${addr.isDefault ? "#f97316" : "#e8e8e8"}`,
                  padding: "14px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "34px", height: "34px",
                      backgroundColor: addr.isDefault ? "#f97316" : "#fff",
                      border: `2px solid ${addr.isDefault ? "#c2540a" : "#111"}`,
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: addr.isDefault ? "#fff" : "#888", flexShrink: 0,
                    }}>
                      {labelIcons[addr.label] ?? <PinIcon />}
                    </div>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: "14px", color: "#111", fontFamily: "'Syne', sans-serif" }}>{addr.label}</span>
                      {addr.isDefault && (
                        <span style={{
                          marginLeft: "8px", backgroundColor: "#f97316", color: "#fff",
                          fontSize: "9px", fontWeight: 800, padding: "2px 8px",
                          borderRadius: "999px", letterSpacing: "0.5px",
                          fontFamily: "'Syne', sans-serif", verticalAlign: "middle",
                        }}>
                          DEFAULT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)} style={{
                        padding: "5px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700,
                        border: "2px solid #e8e8e8", backgroundColor: "#fff", color: "#888",
                        cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: "4px",
                        boxShadow: "2px 2px 0px #f0f0f0",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316"; e.currentTarget.style.boxShadow = "2px 2px 0px #f97316" }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#888"; e.currentTarget.style.boxShadow = "2px 2px 0px #f0f0f0" }}
                      >
                        <StarIcon /> Set Default
                      </button>
                    )}
                    <button onClick={() => handleEdit(addr)} style={{
                      padding: "5px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700,
                      border: "2px solid #e8e8e8", backgroundColor: "#fff", color: "#888",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: "4px",
                      boxShadow: "2px 2px 0px #f0f0f0",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#111"; e.currentTarget.style.boxShadow = "2px 2px 0px #111" }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#888"; e.currentTarget.style.boxShadow = "2px 2px 0px #f0f0f0" }}
                    >
                      <EditIcon /> Edit
                    </button>
                    <button onClick={() => handleDelete(addr.id)} disabled={deleting === addr.id} style={{
                      padding: "5px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700,
                      border: "2px solid #fca5a5", backgroundColor: "#fff", color: "#ef4444",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                      opacity: deleting === addr.id ? 0.5 : 1,
                      display: "flex", alignItems: "center", gap: "4px",
                      boxShadow: "2px 2px 0px #fca5a5",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fef2f2" }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff" }}
                    >
                      <TrashIcon /> {deleting === addr.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "14px 20px" }}>
                  <p style={{ color: "#888", fontSize: "13px", margin: "0 0 4px", lineHeight: 1.5 }}>{addr.address}</p>
                  <p style={{ color: "#aaa", fontSize: "13px", margin: 0 }}>{addr.city}</p>
                  {addr.notes && (
                    <p style={{ color: "#bbb", fontSize: "12px", margin: "8px 0 0", fontStyle: "italic", display: "flex", alignItems: "flex-start", gap: "5px" }}>
                      <span style={{ marginTop: "1px" }}><NoteIcon /></span>
                      {addr.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}