"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const navItems = [
  { href: "/dashboard",           icon: "📊", label: "Overview"   },
  { href: "/dashboard/orders",    icon: "🧾", label: "Orders"     },
  { href: "/dashboard/menu",      icon: "🍽️", label: "Menu Items" },
  { href: "/dashboard/offers",    icon: "🏷️", label: "Offers"     },
  { href: "/dashboard/customers", icon: "👥", label: "Customers"  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/dashboard/login")
  }

  return (
    <aside style={{
      width: "220px",
      minHeight: "100vh",
      backgroundColor: "#fff",
      borderRight: "1px solid #f0f0f0",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: "24px 20px",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          backgroundColor: "#f97316",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
        }}>🍕</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "15px", color: "#111" }}>FoodDash</div>
          <div style={{ fontSize: "11px", color: "#999" }}>Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "1px", padding: "0 8px 10px" }}>MAIN MENU</div>
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              marginBottom: "4px",
              fontSize: "14px",
              fontWeight: active ? 700 : 500,
              color: active ? "#f97316" : "#555",
              backgroundColor: active ? "rgba(249,115,22,0.08)" : "transparent",
              textDecoration: "none",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid #f0f0f0" }}>
        {/* Logged in user */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 12px", marginBottom: "8px",
          backgroundColor: "#fafafa", borderRadius: "10px",
        }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            backgroundColor: "rgba(249,115,22,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", flexShrink: 0,
          }}>👤</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email?.split("@")[0]}
            </div>
            <div style={{ fontSize: "10px", color: "#bbb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email}
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "9px 12px",
            borderRadius: "10px", border: "1px solid #f0f0f0",
            backgroundColor: "#fff", color: "#999",
            fontSize: "13px", fontWeight: 600,
            cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", gap: "8px",
            transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.05)"
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"
            e.currentTarget.style.color = "#ef4444"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#fff"
            e.currentTarget.style.borderColor = "#f0f0f0"
            e.currentTarget.style.color = "#999"
          }}
        >
          <span style={{ fontSize: "14px" }}>🚪</span>
          Sign Out
        </button>

        <div style={{ fontSize: "10px", color: "#ddd", textAlign: "center", marginTop: "12px" }}>
          v1.0.0 · Free tier
        </div>
      </div>
    </aside>
  )
}