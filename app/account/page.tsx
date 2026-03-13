"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserAuth } from "@/context/UserAuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

// ── Icons ──────────────────────────────────────────────────────────────────
const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const GiftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export default function AccountPage() {
  const { user, loading, logout } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push("/account/login")
  }, [user, loading])

  if (loading || !user) return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: "32px", height: "32px", border: "3px solid #f0f0f0", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </main>
  )

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const initials = user.displayName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U"

  const menuItems = [
    { icon: <BoxIcon />, label: "My Orders", desc: "View and manage your order history", href: "/account/orders", badge: null },
    { icon: <PinIcon />, label: "Saved Addresses", desc: "Manage your delivery addresses", href: "/account/addresses", badge: null },
    { icon: <GiftIcon />, label: "Offers & Rewards", desc: "Your available coupons and points", href: "/offers", badge: "NEW" },
  ]

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg) } }
        .menu-card { transition: all 0.15s ease !important; }
        .menu-card:hover { transform: translateY(-2px) !important; box-shadow: 6px 6px 0px #f97316 !important; border-color: #f97316 !important; }
        .logout-btn:hover { background-color: #fef2f2 !important; border-color: #fca5a5 !important; color: #ef4444 !important; }
      `}</style>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Profile card */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "20px",
          border: "2px solid #111", boxShadow: "6px 6px 0px #111",
          overflow: "hidden", marginBottom: "24px",
        }}>
          {/* Orange header */}
          <div style={{
            backgroundColor: "#f97316",
            padding: "28px 28px 40px",
            borderBottom: "2px solid #111",
            position: "relative",
          }}>
            {/* Dot grid decoration */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
            <div style={{ position: "relative" }}>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px", fontFamily: "'Syne', sans-serif" }}>
                Your Account
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "16px",
                  backgroundColor: "#fff", border: "2px solid #111",
                  boxShadow: "3px 3px 0px #111",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", fontWeight: 800, color: "#f97316",
                  fontFamily: "'Syne', sans-serif", flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif" }}>
                    {user.displayName ?? "Customer"}
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", margin: 0 }}>{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ padding: "0 28px", transform: "translateY(-1px)", display: "flex", gap: "0", borderBottom: "2px solid #111" }}>
            {[
              { label: "Member since", value: new Date(user.metadata?.creationTime ?? Date.now()).getFullYear().toString() },
              { label: "Status", value: "Active" },
              { label: "Tier", value: "Regular" },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                flex: 1, padding: "16px 0",
                textAlign: "center",
                borderRight: i < 2 ? "2px solid #f0f0f0" : "none",
              }}>
                <p style={{ fontSize: "15px", fontWeight: 800, color: "#111", margin: "0 0 2px", fontFamily: "'Syne', sans-serif" }}>{stat.value}</p>
                <p style={{ fontSize: "11px", color: "#aaa", margin: 0, fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Sign out */}
          <div style={{ padding: "16px 28px" }}>
            <button
              className="logout-btn"
              onClick={handleLogout}
              style={{
                backgroundColor: "#fafaf8", color: "#888",
                border: "2px solid #e8e8e8", borderRadius: "12px",
                padding: "10px 20px", fontSize: "13px", fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "7px",
                boxShadow: "3px 3px 0px #f0f0f0",
              }}
            >
              <LogoutIcon />
              Sign Out
            </button>
          </div>
        </div>

        {/* Menu items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {menuItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="menu-card"
              style={{
                display: "flex", alignItems: "center", gap: "16px",
                backgroundColor: "#fff",
                border: "2px solid #111",
                borderRadius: "16px", padding: "20px 24px",
                textDecoration: "none",
                boxShadow: "4px 4px 0px #111",
              }}
            >
              <div style={{
                width: "46px", height: "46px", borderRadius: "14px",
                backgroundColor: "#fff3e8", border: "2px solid #111",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#f97316", flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#111", fontWeight: 800, fontSize: "15px", fontFamily: "'Syne', sans-serif" }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      backgroundColor: "#f97316", color: "#fff",
                      fontSize: "9px", fontWeight: 800, padding: "2px 7px",
                      borderRadius: "999px", letterSpacing: "0.5px",
                      fontFamily: "'Syne', sans-serif",
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div style={{ color: "#aaa", fontSize: "13px", marginTop: "2px" }}>{item.desc}</div>
              </div>
              <div style={{ color: "#f97316", flexShrink: 0 }}>
                <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}