"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserAuth } from "@/context/UserAuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function CustomerLogin() {
  const { login, loginWithGoogle } = useUserAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return }
    setLoading(true)
    setError("")
    try {
      await login(email, password)
      router.push("/account")
    } catch (e: any) {
      setError(e.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError("")
    try {
      await loginWithGoogle()
      router.push("/account")
    } catch (e: any) {
      setError(e.message || "Google sign-in failed.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", backgroundColor: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
    padding: "12px 14px", color: "#fff", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
  }

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 1.25rem 80px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>👋</div>
            <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}>Welcome back</h1>
            <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>Sign in to your FoodieExpress account</p>
          </div>

          {/* Card */}
          <div style={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "32px" }}>

            {error && (
              <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>
                {error}
              </div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.04)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px", padding: "13px", fontSize: "14px", fontWeight: 600, cursor: googleLoading ? "not-allowed" : "pointer", opacity: googleLoading ? 0.7 : 1, marginBottom: "20px", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s" }}
              onMouseEnter={e => { if (!googleLoading) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)" }}
              onMouseLeave={e => { if (!googleLoading) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />
              <span style={{ color: "#444", fontSize: "12px", fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: "52px" }}
                  onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <button onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", backgroundColor: "#f97316", color: "#fff", border: "none", borderRadius: "999px", padding: "14px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 30px rgba(249,115,22,0.25)" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#ea6c0a" }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#f97316" }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </div>

          <p style={{ textAlign: "center", color: "#555", fontSize: "13px", marginTop: "20px" }}>
            Don't have an account?{" "}
            <Link href="/account/signup" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Sign up free</Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}