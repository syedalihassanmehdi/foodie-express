"use client"
import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { useUserAuth } from "@/context/UserAuthContext"
import { addOrder, subscribeToOffers, subscribeToAddresses, addAddress, updateOrderStatus, Offer, Address } from "@/lib/firestore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary"

// ── Icons ──────────────────────────────────────────────────────────────────
const ChevronIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.37 6.37l1.05-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
  </svg>
)
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const CityIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const NoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)
const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
)

// ── Guest Cancel Block ────────────────────────────────────────────────────────
function GuestCancelBlock({ orderId, placedAt }: { orderId: string; placedAt: number }) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - placedAt) / 1000)
    return Math.max(0, 120 - elapsed)
  })
  const [cancelling, setCancelling] = useState(false)
  const [cancelDone, setCancelDone] = useState(false)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - placedAt) / 1000)
      const left = Math.max(0, 120 - elapsed)
      setSecondsLeft(left)
      if (left <= 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [placedAt])

  const handleCancel = async () => {
    if (secondsLeft <= 0) return
    setCancelling(true)
    try {
      await updateOrderStatus(orderId, "cancelled")
      setCancelDone(true)
    } catch (e) {
      console.error(e)
      alert("Failed to cancel. Please try again.")
    } finally {
      setCancelling(false)
    }
  }

  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60
  const timerStr = `${m}:${s.toString().padStart(2, "0")}`
  const urgentColor = secondsLeft <= 30 ? "#ef4444" : secondsLeft <= 60 ? "#f59e0b" : "#22c55e"

  if (cancelDone) return (
    <div style={{
      backgroundColor: "#fef2f2", border: "2px solid #fca5a5",
      borderRadius: "16px", padding: "20px 24px", textAlign: "center",
      boxShadow: "3px 3px 0px #fca5a5",
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "8px" }}>
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <p style={{ color: "#ef4444", fontWeight: 800, fontSize: "15px", margin: "0 0 4px", fontFamily: "'Syne', sans-serif" }}>Order Cancelled</p>
      <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Your order has been cancelled successfully.</p>
    </div>
  )

  return (
    <div style={{
      backgroundColor: "#fff",
      border: "2px solid #111",
      borderRadius: "16px",
      padding: "20px 24px",
      boxShadow: "3px 3px 0px #111",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
          Changed your mind? Cancel within <strong style={{ color: "#f97316" }}>2 minutes</strong>.
        </p>
      </div>
      {secondsLeft > 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "7px",
            backgroundColor: `${urgentColor}12`,
            border: `2px solid ${urgentColor}40`,
            borderRadius: "999px", padding: "6px 14px",
          }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: urgentColor, animation: "pulse 1s infinite" }} />
            <span style={{ color: urgentColor, fontSize: "13px", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{timerStr}</span>
          </div>
          <button
            onClick={handleCancel} disabled={cancelling}
            style={{
              flex: 1, padding: "10px 20px", borderRadius: "999px",
              backgroundColor: "transparent", border: "2px solid #fca5a5",
              color: "#ef4444", fontWeight: 700, fontSize: "13px",
              cursor: cancelling ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s", opacity: cancelling ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!cancelling) e.currentTarget.style.backgroundColor = "#fef2f2" }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent" }}
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          backgroundColor: "#f5f5f5", border: "2px solid #e8e8e8",
          borderRadius: "999px", padding: "6px 14px", width: "fit-content",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ color: "#aaa", fontSize: "12px", fontWeight: 600 }}>Cancellation window closed</span>
        </div>
      )}
    </div>
  )
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "20px",
      border: "2px solid #111",
      boxShadow: "5px 5px 0px #111",
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div style={{
      backgroundColor: "#fafaf8",
      borderBottom: "2px solid #111",
      padding: "18px 24px",
      display: "flex", alignItems: "center", gap: "12px",
    }}>
      <div style={{
        width: "38px", height: "38px",
        backgroundColor: "#fff3e8",
        border: "2px solid #111",
        borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#f97316", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontWeight: 800, fontSize: "16px", color: "#111", margin: 0, letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif" }}>{title}</h3>
        {subtitle && <p style={{ color: "#aaa", fontSize: "12px", margin: 0, fontWeight: 500 }}>{subtitle}</p>}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
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
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)
  const [placedAt, setPlacedAt] = useState<number | null>(null)
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
  const [orderError, setOrderError] = useState("")

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
        setName(def.name ?? "")
        if (def.phone) setPhone(def.phone)
      }
    })
  }, [user])

  useEffect(() => {
    if (user?.displayName && !name) setName(user.displayName)
  }, [user, name])

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
  const total = Math.max(0, cartTotal - discount + deliveryFee + tax - (bundleDiscount ?? 0))

  const handlePlaceOrder = async () => {
    setOrderError("")
    const finalName = name.trim() || user?.displayName || ""
    const finalPhone = phone.trim()
    const finalAddress = address.trim()

    if (!finalName) return alert("Please enter your full name")
    if (!finalPhone) return alert("Please enter your phone number")
    if (!finalAddress) return alert("Please enter a delivery address")
    if (cart.length === 0) return alert("Your cart is empty")

    setPlacing(true)

    if (saveAddress && user && addressMode === "new") {
      try {
        await addAddress({
          userId: user.uid,
          label: "Home" as const,
          address: finalAddress,
          city: city.trim(),
          notes: notes.trim(),
          isDefault: savedAddresses.length === 0,
        })
      } catch (e) { console.warn("Address save failed:", e) }
    }

    try {
      const docRef = await addOrder({
        customerName: finalName,
        customerPhone: finalPhone,
        customerAddress: city.trim() ? `${finalAddress}, ${city.trim()}` : finalAddress,
        notes: notes.trim(),
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total,
        status: "pending" as const,
        ...(promoCode ? { promoCode } : {}),
        ...(discount > 0 ? { discount } : {}),
        userId: user?.uid ?? "guest",
      })
      clearCart()
      setPlacedOrderId(docRef.id)
      setPlacedAt(Date.now())
      setPlaced(true)
    } catch (e: any) {
      console.error("Order failed:", e)
      const msg = e?.code === "permission-denied"
        ? "Permission denied. Please make sure you are logged in and try again."
        : e?.message ? `Error: ${e.message}` : "Error placing order. Try again."
      setOrderError(msg)
      alert(msg)
    }

    setPlacing(false)
  }

  // ── Input style ──
  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    borderRadius: "12px",
    border: "2px solid #e8e8e8",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    color: "#111",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: "3px 3px 0px #f0f0f0",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "8px",
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

  const SaveCheckbox = () => (
    <div onClick={() => setSaveAddress(p => !p)} style={{
      display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
      padding: "12px 14px", borderRadius: "12px",
      backgroundColor: saveAddress ? "#fff3e8" : "#fafaf8",
      border: `2px solid ${saveAddress ? "#f97316" : "#e8e8e8"}`,
      boxShadow: saveAddress ? "3px 3px 0px #f97316" : "3px 3px 0px #f0f0f0",
      transition: "all 0.2s", userSelect: "none" as const,
    }}>
      <div style={{
        width: "18px", height: "18px", borderRadius: "6px", flexShrink: 0,
        border: `2px solid ${saveAddress ? "#f97316" : "#ddd"}`,
        backgroundColor: saveAddress ? "#f97316" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {saveAddress && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        )}
      </div>
      <span style={{ color: "#888", fontSize: "13px", fontWeight: 600 }}>Save this address for next time</span>
    </div>
  )

  // ── SUCCESS STATE ──────────────────────────────────────────────────────────
  if (placed) return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fafaf8", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "24px" }}>
        <div style={{ maxWidth: "460px", width: "100%", animation: "fadeUp 0.4s ease" }}>

          {/* Success card */}
          <Card style={{ marginBottom: "16px" }}>
            <div style={{ backgroundColor: "#f97316", padding: "32px 24px", textAlign: "center", borderBottom: "2px solid #111" }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "12px" }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h2 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif" }}>
                Order Placed!
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", margin: 0 }}>
                We're preparing your food — est. 30–45 min.
              </p>
            </div>
            <div style={{ padding: "24px" }}>
              {!user && placedOrderId && placedAt && (
                <div style={{ marginBottom: "20px" }}>
                  <GuestCancelBlock orderId={placedOrderId} placedAt={placedAt} />
                </div>
              )}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {user ? (
                  <button onClick={() => router.push("/account/orders")} style={{
                    flex: 1, padding: "13px 20px", borderRadius: "12px",
                    backgroundColor: "#111", color: "#fff",
                    border: "2px solid #111", fontWeight: 800, fontSize: "14px",
                    cursor: "pointer", fontFamily: "'Syne', sans-serif",
                    boxShadow: "4px 4px 0px #f97316",
                  }}>
                    Track Order →
                  </button>
                ) : (
                  <button onClick={() => router.push("/offers")} style={{
                    flex: 1, padding: "13px 20px", borderRadius: "12px",
                    backgroundColor: "#111", color: "#fff",
                    border: "2px solid #111", fontWeight: 800, fontSize: "14px",
                    cursor: "pointer", fontFamily: "'Syne', sans-serif",
                    boxShadow: "4px 4px 0px #f97316",
                  }}>
                    View Offers →
                  </button>
                )}
                <button onClick={() => router.push("/menu")} style={{
                  flex: 1, padding: "13px 20px", borderRadius: "12px",
                  backgroundColor: "#fff", color: "#111",
                  border: "2px solid #111", fontWeight: 700, fontSize: "14px",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "4px 4px 0px #111",
                }}>
                  Back to Menu
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )

  // ── LOADING STATE ─────────────────────────────────────────────────────────
  if (user && !addressesLoaded) return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Navbar />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: "32px", height: "32px", border: "3px solid #f0f0f0", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </main>
  )

  // ── MAIN CHECKOUT ─────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fafaf8", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; }

        .co-wrap {
          max-width: 1060px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
          align-items: start;
          padding: 0 20px 80px;
        }
        .co-input::placeholder { color: #ccc; }
        .co-input:focus {
          border-color: #f97316 !important;
          box-shadow: 3px 3px 0px #f97316 !important;
        }
        .co-textarea::placeholder { color: #ccc; }
        .co-textarea:focus {
          border-color: #f97316 !important;
          box-shadow: 3px 3px 0px #f97316 !important;
        }
        .addr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
          margin-bottom: 18px;
        }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        @media (max-width: 860px) {
          .co-wrap { grid-template-columns: 1fr; }
        }
        @media (max-width: 540px) {
          .two-col { grid-template-columns: 1fr; }
          .addr-grid { grid-template-columns: 1fr 1fr; }
          .co-wrap { padding: 0 16px 80px; }
        }
        @media (max-width: 340px) {
          .addr-grid { grid-template-columns: 1fr; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "20px 20px 0", fontSize: "12px", display: "flex", gap: "6px", alignItems: "center" }}>
        <Link href="/" style={{ color: "#f97316", textDecoration: "none", fontWeight: 700 }}>Home</Link>
        <span style={{ color: "#ccc" }}><ChevronIcon /></span>
        <Link href="/cart" style={{ color: "#aaa", textDecoration: "none", fontWeight: 600 }}>Cart</Link>
        <span style={{ color: "#ccc" }}><ChevronIcon /></span>
        <span style={{ color: "#111", fontWeight: 700 }}>Checkout</span>
      </div>

      {/* Page header */}
      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "14px 20px 24px" }}>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 800, color: "#111", letterSpacing: "-1.5px", margin: "0 0 4px", fontFamily: "'Syne', sans-serif", lineHeight: 1.1 }}>
          Checkout
        </h1>
        <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>
          {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      {/* Guest sign-in nudge */}
      {!user && (
        <div style={{ maxWidth: "1060px", margin: "0 auto 20px", padding: "0 20px" }}>
          <div style={{
            backgroundColor: "#fff",
            border: "2px solid #e8e8e8",
            borderRadius: "14px",
            padding: "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "10px",
            boxShadow: "3px 3px 0px #f0f0f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#f97316" }}><InfoIcon /></span>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                Have an account?{" "}
                <a href="/account/login" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
                {" "}to use saved addresses — or just order below.
              </p>
            </div>
            <a href="/account/signup" style={{ fontSize: "12px", color: "#aaa", textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>
              Create account →
            </a>
          </div>
        </div>
      )}

      <div className="co-wrap">
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* ── SAVED ADDRESSES (logged in) ── */}
          {user && savedAddresses.length > 0 && (
            <Card>
              <CardHeader
                icon={<PinIcon />}
                title="Saved Addresses"
                subtitle="Pick one or add a new address"
              />
              <div style={{ padding: "24px" }}>
                {/* Toggle */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
                  {["saved", "new"].map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        if (mode === "saved") {
                          setAddressMode("saved")
                          const def = savedAddresses.find(a => a.isDefault) ?? savedAddresses[0]
                          selectSavedAddress(def)
                        } else {
                          setAddressMode("new")
                          setSelectedAddressId(null)
                          setAddress(""); setCity(""); setName(user?.displayName ?? ""); setPhone("")
                        }
                      }}
                      style={{
                        padding: "6px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: 700,
                        border: "2px solid #111", cursor: "pointer", fontFamily: "'Syne', sans-serif",
                        backgroundColor: addressMode === mode ? "#111" : "#fff",
                        color: addressMode === mode ? "#fff" : "#888",
                        boxShadow: addressMode === mode ? "3px 3px 0px #f97316" : "none",
                        transition: "all 0.15s",
                      }}
                    >
                      {mode === "saved" ? "Saved" : "+ New"}
                    </button>
                  ))}
                </div>

                {addressMode === "saved" && (
                  <>
                    <div className="addr-grid">
                      {savedAddresses.map(addr => {
                        const isSelected = selectedAddressId === addr.id
                        return (
                          <div key={addr.id} onClick={() => selectSavedAddress(addr)} style={{
                            padding: "12px", borderRadius: "14px", cursor: "pointer",
                            border: `2px solid ${isSelected ? "#f97316" : "#e8e8e8"}`,
                            backgroundColor: isSelected ? "#fff3e8" : "#fafaf8",
                            boxShadow: isSelected ? "3px 3px 0px #f97316" : "3px 3px 0px #f0f0f0",
                            transition: "all 0.15s",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 800, color: "#111", fontFamily: "'Syne', sans-serif" }}>
                                {addr.label}
                              </span>
                              {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6L9 17l-5-5"/>
                                </svg>
                              )}
                            </div>
                            <p style={{ fontSize: "11px", color: "#888", margin: "0 0 2px", lineHeight: 1.4 }}>{addr.address}</p>
                            {addr.city && <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{addr.city}</p>}
                            {addr.isDefault && (
                              <span style={{ fontSize: "10px", color: "#f97316", fontWeight: 800, marginTop: "4px", display: "block", fontFamily: "'Syne', sans-serif" }}>
                                Default
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Name + Phone for saved mode */}
                    <div className="two-col">
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><UserIcon /></span>
                          <input className="co-input" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Phone *</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><PhoneIcon /></span>
                          <input className="co-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+92 300 0000000" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {addressMode === "new" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div className="two-col">
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><UserIcon /></span>
                          <input className="co-input" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Phone *</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><PhoneIcon /></span>
                          <input className="co-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+92 300 0000000" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Street Address *</label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "13px", top: "14px", pointerEvents: "none" }}><PinIcon /></span>
                        <textarea className="co-textarea" value={address} onChange={e => setAddress(e.target.value)} placeholder="House 12, Street 5, Block A" rows={2} style={{ ...inputBase, resize: "vertical" }} onFocus={onFocusIn} onBlur={onFocusOut} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>City</label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><CityIcon /></span>
                        <input className="co-input" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Lahore" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                      </div>
                    </div>
                    <SaveCheckbox />
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* ── DELIVERY DETAILS (guest or no saved) ── */}
          {(!user || savedAddresses.length === 0) && (
            <Card>
              <CardHeader icon={<TruckIcon />} title="Delivery Details" subtitle="Where should we bring your food?" />
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="two-col">
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><UserIcon /></span>
                      <input className="co-input" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><PhoneIcon /></span>
                      <input className="co-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+92 300 0000000" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Street Address *</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "13px", top: "14px", pointerEvents: "none" }}><PinIcon /></span>
                    <textarea className="co-textarea" value={address} onChange={e => setAddress(e.target.value)} placeholder="House 12, Street 5, Block A" rows={2} style={{ ...inputBase, resize: "vertical" }} onFocus={onFocusIn} onBlur={onFocusOut} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>City</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><CityIcon /></span>
                    <input className="co-input" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Lahore" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Order Notes <span style={{ color: "#ccc", textTransform: "none", fontSize: "11px", fontWeight: 400, letterSpacing: 0 }}>(optional)</span></label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "13px", top: "14px", pointerEvents: "none" }}><NoteIcon /></span>
                    <textarea className="co-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, special requests..." rows={2} style={{ ...inputBase, resize: "vertical" }} onFocus={onFocusIn} onBlur={onFocusOut} />
                  </div>
                </div>

                {user && <SaveCheckbox />}

                {!user && (
                  <div style={{
                    padding: "12px 14px", borderRadius: "12px",
                    backgroundColor: "#fafaf8", border: "2px solid #e8e8e8",
                    display: "flex", alignItems: "center", gap: "10px",
                    boxShadow: "3px 3px 0px #f0f0f0",
                  }}>
                    <span style={{ color: "#aaa", flexShrink: 0 }}><SaveIcon /></span>
                    <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>
                      Want to save this?{" "}
                      <a href="/account/signup" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Create a free account</a>
                      {" "}— takes 30 seconds.
                    </p>
                  </div>
                )}

                {/* Delivery estimate */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 14px", borderRadius: "12px",
                  border: "2px solid #111", boxShadow: "3px 3px 0px #111",
                  backgroundColor: "#fafaf8",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 800, color: "#111", margin: 0, fontFamily: "'Syne', sans-serif" }}>Est. delivery: 30–45 min</p>
                    <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>After your order is confirmed</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* ── ORDER NOTES (logged in + saved address mode) ── */}
          {user && savedAddresses.length > 0 && addressMode === "saved" && (
            <Card>
              <CardHeader icon={<NoteIcon />} title="Order Notes" subtitle="Any special requests?" />
              <div style={{ padding: "24px" }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "13px", top: "14px", pointerEvents: "none" }}><NoteIcon /></span>
                  <textarea className="co-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, special requests..." rows={3} style={{ ...inputBase, resize: "vertical" }} onFocus={onFocusIn} onBlur={onFocusOut} />
                </div>
              </div>
            </Card>
          )}

          {/* ── PROMO CODE ── */}
          <Card>
            <CardHeader icon={<TagIcon />} title="Promo Code" subtitle="Got a discount? Apply it here" />
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: "140px" }}>
                  <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><TagIcon /></span>
                  <input
                    className="co-input"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter code..."
                    style={{ ...inputBase, letterSpacing: "1px", fontWeight: 700 }}
                    onFocus={onFocusIn}
                    onBlur={onFocusOut}
                  />
                </div>
                <button
                  onClick={applyPromo}
                  style={{
                    padding: "12px 20px", borderRadius: "12px",
                    backgroundColor: "#f97316", color: "#fff",
                    border: "2px solid #111", fontWeight: 800, fontSize: "14px",
                    cursor: "pointer", whiteSpace: "nowrap",
                    fontFamily: "'Syne', sans-serif",
                    boxShadow: "3px 3px 0px #111",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "5px 5px 0px #111"; e.currentTarget.style.transform = "translateY(-1px)" }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "3px 3px 0px #111"; e.currentTarget.style.transform = "translateY(0)" }}
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <p style={{ color: "#ef4444", fontSize: "12px", fontWeight: 600, margin: "10px 0 0", display: "flex", alignItems: "center", gap: "5px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {promoError}
                </p>
              )}
              {appliedOffer && (
                <p style={{ color: "#22c55e", fontSize: "12px", fontWeight: 700, margin: "10px 0 0", display: "flex", alignItems: "center", gap: "5px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  "{appliedOffer.code}" applied — {appliedOffer.title}
                </p>
              )}

              {/* Active offer chips */}
              {offers.filter(o => o.active && (!o.expiresAt || new Date(o.expiresAt) >= new Date())).length > 0 && (
                <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {offers.filter(o => o.active && (!o.expiresAt || new Date(o.expiresAt) >= new Date())).map(o => (
                    <button key={o.id} onClick={() => { setPromoInput(o.code); setPromoError("") }} style={{
                      padding: "5px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 800,
                      border: "2px solid #f97316", backgroundColor: "#fff3e8",
                      color: "#f97316", cursor: "pointer", letterSpacing: "0.5px",
                      fontFamily: "'Syne', sans-serif",
                      boxShadow: "2px 2px 0px #f97316",
                      transition: "all 0.15s",
                    }}>
                      {o.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ── */}
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