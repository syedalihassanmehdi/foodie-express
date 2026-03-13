"use client"
import { useEffect, useState } from "react"

const ForkKnifeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)

const stats = [
  { value: "26+", label: "Years Serving" },
  { value: "84k", label: "Happy Customers" },
  { value: "200+", label: "Signature Dishes" },
]

export function AboutHero() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => {
      setIsMobile(window.innerWidth < 600)
      setIsTablet(window.innerWidth < 900)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fafaf8",
      borderBottom: "2px solid #111",
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes float-badge {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes spin-slow {
          from { transform: translateY(-50%) rotate(0deg); }
          to   { transform: translateY(-50%) rotate(360deg); }
        }
        @keyframes spin-slow-inner {
          from { transform: translateY(-50%) rotate(0deg); }
          to   { transform: translateY(-50%) rotate(360deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .about-hero-badge { animation: float-badge 3.6s ease-in-out infinite; }
        .about-hero-ring  { animation: spin-slow 22s linear infinite; }
        .about-hero-ring2 { animation: spin-slow-inner 14s linear infinite reverse; }
        .anim-1 { animation: fade-up 0.65s ease both 0.05s; }
        .anim-2 { animation: fade-up 0.65s ease both 0.18s; }
        .anim-3 { animation: fade-up 0.65s ease both 0.31s; }
        .anim-4 { animation: fade-up 0.65s ease both 0.44s; }
        .anim-5 { animation: fade-up 0.65s ease both 0.57s; }
        .about-stat-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 5px 5px 0px #f97316 !important;
          border-color: #f97316 !important;
        }
      `}</style>

      {/* Dot-grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
        backgroundSize: "30px 30px", opacity: 0.18,
      }} />

      {/* Rotary rings — desktop only */}
      {!isTablet && (
        <>
          <div className="about-hero-ring" style={{
            position: "absolute", right: "-100px", top: "50%",
            width: "500px", height: "500px", borderRadius: "50%",
            border: "2px dashed rgba(249,115,22,0.22)",
            pointerEvents: "none", zIndex: 1,
          }} />
          <div className="about-hero-ring2" style={{
            position: "absolute", right: "-30px", top: "50%",
            width: "360px", height: "360px", borderRadius: "50%",
            border: "1.5px solid rgba(249,115,22,0.12)",
            pointerEvents: "none", zIndex: 1,
          }} />
        </>
      )}

      {/* Orange left bar */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "6px", height: "100%", backgroundColor: "#f97316", borderRight: "2px solid #111", zIndex: 3 }} />

      {/* Main content — fills 100vh via flex */}
      <div style={{
        position: "relative", zIndex: 2,
        flex: 1,
        maxWidth: "1100px", width: "100%", margin: "0 auto",
        padding: isMobile ? "0 1.25rem" : isTablet ? "0 2rem" : "0 2rem",
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: isTablet ? "36px" : "64px",
        paddingTop: isMobile ? "60px" : isTablet ? "72px" : "0",
        paddingBottom: isMobile ? "48px" : isTablet ? "60px" : "0",
      }}>

        {/* ── LEFT TEXT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {mounted && (
            <div className="anim-1" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "#fff3e8", border: "2px solid #f97316",
              borderRadius: "999px", padding: "5px 14px", marginBottom: "22px",
              boxShadow: "3px 3px 0px #f97316", width: "fit-content",
            }}>
              <ForkKnifeIcon />
              <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>Our Story</span>
            </div>
          )}

          {mounted && (
            <h1 className="anim-2" style={{
              fontSize: isMobile ? "clamp(34px,10vw,48px)" : isTablet ? "clamp(44px,7vw,60px)" : "clamp(48px,5.5vw,76px)",
              fontWeight: 800, color: "#111",
              letterSpacing: "-2.5px", lineHeight: 1.0,
              marginBottom: "18px",
              fontFamily: "'Syne', sans-serif",
            }}>
              Crafting<br />
              Memories,<br />
              <span style={{ color: "#f97316", fontStyle: "italic" }}>One Dish</span><br />
              at a Time.
            </h1>
          )}

          {mounted && (
            <div className="anim-3" style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "18px" }}>
              {[36, 12, 6].map((w, i) => (
                <div key={i} style={{ height: "3px", width: `${w}px`, backgroundColor: i === 0 ? "#f97316" : i === 1 ? "rgba(249,115,22,0.45)" : "rgba(249,115,22,0.2)", borderRadius: "2px" }} />
              ))}
            </div>
          )}

          {mounted && (
            <p className="anim-4" style={{
              color: "#666", fontSize: isMobile ? "14px" : "15px",
              maxWidth: "400px", lineHeight: 1.8, marginBottom: "36px",
            }}>
              Since 1998, we've been serving the finest artisanal food with love, passion, and locally sourced ingredients — one unforgettable plate at a time.
            </p>
          )}

          {/* Stats */}
          {mounted && (
            <div className="anim-5" style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: isMobile ? "10px" : "14px",
              maxWidth: isMobile ? "100%" : "400px",
            }}>
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="about-stat-card"
                  style={{
                    backgroundColor: "#fff", border: "2px solid #111",
                    borderRadius: "14px", padding: isMobile ? "12px 8px" : "16px 14px",
                    boxShadow: "4px 4px 0px #111",
                    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: isMobile ? "20px" : "26px", fontWeight: 800, color: "#f97316", fontFamily: "'Syne', sans-serif", letterSpacing: "-1px" }}>{value}</div>
                  <div style={{ fontSize: "10px", color: "#888", fontWeight: 600, marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.7px" }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT PHOTO ── */}
        {mounted && (
          <div style={{
            position: "relative",
            flexShrink: 0,
            width: isTablet ? "100%" : "420px",
            height: isTablet ? (isMobile ? "260px" : "360px") : "520px",
          }}>
            {/* Main photo */}
            <div style={{
              position: "absolute",
              inset: 0,
              bottom: isTablet ? 0 : "48px",
              borderRadius: "20px",
              overflow: "hidden",
              border: "2px solid #111",
              boxShadow: "6px 6px 0px #111",
            }}>
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80"
                alt="Our kitchen"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
            </div>

            {/* Floating award badge — desktop only */}
            {!isTablet && (
              <div className="about-hero-badge" style={{
                position: "absolute", bottom: "0", left: "-32px",
                backgroundColor: "#fff", border: "2px solid #111",
                borderRadius: "16px", padding: "14px 18px",
                boxShadow: "5px 5px 0px #f97316", zIndex: 4,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "40px", height: "40px", backgroundColor: "#fff3e8",
                    border: "2px solid #f97316", borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px",
                  }}>🏆</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "13px", color: "#111", fontFamily: "'Syne', sans-serif" }}>Best Restaurant</div>
                    <div style={{ fontSize: "11px", color: "#888", fontWeight: 500 }}>City Food Awards 2024</div>
                  </div>
                </div>
              </div>
            )}

            {/* Since chip — desktop only */}
            {!isTablet && (
              <div style={{
                position: "absolute", top: "-16px", right: "-16px",
                backgroundColor: "#f97316", border: "2px solid #111",
                borderRadius: "12px", padding: "8px 14px",
                boxShadow: "3px 3px 0px #111", zIndex: 4,
              }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Since 1998</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom orange bar */}
      <div style={{ height: "4px", backgroundColor: "#f97316", flexShrink: 0 }} />
    </section>
  )
}