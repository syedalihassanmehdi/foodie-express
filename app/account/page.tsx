"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserAuth } from "@/context/UserAuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function AccountPage() {
  const { user, loading, logout } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push("/account/login")
  }, [user, loading])

  if (loading || !user) return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  )

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 2rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: "#fff" }}>
              {user.displayName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 4px" }}>{user.displayName ?? "Customer"}</h1>
              <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "999px", padding: "8px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)" }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent" }}
          >
            Sign Out
          </button>
        </div>

        {/* Menu */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { icon: "📦", label: "My Orders", desc: "View and manage your order history", href: "/account/orders" },
            { icon: "📍", label: "Saved Addresses", desc: "Manage your delivery addresses", href: "/account/addresses" },
            { icon: "🎁", label: "Offers & Rewards", desc: "Your available coupons and points", href: "/offers" },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "16px",
              backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px", padding: "20px", textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; e.currentTarget.style.backgroundColor = "#161616" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.backgroundColor = "#111" }}
            >
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px", marginBottom: "2px" }}>{item.label}</div>
                <div style={{ color: "#555", fontSize: "13px" }}>{item.desc}</div>
              </div>
              <div style={{ color: "#333", fontSize: "18px" }}>→</div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}