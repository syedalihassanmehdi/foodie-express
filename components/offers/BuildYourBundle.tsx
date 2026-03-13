"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useUserAuth } from "@/context/UserAuthContext"
import { subscribeToBundles, Bundle } from "@/lib/firestore"

// ── Icons ───────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const PuzzleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
  </svg>
)
const PartyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
  </svg>
)

export function BuildYourBundle() {
  const { addToCart }  = useCart()
  const { user }       = useUserAuth()
  const router         = useRouter()

  const [bundles, setBundles]                 = useState<Bundle[]>([])
  const [loading, setLoading]                 = useState(true)
  const [activeBundleIndex, setActiveBundleIndex] = useState(0)
  const [selected, setSelected]               = useState<Record<string, { id: string; name: string; price: number; image: string } | null>>({})
  const [added, setAdded]                     = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isMobile, setIsMobile]               = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const unsub = subscribeToBundles(all => {
      setBundles(all.filter(b => b.active))
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (bundles.length === 0) return
    const bundle = bundles[activeBundleIndex]
    const init: Record<string, null> = {}
    bundle.categories.forEach(c => { init[c.label] = null })
    setSelected(init)
    setAdded(false)
    setShowLoginPrompt(false)
  }, [activeBundleIndex, bundles])

  // ── Loading skeleton ────────────────────────────────────────
  if (loading) {
    return (
      <section style={{ backgroundColor:"#fff", padding:"80px 2rem", borderBottom:"2px solid #111" }}>
        <style>{`@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }`}</style>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          {[180, 120, 260].map((h, i) => (
            <div key={i} style={{ height:`${h}px`, borderRadius:"16px", border:"2px solid #f0f0f0", marginBottom:"20px", background:"linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%)", backgroundSize:"400px 100%", animation:"shimmer 1.4s ease-in-out infinite" }} />
          ))}
        </div>
      </section>
    )
  }

  if (bundles.length === 0) return null

  const bundle   = bundles[activeBundleIndex]
  const DISCOUNT = bundle.discount / 100
  const filled   = bundle.categories.map(c => selected[c.label]).filter(Boolean)
  const isComplete = filled.length === bundle.categories.length
  const total      = filled.reduce((sum, i) => sum + (i?.price ?? 0), 0)
  const discounted = total * (1 - DISCOUNT)

  const select = (label: string, item: { id: string; name: string; price: number; image: string }) => {
    setAdded(false)
    setShowLoginPrompt(false)
    setSelected(prev => ({ ...prev, [label]: prev[label]?.id === item.id ? null : item }))
  }

  const handleAddToCart = () => {
    if (!isComplete) return
    if (!user) { setShowLoginPrompt(true); return }
    bundle.categories.forEach(cat => {
      const item = selected[cat.label]
      if (!item) return
      addToCart({ id:`bundle-${bundle.id}-${item.id}`, name:item.name, desc:`Part of "${bundle.name}" bundle (${bundle.discount}% off)`, image:item.image, price:parseFloat((item.price*(1-DISCOUNT)).toFixed(2)), isBundle:true, originalPrice:item.price })
    })
    setAdded(true)
    setTimeout(() => {
      const init: Record<string,null> = {}
      bundle.categories.forEach(c => { init[c.label] = null })
      setSelected(init); setAdded(false)
    }, 2000)
  }

  const gridCols = (count: number) => {
    if (isMobile) return 2
    if (count <= 2) return count
    if (count === 3) return 3
    return 4
  }

  return (
    <section style={{
      backgroundColor:"#fff",
      padding: isMobile ? "48px 1.25rem 56px" : "80px 2rem",
      fontFamily:"'DM Sans', sans-serif",
      position:"relative",
      overflow:"hidden",
      borderBottom:"2px solid #111",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .bundle-item { transition: all 0.2s ease !important; }
        .bundle-item:hover { transform: translateY(-3px) !important; }
      `}</style>

      {/* Warm blob */}
      <div style={{ position:"absolute", top:"-10%", right:"-5%", width:"400px", height:"400px", background:"radial-gradient(circle, #fff3e8 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.15, backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize:"32px 32px" }} />

      <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:2 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:"32px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"999px", padding:"5px 14px", marginBottom:"12px", boxShadow:"3px 3px 0px #f97316" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#f97316", display:"inline-block", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne', sans-serif" }}>Build & Save {bundle.discount}%</span>
          </div>
          <h2 style={{ fontSize: isMobile ? "32px" : "clamp(28px,4vw,48px)", fontWeight:800, color:"#111", margin:"0 0 10px", letterSpacing:"-2px", lineHeight:1.0, fontFamily:"'Syne', sans-serif" }}>
            {bundle.name.split(" ").slice(0,-1).join(" ")}{" "}
            <span style={{ color:"#f97316", fontStyle:"italic" }}>{bundle.name.split(" ").slice(-1)[0]}.</span>
          </h2>
          <p style={{ color:"#777", fontSize:"14px", margin:"0 0 20px" }}>
            {bundle.description || `Pick one from each category — unlock `}
            <span style={{ color:"#f97316", fontWeight:700 }}>{bundle.discount}% off</span> your entire bundle.
          </p>

          {/* Bundle switcher tabs */}
          {bundles.length > 1 && (
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              {bundles.map((b, i) => (
                <button key={b.id} onClick={() => setActiveBundleIndex(i)} style={{
                  padding:"8px 18px", borderRadius:"10px",
                  border:"2px solid",
                  borderColor: i === activeBundleIndex ? "#f97316" : "#e8e8e8",
                  backgroundColor: i === activeBundleIndex ? "#f97316" : "#fff",
                  color: i === activeBundleIndex ? "#fff" : "#777",
                  fontSize:"13px", fontWeight:700, cursor:"pointer",
                  fontFamily:"'Syne', sans-serif", transition:"all 0.2s",
                  boxShadow: i === activeBundleIndex ? "3px 3px 0px #c2540a" : "2px 2px 0px #f0f0f0",
                }}>{b.name}</button>
              ))}
            </div>
          )}
        </div>

        {/* ── Progress bar ── */}
        <div style={{ marginBottom:"40px", backgroundColor:"#fff", border:"2px solid #111", borderRadius:"16px", padding: isMobile ? "16px" : "20px 24px", boxShadow:"4px 4px 0px #111" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px", flexWrap:"wrap", gap:"8px" }}>
            <span style={{ fontSize:"12px", fontWeight:700, color:"#111", fontFamily:"'Syne', sans-serif", textTransform:"uppercase", letterSpacing:"0.8px" }}>
              {filled.length} / {bundle.categories.length} selected
            </span>
            <span style={{ fontSize:"12px", color:"#aaa", fontWeight:600 }}>
              {isComplete ? `${bundle.discount}% discount unlocked!` : `${bundle.categories.length - filled.length} more to unlock ${bundle.discount}% off`}
            </span>
          </div>
          {/* Step indicators */}
          <div style={{ display:"flex", gap:"6px", marginBottom:"14px", flexWrap:"wrap" }}>
            {bundle.categories.map(cat => {
              const done = !!selected[cat.label]
              return (
                <div key={cat.label} style={{ display:"flex", alignItems:"center", gap:"5px", backgroundColor: done ? "#fff3e8" : "#f5f5f5", border:`2px solid ${done ? "#f97316" : "#e8e8e8"}`, borderRadius:"8px", padding:"5px 10px", transition:"all 0.2s" }}>
                  <div style={{ width:"16px", height:"16px", borderRadius:"50%", backgroundColor: done ? "#f97316" : "#e8e8e8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {done && <CheckIcon />}
                  </div>
                  <span style={{ fontSize:"11px", fontWeight:700, color: done ? "#f97316" : "#aaa", fontFamily:"'Syne', sans-serif", whiteSpace:"nowrap" }}>{cat.label}</span>
                </div>
              )
            })}
          </div>
          {/* Progress track */}
          <div style={{ backgroundColor:"#f0f0f0", borderRadius:"100px", height:"6px", overflow:"hidden", border:"1px solid #e8e8e8" }}>
            <div style={{ height:"100%", backgroundColor:"#f97316", borderRadius:"100px", width:`${(filled.length/bundle.categories.length)*100}%`, transition:"width 0.4s ease", boxShadow:"0 0 8px rgba(249,115,22,0.4)" }} />
          </div>
        </div>

        {/* ── Category grids ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:"36px", marginBottom:"36px" }}>
          {bundle.categories.map(cat => (
            <div key={cat.label}>
              <p style={{ fontWeight:700, fontSize:"11px", color:"#f97316", marginBottom:"14px", textTransform:"uppercase", letterSpacing:"1.5px", fontFamily:"'Syne', sans-serif" }}>
                {cat.label}
              </p>
              {cat.items.length === 0 ? (
                <p style={{ color:"#aaa", fontSize:"13px" }}>No items available in this category.</p>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:`repeat(${gridCols(cat.items.length)}, 1fr)`, gap:"12px" }}>
                  {cat.items.map(item => {
                    const isSel = selected[cat.label]?.id === item.id
                    return (
                      <div
                        key={item.id}
                        className="bundle-item"
                        onClick={() => select(cat.label, item)}
                        style={{
                          borderRadius:"16px",
                          border:`2px solid ${isSel ? "#f97316" : "#e8e8e8"}`,
                          backgroundColor:"#fff",
                          cursor:"pointer",
                          overflow:"hidden",
                          boxShadow: isSel ? "4px 4px 0px #f97316" : "3px 3px 0px #f0f0f0",
                        }}
                        onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLDivElement).style.borderColor = "#f97316" }}
                        onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLDivElement).style.borderColor = "#e8e8e8" }}
                      >
                        <div style={{ height: isMobile ? "90px" : "110px", overflow:"hidden", position:"relative" }}>
                          <img src={item.image} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover", filter: isSel ? "brightness(0.9)" : "brightness(0.95)", transition:"filter 0.2s" }} />
                          {isSel && (
                            <div style={{ position:"absolute", top:"8px", right:"8px", backgroundColor:"#f97316", border:"2px solid #111", color:"#fff", borderRadius:"50%", width:"24px", height:"24px", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"2px 2px 0px #111" }}>
                              <CheckIcon />
                            </div>
                          )}
                          {/* Orange top bar */}
                          <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", backgroundColor:"#f97316", opacity: isSel ? 1 : 0, transition:"opacity 0.2s" }} />
                        </div>
                        <div style={{ padding:"10px 12px" }}>
                          <p style={{ fontWeight:700, fontSize:"12px", color:"#111", margin:"0 0 3px", lineHeight:1.3, fontFamily:"'Syne', sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</p>
                          <p style={{ color:"#f97316", fontSize:"13px", fontWeight:800, margin:0 }}>${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Bundle summary ── */}
        <div style={{
          borderRadius:"18px",
          border:`2px solid ${isComplete ? "#f97316" : "#e8e8e8"}`,
          backgroundColor:"#fff",
          padding: isMobile ? "20px 16px" : "24px 28px",
          transition:"all 0.4s",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:"20px",
          boxShadow: isComplete ? "6px 6px 0px #f97316" : "4px 4px 0px #f0f0f0",
        }}>
          {/* Left */}
          <div style={{ flex:1, minWidth:"200px" }}>
            <p style={{ fontWeight:700, fontSize:"14px", color: isComplete ? "#111" : "#aaa", margin:"0 0 12px", display:"flex", alignItems:"center", gap:"7px", fontFamily:"'Syne', sans-serif" }}>
              {isComplete ? <PartyIcon /> : <PuzzleIcon />}
              {isComplete
                ? `Bundle complete! ${bundle.discount}% discount unlocked.`
                : `Select ${bundle.categories.length - filled.length} more item${bundle.categories.length - filled.length !== 1 ? "s" : ""} to unlock ${bundle.discount}% off`}
            </p>
            {/* Selected chips */}
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              {bundle.categories.map(cat => {
                const item = selected[cat.label]
                return (
                  <div key={cat.label} style={{ display:"flex", alignItems:"center", gap:"6px", backgroundColor: item ? "#f97316" : "#f5f5f5", border:`2px solid ${item ? "#f97316" : "#e8e8e8"}`, borderRadius:"8px", padding:"4px 10px" }}>
                    {item && <img src={item.image} alt={item.name} style={{ width:"16px", height:"16px", borderRadius:"50%", objectFit:"cover" }} />}
                    <span style={{ fontSize:"11px", color: item ? "#fff" : "#aaa", fontWeight:700, fontFamily:"'Syne', sans-serif" }}>{item ? item.name : cat.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right */}
          <div style={{ textAlign:"right", flexShrink:0 }}>
            {isComplete && (
              <p style={{ color:"#bbb", fontSize:"14px", textDecoration:"line-through", margin:"0 0 2px" }}>${total.toFixed(2)}</p>
            )}
            <p style={{ fontSize:"36px", fontWeight:800, color: isComplete ? "#f97316" : "#ccc", margin:"0 0 14px", letterSpacing:"-1.5px", fontFamily:"'Syne', sans-serif", lineHeight:1 }}>
              {isComplete ? `$${discounted.toFixed(2)}` : `$${total.toFixed(2)}`}
            </p>

            {/* Login prompt */}
            {showLoginPrompt && (
              <div style={{ animation:"fadeIn 0.25s ease", marginBottom:"14px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"12px", padding:"14px 16px", textAlign:"left", boxShadow:"3px 3px 0px #f97316" }}>
                <p style={{ color:"#f97316", fontSize:"13px", fontWeight:700, margin:"0 0 6px", display:"flex", alignItems:"center", gap:"6px", fontFamily:"'Syne', sans-serif" }}>
                  <LockIcon /> Sign in to order bundles
                </p>
                <p style={{ color:"#777", fontSize:"12px", margin:"0 0 12px", lineHeight:1.5 }}>Bundle deals are exclusive to members. It's free and takes 30 seconds.</p>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={() => router.push("/account/login")}
                    style={{ flex:1, padding:"9px 14px", borderRadius:"8px", backgroundColor:"#f97316", color:"#fff", border:"2px solid #f97316", fontWeight:700, fontSize:"12px", cursor:"pointer", fontFamily:"'Syne', sans-serif", boxShadow:"2px 2px 0px #c2540a", display:"flex", alignItems:"center", justifyContent:"center", gap:"5px" }}>
                    Sign In <ArrowIcon />
                  </button>
                  <button onClick={() => router.push("/account/signup")}
                    style={{ flex:1, padding:"9px 14px", borderRadius:"8px", backgroundColor:"#fff", color:"#f97316", border:"2px solid #f97316", fontWeight:700, fontSize:"12px", cursor:"pointer", fontFamily:"'Syne', sans-serif" }}>
                    Create Account
                  </button>
                </div>
              </div>
            )}

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              style={{
                backgroundColor: added ? "#22c55e" : isComplete ? "#f97316" : "#f5f5f5",
                color: isComplete || added ? "#fff" : "#bbb",
                padding:"12px 24px", borderRadius:"12px",
                fontSize:"14px", fontWeight:700,
                cursor: isComplete ? "pointer" : "not-allowed",
                transition:"all 0.2s",
                border:`2px solid ${added ? "#22c55e" : isComplete ? "#f97316" : "#e8e8e8"}`,
                boxShadow: added ? "none" : isComplete ? "4px 4px 0px #c2540a" : "none",
                fontFamily:"'Syne', sans-serif",
                display:"flex", alignItems:"center", gap:"8px", justifyContent:"center",
              }}
              onMouseEnter={e => { if (isComplete && !added) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)" }}
            >
              {added ? <><CheckIcon /> Added to Cart!</> : isComplete ? <><CartIcon /> Add Bundle to Cart</> : "Complete Bundle to Order"}
            </button>
          </div>
        </div>

        <div style={{ marginTop:"48px", height:"2px", backgroundColor:"#f0f0f0", borderRadius:"2px" }} />
      </div>
    </section>
  )
}