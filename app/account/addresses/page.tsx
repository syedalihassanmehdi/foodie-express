"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserAuth } from "@/context/UserAuthContext"
import { db } from "@/lib/firebase"
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, where, serverTimestamp
} from "firebase/firestore"
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
    const unsub = onSnapshot(q, snap => {
      setAddresses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Address)))
      setAddressesLoading(false)
    })
    return unsub
  }, [user])

  const resetForm = () => {
    setForm({ label: "Home", address: "", city: "", notes: "" })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSave = async () => {
    if (!form.address.trim() || !form.city.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateDoc(doc(db, "addresses", editingId), { ...form })
      } else {
        await addDoc(collection(db, "addresses"), {
          ...form,
          userId: user!.uid,
          isDefault: addresses.length === 0,
          createdAt: serverTimestamp(),
        })
      }
      resetForm()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (addr: Address) => {
    setForm({ label: addr.label, address: addr.address, city: addr.city, notes: addr.notes })
    setEditingId(addr.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await deleteDoc(doc(db, "addresses", id))
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await Promise.all(
        addresses.map(a => updateDoc(doc(db, "addresses", a.id), { isDefault: a.id === id }))
      )
    } catch (e) {
      console.error(e)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", backgroundColor: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
    padding: "12px 14px", color: "#fff", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 700,
    color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px",
  }

  if (loading || !user) return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  )

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 1.25rem 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
          <Link href="/account" style={{ color: "#555", textDecoration: "none", fontSize: "13px", fontWeight: 600, transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}
          >← Account</Link>
          <span style={{ color: "#333" }}>/</span>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>Saved Addresses</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 4px" }}>
              Saved Addresses
            </h1>
            <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>
              {addresses.length} address{addresses.length !== 1 ? "es" : ""} saved
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              style={{
                backgroundColor: "#f97316", color: "#fff",
                border: "none", borderRadius: "999px",
                padding: "10px 22px", fontSize: "13px", fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 0 20px rgba(249,115,22,0.25)", transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ea6c0a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#f97316"}
            >
              + Add Address
            </button>
          )}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div style={{
            backgroundColor: "#111", border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: "20px", padding: "28px", marginBottom: "24px",
            animation: "fadeIn 0.3s ease",
          }}>
            <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 24px", letterSpacing: "-0.3px" }}>
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>

            {/* Label Selector */}
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Label</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Home", "Work", "Other"].map(l => (
                  <button key={l} onClick={() => setForm(f => ({ ...f, label: l }))}
                    style={{
                      padding: "8px 18px", borderRadius: "999px", fontSize: "13px", fontWeight: 700,
                      cursor: "pointer", border: "1px solid", fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.2s",
                      backgroundColor: form.label === l ? "#f97316" : "transparent",
                      borderColor: form.label === l ? "#f97316" : "rgba(255,255,255,0.1)",
                      color: form.label === l ? "#fff" : "#666",
                    }}
                  >
                    {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Street Address</label>
              <input
                type="text"
                placeholder="e.g. House 12, Street 5, Block A"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* City */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                placeholder="e.g. Lahore"
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Notes */}
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Delivery Notes <span style={{ color: "#333", fontWeight: 400 }}>(optional)</span></label>
              <input
                type="text"
                placeholder="e.g. Ring the bell twice"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={handleSave}
                disabled={saving || !form.address.trim() || !form.city.trim()}
                style={{
                  flex: 1, minWidth: "140px",
                  backgroundColor: saving || !form.address.trim() || !form.city.trim() ? "#333" : "#f97316",
                  color: "#fff", border: "none", borderRadius: "999px",
                  padding: "13px", fontSize: "14px", fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                  opacity: !form.address.trim() || !form.city.trim() ? 0.5 : 1,
                }}
                onMouseEnter={e => { if (!saving && form.address.trim() && form.city.trim()) e.currentTarget.style.backgroundColor = "#ea6c0a" }}
                onMouseLeave={e => { if (!saving && form.address.trim() && form.city.trim()) e.currentTarget.style.backgroundColor = "#f97316" }}
              >
                {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
              </button>
              <button
                onClick={resetForm}
                style={{
                  flex: 1, minWidth: "120px",
                  backgroundColor: "transparent", color: "#666",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px",
                  padding: "13px", fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#666" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Addresses List */}
        {addressesLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📍</div>
            <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>No addresses saved</h2>
            <p style={{ color: "#555", fontSize: "13px", marginBottom: "24px" }}>Add your delivery addresses for faster checkout.</p>
            <button
              onClick={() => setShowForm(true)}
              style={{ backgroundColor: "#f97316", color: "#fff", border: "none", borderRadius: "999px", padding: "12px 28px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              + Add First Address
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {addresses
              .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
              .map(addr => (
                <div key={addr.id} style={{
                  backgroundColor: "#111",
                  border: `1px solid ${addr.isDefault ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "16px", padding: "20px 24px",
                  transition: "border-color 0.2s",
                  animation: "fadeIn 0.3s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      {/* Label + Default badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                        <span style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>
                          {addr.label === "Home" ? "🏠" : addr.label === "Work" ? "💼" : "📍"} {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span style={{
                            backgroundColor: "rgba(249,115,22,0.1)", color: "#f97316",
                            border: "1px solid rgba(249,115,22,0.2)",
                            borderRadius: "999px", padding: "2px 10px",
                            fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px",
                          }}>
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p style={{ color: "#888", fontSize: "13px", margin: "0 0 4px", lineHeight: 1.5 }}>{addr.address}</p>
                      <p style={{ color: "#666", fontSize: "13px", margin: "0 0 4px" }}>{addr.city}</p>
                      {addr.notes && (
                        <p style={{ color: "#444", fontSize: "12px", margin: "6px 0 0", fontStyle: "italic" }}>
                          Note: {addr.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" }}>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          style={{
                            backgroundColor: "transparent", color: "#555",
                            border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px",
                            padding: "6px 14px", fontSize: "11px", fontWeight: 600,
                            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; e.currentTarget.style.color = "#f97316" }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#555" }}
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(addr)}
                        style={{
                          backgroundColor: "rgba(255,255,255,0.04)", color: "#aaa",
                          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px",
                          padding: "6px 14px", fontSize: "11px", fontWeight: 600,
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)" }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        disabled={deleting === addr.id}
                        style={{
                          backgroundColor: "transparent", color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.2)", borderRadius: "999px",
                          padding: "6px 14px", fontSize: "11px", fontWeight: 600,
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                          opacity: deleting === addr.id ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)" }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent" }}
                      >
                        {deleting === addr.id ? "..." : "Delete"}
                      </button>
                    </div>
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