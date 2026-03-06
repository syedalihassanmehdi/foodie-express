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

  // Login page — render without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // Checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#0a0a0a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🍽️</div>
          <p style={{ color: "#555", fontSize: "14px" }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in — render nothing while redirecting
  if (!user) return null

  // Logged in — render dashboard with sidebar
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#fafafa", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  )
}