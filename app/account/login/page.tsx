"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserAuth } from "@/context/UserAuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

// ── Icons ──────────────────────────────────────────────────────────────────
const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

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
    setLoading(true); setError("")
    try {
      await login(email, password)
      router.push("/account")
    } catch (e: any) {
      setError(e.message || "Login failed. Please try again.")
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true); setError("")
    try {
      await loginWithGoogle()
      router.push("/account")
    } catch (e: any) {
      setError(e.message || "Google sign-in failed.")
    } finally { setGoogleLoading(false) }
  }

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "12px 14px 12px 40px",
    borderRadius: "12px", border: "2px solid #e8e8e8",
    fontSize: "14px", outline: "none",
    fontFamily: "'DM Sans', sans-serif", color: "#111",
    boxSizing: "border-box", backgroundColor: "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: "3px 3px 0px #f0f0f0",
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 700,
    color: "#888", textTransform: "uppercase",
    letterSpacing: "0.8px", marginBottom: "8px",
    fontFamily: "'Syne', sans-serif",
  }

  const onFocusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#f97316"
    e.currentTarget.style.boxShadow = "3px 3px 0px #f97316"
  }
  const onFocusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#e8e8e8"
    e.currentTarget.style.boxShadow = "3px 3px 0px #f0f0f0"
  }

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .login-input::placeholder { color: #ccc; }
        .login-input:focus { border-color: #f97316 !important; box-shadow: 3px 3px 0px #f97316 !important; }
        .google-btn:hover { background-color: #f5f5f5 !important; transform: translateY(-1px); box-shadow: 4px 4px 0px #111 !important; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 6px 6px 0px #c2540a !important; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px 80px", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              width: "60px", height: "60px", margin: "0 auto 16px",
              backgroundColor: "#fff3e8", border: "2px solid #111",
              borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "4px 4px 0px #111",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111", letterSpacing: "-1px", margin: "0 0 6px", fontFamily: "'Syne', sans-serif" }}>
              Welcome back
            </h1>
            <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>Sign in to your FoodieExpress account</p>
          </div>

          {/* Card */}
          <div style={{
            backgroundColor: "#fff", borderRadius: "20px",
            border: "2px solid #111", boxShadow: "6px 6px 0px #111",
            overflow: "hidden",
          }}>
            {/* Orange header bar */}
            <div style={{ backgroundColor: "#f97316", padding: "14px 24px", borderBottom: "2px solid #111" }}>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "12px", fontWeight: 700, margin: 0, fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                🍔 FoodieExpress — Customer Login
              </p>
            </div>

            <div style={{ padding: "28px 28px 24px" }}>
              {/* Error */}
              {error && (
                <div style={{
                  backgroundColor: "#fef2f2", border: "2px solid #fca5a5",
                  borderRadius: "12px", padding: "12px 14px", marginBottom: "20px",
                  display: "flex", alignItems: "center", gap: "8px",
                  boxShadow: "2px 2px 0px #fca5a5",
                }}>
                  <AlertIcon />
                  <span style={{ color: "#ef4444", fontSize: "13px", fontWeight: 600 }}>{error}</span>
                </div>
              )}

              {/* Google */}
              <button
                className="google-btn"
                onClick={handleGoogle}
                disabled={googleLoading}
                style={{
                  width: "100%", backgroundColor: "#fff",
                  border: "2px solid #111", borderRadius: "12px",
                  padding: "12px 16px", fontSize: "14px", fontWeight: 700,
                  cursor: googleLoading ? "not-allowed" : "pointer",
                  opacity: googleLoading ? 0.7 : 1, marginBottom: "20px",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  transition: "all 0.15s", color: "#111",
                  boxShadow: "3px 3px 0px #111",
                }}
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
                <div style={{ flex: 1, height: "2px", backgroundColor: "#f0f0f0" }} />
                <span style={{ color: "#ccc", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>OR</span>
                <div style={{ flex: 1, height: "2px", backgroundColor: "#f0f0f0" }} />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Email</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><EmailIcon /></span>
                  <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="you@example.com" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><LockIcon /></span>
                  <input className="login-input" type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="••••••••" style={{ ...inputBase, paddingRight: "44px" }} onFocus={onFocusIn} onBlur={onFocusOut} />
                  <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%", backgroundColor: "#f97316",
                  color: "#fff", border: "2px solid #111",
                  borderRadius: "12px", padding: "14px",
                  fontSize: "15px", fontWeight: 800,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  fontFamily: "'Syne', sans-serif",
                  boxShadow: "4px 4px 0px #111",
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {loading ? "Signing in..." : <><span>Sign In</span><ArrowIcon /></>}
              </button>
            </div>
          </div>

          {/* Footer link */}
          <p style={{ textAlign: "center", color: "#aaa", fontSize: "13px", marginTop: "20px" }}>
            Don't have an account?{" "}
            <Link href="/account/signup" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Sign up free →</Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}