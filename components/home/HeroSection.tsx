"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const floatingCards = [
  { id: 1, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", name: "Smash Burger", price: "$14.50", rating: "4.9", delay: "0s" },
  { id: 2, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", name: "Margherita Pizza", price: "$14.99", rating: "4.8", delay: "0.2s" },
  { id: 3, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80", name: "Carbonara", price: "$15.50", rating: "4.9", delay: "0.4s" },
  { id: 4, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80", name: "Lava Cake", price: "$10.50", rating: "4.9", delay: "0.6s" },
]

const tickers = [
  "Marco just ordered Margherita Pizza",
  "Sophia ordered Wagyu Burger",
  "James ordered Truffle Carbonara",
  "Aisha ordered Harvest Bowl",
  "Liam ordered Chocolate Lava Cake",
  "Emma ordered Ribeye Steak",
]

const FlameIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c0 0-5 4.5-5 9a5 5 0 0 0 10 0c0-2-1-3.5-2-4.5 0 1.5-1 2.5-2 3-.5-2-.5-5.5 1-7.5z"/>
  </svg>
)

const UserIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

export function HeroSection() {
  const [tickerIndex, setTickerIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setTickerIndex(i => (i + 1) % tickers.length)
        setVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section style={{
      position: "relative",
      height: "100vh",
      minHeight: "600px",
      backgroundColor: "#fff",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes floatCard0 { 0%,100%{transform:rotate(-4deg) translateY(0)} 50%{transform:rotate(-4deg) translateY(-8px)} }
        @keyframes floatCard1 { 0%,100%{transform:rotate(4deg) translateY(0)} 50%{transform:rotate(4deg) translateY(-6px)} }
        @keyframes floatCard2 { 0%,100%{transform:rotate(-2deg) translateY(0)} 50%{transform:rotate(-2deg) translateY(-10px)} }
        @keyframes floatCard3 { 0%,100%{transform:rotate(6deg) translateY(0)} 50%{transform:rotate(6deg) translateY(-7px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes scrollCards { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blobMove { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }

        .hero-cta-primary:hover { transform: translateY(-2px) !important; box-shadow: 4px 4px 0px #c2540a !important; }
        .hero-cta-secondary:hover { background: #f97316 !important; color: #fff !important; border-color: #f97316 !important; }
        .food-card:hover { transform: translateY(-3px) scale(1.02) !important; }
      `}</style>

      {/* Blobs */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "420px", height: "420px", background: "radial-gradient(circle, #fff3e8 0%, #ffe0c2 50%, transparent 75%)", animation: "blobMove 10s ease-in-out infinite", zIndex: 0, pointerEvents: "none", opacity: 0.7 }} />
      <div style={{ position: "absolute", bottom: "5%", left: "-8%", width: "300px", height: "300px", background: "radial-gradient(circle, #fff8f0 0%, #ffd4a3 60%, transparent 75%)", animation: "blobMove 14s ease-in-out infinite reverse", zIndex: 0, pointerEvents: "none", opacity: 0.5 }} />

      {/* Diagonal stripe */}
      <div style={{ position: "absolute", top: 0, right: 0, width: isMobile ? "100%" : "52%", height: "100%", background: "linear-gradient(135deg, #fff9f5 0%, #fff3e8 40%, #ffe8cc 100%)", clipPath: isMobile ? "none" : "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }} />

      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.35, backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize: "32px 32px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)" }} />

      {/* Spinning ring */}
      {!isMobile && (
        <div style={{ position: "absolute", top: "50%", left: "46%", transform: "translate(-50%, -50%)", width: "480px", height: "480px", border: "1.5px dashed rgba(249,115,22,0.2)", borderRadius: "50%", animation: "spinSlow 40s linear infinite", zIndex: 1, pointerEvents: "none" }} />
      )}

      {/* ── Main content ── */}
      <div style={{
        position: "relative", zIndex: 10,
        flex: 1,
        minHeight: 0,
        maxWidth: "1280px", margin: "0 auto",
        padding: isMobile ? "80px 1.5rem 16px" : "0 3rem",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        width: "100%",
        alignItems: "center",
      }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "0" }}>

          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            backgroundColor: "#fff3e8", border: "2px solid #f97316",
            borderRadius: "999px", padding: "5px 14px", marginBottom: "16px",
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            boxShadow: "3px 3px 0px #f97316", width: "fit-content",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "10px", color: "#f97316", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>Now Delivering Near You</span>
          </div>

          {/* Headline — smaller clamp so it fits at 100% zoom */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            marginBottom: "14px",
          }}>
            <div style={{
              fontSize: "clamp(36px, 4.8vw, 72px)",
              fontWeight: 800, lineHeight: 1.0,
              letterSpacing: "-2px",
              fontFamily: "'Syne', sans-serif",
            }}>
              <div style={{ color: "#111" }}>Food That</div>
              <div style={{ color: "#111" }}>Feels Like</div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <span style={{ color: "#f97316", fontStyle: "italic", position: "relative", display: "inline-block" }}>
                  Home.
                  <svg viewBox="0 0 220 12" style={{ position: "absolute", bottom: "-5px", left: 0, width: "100%", height: "10px" }} preserveAspectRatio="none">
                    <path d="M2,8 C30,2 60,12 90,6 C120,0 150,10 180,5 C195,2 210,8 218,5" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
            <div style={{ height: "3px", width: "36px", backgroundColor: "#f97316", borderRadius: "2px" }} />
            <div style={{ height: "3px", width: "10px", backgroundColor: "#ffd4a3", borderRadius: "2px" }} />
            <div style={{ height: "3px", width: "5px", backgroundColor: "#ffe8cc", borderRadius: "2px" }} />
          </div>

          {/* Description */}
          <p style={{
            color: "#777", fontSize: "14px", lineHeight: 1.65,
            maxWidth: "380px", marginBottom: "20px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
            fontWeight: 400,
          }}>
            Premium meals crafted by award-winning chefs, delivered hot to your door in under 30 minutes. No compromises.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s",
          }}>
            <Link href="/menu" className="hero-cta-primary" style={{
              backgroundColor: "#f97316", color: "#fff",
              padding: "13px 30px", borderRadius: "12px",
              fontSize: "14px", fontWeight: 700, textDecoration: "none",
              boxShadow: "5px 5px 0px #c2540a",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "inline-block", fontFamily: "'Syne', sans-serif",
            }}>Order Now →</Link>
            <Link href="/offers" className="hero-cta-secondary" style={{
              backgroundColor: "#fff", color: "#f97316",
              padding: "13px 30px", borderRadius: "12px",
              fontSize: "14px", fontWeight: 700, textDecoration: "none",
              border: "2px solid #f97316", transition: "all 0.2s",
              display: "inline-block", fontFamily: "'Syne', sans-serif",
              boxShadow: "5px 5px 0px #ffe0c2",
            }}>View Offers</Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: isMobile ? "20px" : "0px", flexWrap: "wrap",
            opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.6s",
          }}>
            {[["50K+", "Happy Customers"], ["4.9★", "Average Rating"], ["<30m", "Delivery Time"]].map(([val, label], i) => (
              <div key={label} style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                paddingRight: isMobile ? "20px" : "28px",
                paddingLeft: i === 0 ? "0" : isMobile ? "0" : "28px",
                borderLeft: i === 0 || isMobile ? "none" : "2px solid #f0f0f0",
              }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#111", letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: "10px", color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "3px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        {!isMobile ? (
          <div style={{ position: "relative", height: "100%", overflow: "visible" }}>

            {/* Food image */}
            <div style={{ position: "absolute", inset: "6% 0 6% 8%", borderRadius: "28px", backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.75) saturate(1.1)", opacity: mounted ? 1 : 0, transition: "opacity 0.9s ease 0.2s", boxShadow: "14px 14px 0px #f97316" }} />
            <div style={{ position: "absolute", inset: "6% 0 6% 8%", borderRadius: "28px", background: "linear-gradient(145deg, rgba(249,115,22,0.25) 0%, transparent 55%)" }} />

            {/* Floating cards */}
            {[
              { ...floatingCards[0], top: "10%", left: "2%", rotate: "-4deg", anim: "floatCard0" },
              { ...floatingCards[1], top: "16%", left: "53%", rotate: "4deg", anim: "floatCard1" },
              { ...floatingCards[2], top: "58%", left: "4%", rotate: "-2deg", anim: "floatCard2" },
              { ...floatingCards[3], top: "63%", left: "54%", rotate: "6deg", anim: "floatCard3" },
            ].map((card, i) => (
              <div key={card.id} style={{ position: "absolute", top: card.top, left: card.left, zIndex: 20, opacity: mounted ? 1 : 0, transform: mounted ? `rotate(${card.rotate})` : `rotate(${card.rotate}) translateY(20px)`, transition: `opacity 0.7s ease ${card.delay}, transform 0.7s ease ${card.delay}`, animation: mounted ? `${card.anim} ${3.5 + i * 0.5}s ease-in-out infinite` : "none" }}>
                <div className="food-card" style={{ backgroundColor: "#fff", border: "2px solid #111", borderRadius: "14px", overflow: "hidden", width: "138px", boxShadow: "4px 4px 0px #111", transition: "transform 0.2s, box-shadow 0.2s" }}>
                  <div style={{ position: "relative" }}>
                    <img src={card.image} alt={card.name} style={{ width: "100%", height: "88px", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "7px", right: "7px", backgroundColor: "#f97316", color: "#fff", borderRadius: "6px", padding: "2px 6px", fontSize: "10px", fontWeight: 800 }}>★ {card.rating}</div>
                  </div>
                  <div style={{ padding: "8px 10px", backgroundColor: "#fff" }}>
                    <p style={{ color: "#111", fontSize: "11px", fontWeight: 700, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Syne', sans-serif" }}>{card.name}</p>
                    <span style={{ color: "#f97316", fontSize: "12px", fontWeight: 800 }}>{card.price}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* 30 min badge */}
            <div style={{ position: "absolute", bottom: "14%", right: "2%", zIndex: 20, backgroundColor: "#f97316", border: "3px solid #111", borderRadius: "18px", padding: "13px 18px", textAlign: "center", boxShadow: "4px 4px 0px #111", opacity: mounted ? 1 : 0, transform: mounted ? "scale(1)" : "scale(0.8)", transition: "opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s" }}>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#fff", lineHeight: 1, fontFamily: "'Syne', sans-serif" }}>30</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.9)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>min</div>
            </div>

            {/* Trending tag */}
            <div style={{ position: "absolute", top: "6%", right: "0%", zIndex: 20, backgroundColor: "#111", color: "#fff", borderRadius: "0 28px 0 14px", padding: "9px 16px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif", display: "flex", alignItems: "center", gap: "6px", opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.8s" }}>
              <FlameIcon /> Trending Now
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "32px", overflow: "hidden", marginLeft: "-1.5rem", marginRight: "-1.5rem" }}>
            <div style={{ display: "flex", gap: "14px", animation: "scrollCards 18s linear infinite", width: "max-content", padding: "8px 1.5rem" }}>
              {[...floatingCards, ...floatingCards].map((card, i) => (
                <div key={i} className="food-card" style={{ backgroundColor: "#fff", border: "2px solid #111", borderRadius: "14px", overflow: "hidden", width: "130px", flexShrink: 0, boxShadow: "4px 4px 0px #f97316", transition: "transform 0.2s, box-shadow 0.2s" }}>
                  <div style={{ position: "relative" }}>
                    <img src={card.image} alt={card.name} style={{ width: "100%", height: "80px", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "6px", right: "6px", backgroundColor: "#f97316", color: "#fff", borderRadius: "5px", padding: "2px 6px", fontSize: "9px", fontWeight: 800 }}>★ {card.rating}</div>
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <p style={{ color: "#111", fontSize: "10px", fontWeight: 700, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Syne', sans-serif" }}>{card.name}</p>
                    <span style={{ color: "#f97316", fontSize: "11px", fontWeight: 800 }}>{card.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Ticker — flex child pinned to bottom ── */}
      <div style={{
        flexShrink: 0, position: "relative", zIndex: 10,
        borderTop: "2px solid #111", backgroundColor: "#111",
        padding: "10px 1.5rem",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#f97316", borderRadius: "6px", padding: "3px 10px", flexShrink: 0 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#fff", display: "inline-block", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: "10px", color: "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px" }}>Live</span>
        </div>
        <div style={{ width: "1px", height: "14px", backgroundColor: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
          <UserIcon />
          <span style={{ fontSize: "12px", color: "#aaa", fontWeight: 500, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.3s ease, transform 0.3s ease", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {tickers[tickerIndex]}
          </span>
        </div>
      </div>
    </section>
  )
}