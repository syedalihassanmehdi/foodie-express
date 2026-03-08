// Find the main content wrapper and update marginLeft
// Replace your existing layout with:
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push("/dashboard/login")
  }, [user, loading, router])

  if (loading || !user) return null

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @media (max-width: 768px) {
          .dashboard-main { margin-left: 0 !important; max-width: 100% !important; padding-top: 72px !important; }
        }
      `}</style>
      {/* Sidebar is rendered per page, layout just provides the shell */}
      <main className="dashboard-main" style={{ marginLeft: "220px", flex: 1, padding: "32px", maxWidth: "calc(100% - 220px)", boxSizing: "border-box" }}>
        {children}
      </main>
    </div>
  )
}