"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === "/dashboard/login"

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/dashboard/login")
    }
  }, [user, loading, isLoginPage, router])

  // Login page — render freely, no sidebar, no auth check needed
  if (isLoginPage) {
    return <>{children}</>
  }

  // Still checking auth — show nothing briefly (not black, just transparent)
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid #f0f0f0", borderTopColor: "#f97316", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // Not logged in — don't flash dashboard
  if (!user) return null

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .dashboard-main { margin-left: 0 !important; max-width: 100% !important; padding-top: 72px !important; }
        }
      `}</style>
      <Sidebar />
      <main className="dashboard-main" style={{ marginLeft: "220px", flex: 1, padding: "32px", maxWidth: "calc(100% - 220px)" }}>
        {children}
      </main>
    </div>
  )
}