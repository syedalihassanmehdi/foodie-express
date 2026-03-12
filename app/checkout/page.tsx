"use client"
import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { useUserAuth } from "@/context/UserAuthContext"
import { addOrder, subscribeToOffers, subscribeToAddresses, addAddress, Offer, Address } from "@/lib/firestore"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary"

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, bundleDiscount } = useCart()
  const { user } = useUserAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [notes, setNotes] = useState("")
  const [saveAddress, setSaveAddress] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [promoInput, setPromoInput] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null)
  const [promoError, setPromoError] = useState("")
  const [offers, setOffers] = useState<Offer[]>([])
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [addressMode, setAddressMode] = useState<"saved" | "new">("new")
  const [addressesLoaded, setAddressesLoaded] = useState(false)

  useEffect(() => { return subscribeToOffers(setOffers) }, [])

  useEffect(() => {
    if (!user) { setAddressesLoaded(true); return }
    return subscribeToAddresses(user.uid, (addrs) => {
      setSavedAddresses(addrs)
      setAddressesLoaded(true)
      if (addrs.length > 0) {
        setAddressMode("saved")
        const def = addrs.find(a => a.isDefault) ?? addrs[0]
        setSelectedAddressId(def.id)
        setAddress(def.address)
        setCity(def.city ?? "")
        
        setName(def.name ?? user?.displayName ?? "")
        if (def.phone) setPhone(def.phone)
      }
    })
  }, [user])

  useEffect(() => {
    if (user?.displayName && !name) setName(user.displayName)
  }, [user])

  const selectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id)
    setAddress(addr.address)
    setCity(addr.city ?? "")
    
    setName(addr.name ?? user?.displayName ?? "")
    if (addr.phone) setPhone(addr.phone)
  }

  const applyPromo = () => {
    setPromoError("")
    const code = promoInput.trim().toUpperCase()
    const offer = offers.find(o => o.code.toUpperCase() === code && o.active)
    if (!offer) { setPromoError("Invalid or inactive promo code."); return }
    if (offer.expiresAt && new Date(offer.expiresAt) < new Date()) { setPromoError("This code has expired."); return }
    setPromoCode(code)
    setAppliedOffer(offer)
    if (offer.type === "percent") setDiscount(Math.round(cartTotal * offer.value / 100))
    else if (offer.type === "flat") setDiscount(offer.value)
    else if (offer.type === "free_delivery") setDiscount(0)
    else if (offer.type === "bogo") setDiscount(Math.round(cartTotal * 0.5))
  }

  const deliveryFee = appliedOffer?.type === "free_delivery" ? 0 : 2.99
  const tax = Math.round((cartTotal - discount) * 0.08 * 100) / 100
  const total = Math.max(0, cartTotal - discount + deliveryFee + tax - bundleDiscount)

  const handlePlaceOrder = async () => {
    if (!name.trim()) return alert("Please enter your full name")
    if (!phone.trim()) return alert("Please enter your phone number")
    if (!address.trim()) return alert("Please enter a delivery address")
    if (cart.length === 0) return alert("Your cart is empty")
    setPlacing(true)
    try {
      if (saveAddress && user) {
        try {
          await addAddress({
            userId: user.uid,
            label: "Home" as const,
            address: address.trim(),
            city: city.trim(),
            notes: notes.trim(),
            isDefault: savedAddresses.length === 0,
          })
        } catch (e) {
          console.warn("Could not save address:", e)
        }
      }
  
      await addOrder({
        customerName: name.trim() || user?.displayName || "Guest",
        customerPhone: phone.trim(),
        customerAddress: city.trim() ? `${address.trim()}, ${city.trim()}` : address.trim(),
        notes: notes.trim(),
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total,
        status: "pending",
        promoCode: promoCode || undefined,
        discount,
        userId: user?.uid ?? "guest",
      })
      clearCart()
      setPlaced(true)
    } catch (e) {
      console.error("Order failed:", e)
      alert("Error placing order. Try again.")
    }
    setPlacing(false)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#1a1a1a",
    color: "#fff", fontSize: "14px", outline: "none",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
    transition: "border-color 0.2s",
  }
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 700,
    color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px",
  }

  const SaveCheckbox = () => (
    <div
      onClick={() => setSaveAddress(p => !p)}
      style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "12px 14px", borderRadius: "10px", backgroundColor: saveAddress ? "rgba(249,115,22,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${saveAddress ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.2s", userSelect: "none" as const }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "5px", border: `2px solid ${saveAddress ? "#f97316" : "rgba(255,255,255,0.2)"}`, backgroundColor: saveAddress ? "#f97316" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
        {saveAddress && <span style={{ color: "#fff", fontSize: "11px", fontWeight: 800 }}>✓</span>}
      </div>
      <span style={{ color: "#888", fontSize: "13px", fontWeight: 600 }}>Save this address to my account for next time</span>
    </div>
  )

  if (placed) return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎉</div>
        <h2 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, marginBottom: "12px" }}>Order Placed!</h2>
        <p style={{ color: "#666", fontSize: "16px", marginBottom: "32px" }}>We're preparing your food. Estimated delivery: 30–45 min.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          {user ? (
            <button onClick={() => router.push("/account/orders")} style={{ padding: "14px 28px", borderRadius: "14px", backgroundColor: "#f97316", color: "#fff", border: "none", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
              Track Order →
            </button>
          ) : (
            <button onClick={() => router.push("/account/signup")} style={{ padding: "14px 28px", borderRadius: "14px", backgroundColor: "#f97316", color: "#fff", border: "none", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
              Create Account →
            </button>
          )}
          <button onClick={() => router.push("/menu")} style={{ padding: "14px 28px", borderRadius: "14px", backgroundColor: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
            Back to Menu
          </button>
        </div>
      </div>
    </main>
  )

  // Show spinner while loading addresses for logged in users
  if (user && !addressesLoaded) return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  )

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", padding: "32px 16px 64px" }}>
      
      <style>{`
        * { box-sizing: border-box; }
        .co-wrap { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
        .addr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; margin-bottom: 16px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .co-card { background: #111; border-radius: 16px; border: 1px solid rgba(255,255,255,0.07); padding: 24px; }
        input:focus, textarea:focus { border-color: rgba(249,115,22,0.5) !important; }
        @media (max-width: 860px) { .co-wrap { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .addr-grid { grid-template-columns: 1fr 1fr; } .two-col { grid-template-columns: 1fr; } }
        @media (max-width: 340px) { .addr-grid { grid-template-columns: 1fr; } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
          
      <div style={{ maxWidth: "1000px", margin: "0 auto 32px" }}>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, margin: "0 0 4px" }}>Checkout</h1>
        <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
      </div>

      {/* Soft guest banner */}
      {!user && (
        <div style={{ maxWidth: "1000px", margin: "0 auto 20px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>
            💡 Have an account?{" "}
            <a href="/account/login" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
            {" "}to use saved addresses — or just order below.
          </p>
          <a href="/account/signup" style={{ fontSize: "12px", color: "#444", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}>
            Create account →
          </a>
        </div>
      )}

      <div className="co-wrap">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* ── LOGGED IN WITH SAVED ADDRESSES ── */}
          {user && savedAddresses.length > 0 && (
            <div className="co-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 700, margin: 0 }}>📍 Saved Addresses</h3>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => { setAddressMode("saved"); const def = savedAddresses.find(a => a.isDefault) ?? savedAddresses[0]; selectSavedAddress(def); setSelectedAddressId(def.id) }}
                    style={{ padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", backgroundColor: addressMode === "saved" ? "#f97316" : "rgba(255,255,255,0.07)", color: addressMode === "saved" ? "#fff" : "#888" }}>
                    Saved
                  </button>
                  <button onClick={() => { setAddressMode("new"); setSelectedAddressId(null); setAddress(""); setCity("") }}
                    style={{ padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", backgroundColor: addressMode === "new" ? "#f97316" : "rgba(255,255,255,0.07)", color: addressMode === "new" ? "#fff" : "#888" }}>
                    + New
                  </button>
                </div>
              </div>

              {/* Saved address cards */}
              {addressMode === "saved" && (
                <>
                  <div className="addr-grid">
                    {savedAddresses.map(addr => {
                      const isSelected = selectedAddressId === addr.id
                      return (
                        <div key={addr.id} onClick={() => selectSavedAddress(addr)}
                          style={{ padding: "12px", borderRadius: "12px", border: `1.5px solid ${isSelected ? "#f97316" : "rgba(255,255,255,0.08)"}`, backgroundColor: isSelected ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.15s" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                              {addr.label === "Home" ? "🏠" : addr.label === "Work" ? "💼" : "📍"} {addr.label}
                            </span>
                            {isSelected && <span style={{ fontSize: "12px", color: "#f97316", fontWeight: 700 }}>✓</span>}
                          </div>
                          <p style={{ fontSize: "11px", color: "#666", margin: "0 0 2px", lineHeight: 1.4 }}>{addr.address}</p>
                          {addr.city && <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>📍 {addr.city}</p>}
                          {addr.isDefault && <span style={{ fontSize: "10px", color: "#f97316", fontWeight: 700, marginTop: "4px", display: "block" }}>Default</span>}
                        </div>
                      )
                    })}
                  </div>

                  {/* Name + Phone always visible */}
                  <div className="two-col">
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* New address form */}
              {addressMode === "new" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className="two-col">
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Street Address *</label>
                    <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="House 12, Street 5, Block A" rows={2}
                      style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Lahore" style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                  </div>
                  <SaveCheckbox />
                </div>
              )}
            </div>
          )}

          {/* ── GUEST OR NO SAVED ADDRESSES ── */}
          {(!user || savedAddresses.length === 0) && (
            <div className="co-card">
              <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 700, margin: "0 0 18px" }}>🚚 Delivery Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="two-col">
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Street Address *</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="House 12, Street 5, Block A" rows={2}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Lahore" style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Order Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, special requests..." rows={2}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>

                {/* Save checkbox — logged in users only */}
                {user && <SaveCheckbox />}

                {/* Guest nudge — soft, not a blocker */}
                {!user && (
                  <div style={{ padding: "12px 14px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "16px" }}>💾</span>
                    <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>
                      Want to save this address?{" "}
                      <a href="/account/signup" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Create a free account</a>
                      {" "}— takes 30 seconds.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order notes — saved address mode */}
          {user && savedAddresses.length > 0 && addressMode === "saved" && (
            <div className="co-card">
              <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 700, margin: "0 0 14px" }}>📝 Order Notes</h3>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, special requests..." rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
          )}

          {/* ── PROMO CODE ── */}
          <div className="co-card">
            <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 700, margin: "0 0 16px" }}>🏷️ Promo Code</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())} placeholder="Enter code..."
                style={{ ...inputStyle, flex: 1, minWidth: "140px", letterSpacing: "1px" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <button onClick={applyPromo} style={{ padding: "11px 20px", borderRadius: "10px", backgroundColor: "#f97316", color: "#fff", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap" }}>
                Apply
              </button>
            </div>
            {promoError && <p style={{ color: "#ef4444", fontSize: "12px", margin: "8px 0 0" }}>{promoError}</p>}
            {appliedOffer && <p style={{ color: "#10b981", fontSize: "12px", margin: "8px 0 0", fontWeight: 600 }}>✓ "{appliedOffer.code}" applied — {appliedOffer.title}</p>}
            {offers.filter(o => o.active && (!o.expiresAt || new Date(o.expiresAt) >= new Date())).length > 0 && (
              <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {offers.filter(o => o.active && (!o.expiresAt || new Date(o.expiresAt) >= new Date())).map(o => (
                  <button key={o.id} onClick={() => { setPromoInput(o.code); setPromoError("") }}
                    style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, border: "1px solid rgba(249,115,22,0.3)", backgroundColor: "rgba(249,115,22,0.06)", color: "#f97316", cursor: "pointer", letterSpacing: "0.5px" }}>
                    {o.code}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <CheckoutSummary
          items={cart.map(i => ({ id: i.id, name: i.name, image: i.image, price: i.price, qty: i.qty }))}
          discount={discount}
          appliedOffer={appliedOffer}
          deliveryFee={deliveryFee}
          tax={tax}
          total={total}
          onPlaceOrder={handlePlaceOrder}
          loading={placing}
        />
      </div>
    </main>
  )
}