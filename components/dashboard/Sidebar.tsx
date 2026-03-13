"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

const OverviewIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
const OrdersIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
const MenuIcon      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
const OffersIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
const BundlesIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
const CustomersIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const LogoutIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const HamburgerIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const CloseIcon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>

const navItems = [
  { href: "/dashboard",           Icon: OverviewIcon,  label: "Overview"   },
  { href: "/dashboard/orders",    Icon: OrdersIcon,    label: "Orders"     },
  { href: "/dashboard/menu",      Icon: MenuIcon,      label: "Menu Items" },
  { href: "/dashboard/offers",    Icon: OffersIcon,    label: "Offers"     },
  { href: "/dashboard/bundles",   Icon: BundlesIcon,   label: "Bundles"    },
  { href: "/dashboard/customers", Icon: CustomersIcon, label: "Customers"  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => { await logout(); router.push("/dashboard/login") }

  const NavContent = () => (
    <>
      {/* Brand */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "2px solid #f0f0f0", display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/logo6.png" alt="FoodieExpress" style={{ height: "40px", width: "auto" }} />
        <button onClick={() => setMobileOpen(false)} className="sidebar-close" style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#999", display: "none", padding: "4px" }}>
          <CloseIcon />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#ccc", letterSpacing: "1.2px", padding: "0 8px 10px", fontFamily: "'Inter', sans-serif" }}>MAIN MENU</div>
        {navItems.map(({ href, Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "10px", marginBottom: "3px",
              fontSize: "13px", fontWeight: active ? 700 : 500,
              color: active ? "#f97316" : "#777",
              backgroundColor: active ? "#fff3e8" : "transparent",
              border: active ? "2px solid #f97316" : "2px solid transparent",
              textDecoration: "none", transition: "all 0.15s",
              fontFamily: "'Inter', sans-serif",
              boxShadow: active ? "2px 2px 0px #f97316" : "none",
            }}>
              <span style={{ color: active ? "#f97316" : "#aaa", display: "flex", flexShrink: 0 }}><Icon /></span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "12px 10px 16px", borderTop: "2px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", marginBottom: "8px", backgroundColor: "#fafaf8", borderRadius: "10px", border: "1.5px solid #ebebeb" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "8px", backgroundColor: "#f97316", border: "1.5px solid #111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "11px", fontFamily: "'Inter', sans-serif" }}>{user?.email?.[0]?.toUpperCase() ?? "A"}</span>
          </div>
          <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Inter', sans-serif" }}>{user?.email?.split("@")[0]}</div>
            <div style={{ fontSize: "10px", color: "#bbb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: "100%", padding: "8px 12px", borderRadius: "10px",
          border: "2px solid #f0f0f0", backgroundColor: "#fff",
          color: "#999", fontSize: "13px", fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
          transition: "all 0.15s", fontFamily: "'Inter', sans-serif",
        }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff5f5"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#ef4444" }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.color = "#999" }}
        >
          <LogoutIcon /> Sign Out
        </button>
        <div style={{ fontSize: "10px", color: "#ddd", textAlign: "center", marginTop: "10px", fontFamily: "'Inter', sans-serif" }}>v1.0.0 · Admin</div>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .sidebar-close { display: none !important; }
        @media (max-width: 768px) {
          .sidebar-desktop    { display: none !important; }
          .sidebar-mobile-bar { display: flex !important; }
          .sidebar-overlay    { display: ${mobileOpen ? "block" : "none"} !important; }
          .sidebar-drawer     { transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"} !important; }
          .sidebar-close      { display: flex !important; }
          .dashboard-main     { margin-left: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {/* Desktop */}
      <aside className="sidebar-desktop" style={{ width: "216px", minHeight: "100vh", backgroundColor: "#fff", borderRight: "2px solid #f0f0f0", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif", position: "fixed", top: 0, left: 0, zIndex: 50 }}>
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="sidebar-mobile-bar" style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, height: "54px", backgroundColor: "#fff", borderBottom: "2px solid #f0f0f0", zIndex: 49, alignItems: "center", padding: "0 16px", gap: "12px", fontFamily: "'Inter', sans-serif" }}>
        <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "2px solid #e0e0e0", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>
          <HamburgerIcon />
        </button>
        <img src="/logo6.png" alt="FoodieExpress" style={{ height: "26px", width: "auto" }} />
      </div>

      {/* Overlay */}
      <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} style={{ display: "none", position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.35)", zIndex: 98 }} />

      {/* Mobile drawer */}
      <aside className="sidebar-drawer" style={{ position: "fixed", top: 0, left: 0, width: "252px", height: "100vh", backgroundColor: "#fff", zIndex: 99, display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif", transition: "transform 0.25s ease", transform: "translateX(-100%)", overflowY: "auto", boxShadow: "6px 0 0px #111" }}>
        <NavContent />
      </aside>
    </>
  )
}