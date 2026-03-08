"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

const navItems = [
  { href: "/dashboard",           icon: "📊", label: "Overview"   },
  { href: "/dashboard/orders",    icon: "🧾", label: "Orders"     },
  { href: "/dashboard/menu",      icon: "🍽️", label: "Menu Items" },
  { href: "/dashboard/offers",    icon: "🏷️", label: "Offers"     },
  { href: "/dashboard/bundles",   icon: "🧩", label: "Bundles"    },
  { href: "/dashboard/customers", icon: "👥", label: "Customers"  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/dashboard/login")
  }

  const NavContent = () => (
    <>
      <div style={{ padding: "24px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🍕</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "15px", color: "#111" }}>FoodDash</div>
          <div style={{ fontSize: "11px", color: "#999" }}>Admin Panel</div>
        </div>
        {/* Mobile close button */}
        <button onClick={() => setMobileOpen(false)} className="sidebar-close" style={{ marginLeft: "auto", background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#999", display: "none" }}>✕</button>
      </div>

      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "1px", padding: "0 8px 10px" }}>MAIN MENU</div>
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "10px", marginBottom: "4px",
              fontSize: "14px", fontWeight: active ? 700 : 500,
              color: active ? "#f97316" : "#555",
              backgroundColor: active ? "rgba(249,115,22,0.08)" : "transparent",
              textDecoration: "none", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: "16px 12px", borderTop: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", marginBottom: "8px", backgroundColor: "#fafafa", borderRadius: "10px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>👤</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email?.split("@")[0]}</div>
            <div style={{ fontSize: "10px", color: "#bbb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #f0f0f0", backgroundColor: "#fff", color: "#999", fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.05)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#ef4444" }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.color = "#999" }}
        ><span style={{ fontSize: "14px" }}>🚪</span>Sign Out</button>
        <div style={{ fontSize: "10px", color: "#ddd", textAlign: "center", marginTop: "12px" }}>v1.0.0 · Free tier</div>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        .sidebar-close { display: none !important; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile-btn { display: flex !important; }
          .sidebar-overlay { display: ${mobileOpen ? "block" : "none"} !important; }
          .sidebar-drawer { transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"} !important; }
          .sidebar-close { display: flex !important; }
          .dashboard-main { margin-left: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="sidebar-desktop" style={{ width: "220px", minHeight: "100vh", backgroundColor: "#fff", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", position: "fixed", top: 0, left: 0, zIndex: 50 }}>
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="sidebar-mobile-btn" style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, height: "56px", backgroundColor: "#fff", borderBottom: "1px solid #f0f0f0", zIndex: 49, alignItems: "center", padding: "0 16px", gap: "12px", fontFamily: "'DM Sans', sans-serif" }}>
        <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "1px solid #f0f0f0", borderRadius: "8px", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>☰</button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🍕</div>
          <span style={{ fontWeight: 800, fontSize: "15px", color: "#111" }}>FoodDash</span>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} style={{ display: "none", position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 98 }} />

      {/* Mobile drawer */}
      <aside className="sidebar-drawer" style={{ position: "fixed", top: 0, left: 0, width: "260px", height: "100vh", backgroundColor: "#fff", zIndex: 99, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", transition: "transform 0.25s ease", transform: "translateX(-100%)", overflowY: "auto", boxShadow: "4px 0 24px rgba(0,0,0,0.15)" }}>
        <NavContent />
      </aside>
    </>
  )
}