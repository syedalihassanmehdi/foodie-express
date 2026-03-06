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
  "🍕 Marco just ordered Margherita Pizza",
  "🍔 Sophia ordered Wagyu Burger",
  "🍝 James ordered Truffle Carbonara",
  "🥗 Aisha ordered Harvest Bowl",
  "🍰 Liam ordered Chocolate Lava Cake",
  "🥩 Emma ordered Ribeye Steak",
]

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
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      <style>{`
        @keyframes floatCard0 { 0%,100%{transform:rotate(-4deg) translateY(0)} 50%{transform:rotate(-4deg) translateY(-10px)} }
        @keyframes floatCard1 { 0%,100%{transform:rotate(4deg) translateY(0)} 50%{transform:rotate(4deg) translateY(-8px)} }
        @keyframes floatCard2 { 0%,100%{transform:rotate(-2deg) translateY(0)} 50%{transform:rotate(-2deg) translateY(-12px)} }
        @keyframes floatCard3 { 0%,100%{transform:rotate(6deg) translateY(0)} 50%{transform:rotate(6deg) translateY(-9px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes scrollCards {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Grain overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px",
      }} />

      {/* Radial glow */}
      <div style={{
        position: "absolute",
        top: "50%", left: isMobile ? "50%" : "28%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
        zIndex: 1, pointerEvents: "none",
      }} />

      {/* Top rule */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(249,115,22,0.4), transparent)",
        zIndex: 2,
      }} />

      {/* Main layout */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: "1200px", margin: "0 auto",
        padding: isMobile ? "100px 1.5rem 100px" : "0 2rem",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: "0",
        width: "100%",
        alignItems: "center",
        minHeight: "100vh",
      }}>

        {/* LEFT — Text */}
        <div style={{ paddingTop: isMobile ? "0" : "80px", paddingBottom: isMobile ? "0" : "80px" }}>

          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "rgba(249,115,22,0.08)",
            border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: "999px", padding: "6px 14px", marginBottom: "32px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", boxShadow: "0 0 6px #f97316", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Now Delivering Near You</span>
          </div>

          {/* Heading */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}>
            <div style={{ fontSize: "clamp(44px, 6.5vw, 88px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-3px", marginBottom: "16px" }}>
              <div style={{ color: "#fff" }}>Food That</div>
              <div style={{ color: "#fff" }}>Feels Like</div>
              <div style={{ color: "transparent", WebkitTextStroke: "2px #f97316", fontStyle: "italic" }}>Home.</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: "48px", height: "3px", backgroundColor: "#f97316",
            borderRadius: "2px", marginBottom: "24px",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.3s",
          }} />

          {/* Description */}
          <p style={{
            color: "#666", fontSize: "16px", lineHeight: 1.75,
            maxWidth: "400px", marginBottom: "40px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
          }}>
            Premium meals crafted by award-winning chefs, delivered hot to your door in under 30 minutes. No compromises.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: "14px", flexWrap: "wrap",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s",
          }}>
            <Link href="/menu" style={{
              backgroundColor: "#f97316", color: "#fff",
              padding: "15px 36px", borderRadius: "999px",
              fontSize: "14px", fontWeight: 700, textDecoration: "none",
              letterSpacing: "0.3px",
              boxShadow: "0 0 40px rgba(249,115,22,0.3), 0 4px 20px rgba(249,115,22,0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(249,115,22,0.45), 0 8px 30px rgba(249,115,22,0.3)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(249,115,22,0.3), 0 4px 20px rgba(249,115,22,0.2)" }}
            >
              Order Now →
            </Link>
            <Link href="/offers" style={{
              backgroundColor: "transparent", color: "#fff",
              padding: "15px 36px", borderRadius: "999px",
              fontSize: "14px", fontWeight: 600, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              letterSpacing: "0.3px",
              transition: "border-color 0.2s, background 0.2s",
              display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"; e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.06)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.backgroundColor = "transparent" }}
            >
              View Offers
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: isMobile ? "24px" : "36px", marginTop: "52px",
            flexWrap: "wrap",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.7s ease 0.6s",
          }}>
            {[["50K+", "Happy Customers"], ["4.9★", "Average Rating"], ["<30m", "Delivery Time"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{val}</div>
                <div style={{ fontSize: "11px", color: "#555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Desktop: floating cards, Mobile: horizontal scroll strip */}
        {!isMobile ? (
          <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
            {/* bg image */}
            <div style={{
              position: "absolute", inset: "10% 0 10% 10%",
              borderRadius: "24px",
              backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80')",
              backgroundSize: "cover", backgroundPosition: "center",
              filter: "brightness(0.5) saturate(0.8)",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.9s ease 0.2s",
            }} />
            <div style={{
              position: "absolute", inset: "10% 0 10% 10%",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, transparent 60%)",
            }} />

            {/* Floating cards */}
            {[
              { ...floatingCards[0], top: "10%", left: "5%", rotate: "-4deg", anim: "floatCard0" },
              { ...floatingCards[1], top: "20%", left: "52%", rotate: "4deg", anim: "floatCard1" },
              { ...floatingCards[2], top: "58%", left: "8%", rotate: "-2deg", anim: "floatCard2" },
              { ...floatingCards[3], top: "62%", left: "52%", rotate: "6deg", anim: "floatCard3" },
            ].map((card, i) => (
              <div key={card.id} style={{
                position: "absolute", top: card.top, left: card.left, zIndex: 20,
                opacity: mounted ? 1 : 0,
                transform: mounted ? `rotate(${card.rotate})` : `rotate(${card.rotate}) translateY(20px)`,
                transition: `opacity 0.7s ease ${card.delay}, transform 0.7s ease ${card.delay}`,
                animation: mounted ? `${card.anim} ${3.5 + i * 0.5}s ease-in-out infinite` : "none",
              }}>
                <div style={{
                  backgroundColor: "rgba(15,15,15,0.88)", backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
                  overflow: "hidden", width: "140px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}>
                  <img src={card.image} alt={card.name} style={{ width: "100%", height: "90px", objectFit: "cover" }} />
                  <div style={{ padding: "10px 12px" }}>
                    <p style={{ color: "#fff", fontSize: "11px", fontWeight: 700, margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#f97316", fontSize: "12px", fontWeight: 800 }}>{card.price}</span>
                      <span style={{ color: "#fbbf24", fontSize: "10px", fontWeight: 600 }}>★ {card.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 30 min badge */}
            <div style={{
              position: "absolute", bottom: "18%", right: "4%", zIndex: 20,
              backgroundColor: "#f97316", borderRadius: "16px",
              padding: "14px 18px", textAlign: "center",
              boxShadow: "0 8px 32px rgba(249,115,22,0.4)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "scale(1)" : "scale(0.8)",
              transition: "opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s",
            }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>30</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>min</div>
            </div>
          </div>
        ) : (
          /* Mobile: auto-scrolling card strip */
          <div style={{ marginTop: "40px", overflow: "hidden", marginLeft: "-1.5rem", marginRight: "-1.5rem" }}>
            <div style={{
              display: "flex", gap: "14px",
              animation: "scrollCards 18s linear infinite",
              width: "max-content", padding: "8px 1.5rem",
            }}>
              {[...floatingCards, ...floatingCards].map((card, i) => (
                <div key={i} style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px", overflow: "hidden", width: "130px", flexShrink: 0,
                }}>
                  <img src={card.image} alt={card.name} style={{ width: "100%", height: "80px", objectFit: "cover" }} />
                  <div style={{ padding: "8px 10px" }}>
                    <p style={{ color: "#fff", fontSize: "10px", fontWeight: 700, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#f97316", fontSize: "11px", fontWeight: 800 }}>{card.price}</span>
                      <span style={{ color: "#fbbf24", fontSize: "10px" }}>★ {card.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom ticker */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)",
        padding: "12px 1.5rem",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <span style={{ fontSize: "10px", color: "#f97316", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", whiteSpace: "nowrap" }}>Live</span>
        <div style={{ width: "1px", height: "14px", backgroundColor: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
        <span style={{
          fontSize: "12px", color: "#777", fontWeight: 500,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {tickers[tickerIndex]}
        </span>
      </div>
    </section>
  )
}