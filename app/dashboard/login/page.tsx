"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const EyeIcon    = (): React.ReactElement => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon = (): React.ReactElement => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const WarnIcon   = (): React.ReactElement => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>

export default function LoginPage() {
  const { login, error } = useAuth()
  const router = useRouter()
  const [email, setEmail]               = useState("")
  const [password, setPassword]         = useState("")
  const [loading, setLoading]           = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    try { await login(email, password); router.push("/dashboard") }
    catch {}
    finally { setLoading(false) }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleLogin() }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: "9px",
    border: "1.5px solid #e5e7eb", backgroundColor: "#fff",
    color: "#111", fontSize: "13px", outline: "none",
    fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
    transition: "border-color 0.15s",
  }

  const canSubmit = !loading && !!email && !!password

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: "1rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>

      <div style={{ width: "100%", maxWidth: "380px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img src="/logo6.png" alt="FoodieExpress" style={{ height: "44px", width: "auto", marginBottom: "20px" }} />
          <h1 style={{ color: "#111", fontSize: "18px", fontWeight: 700, margin: "0 0 5px", letterSpacing: "-0.3px", fontFamily: "'Inter', sans-serif" }}>Admin Login</h1>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0, fontFamily: "'Inter', sans-serif" }}>Sign in to manage your restaurant</p>
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "28px", border: "1.5px solid #e5e7eb", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {error && (
            <div style={{ backgroundColor: "#fff5f5", border: "1.5px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <WarnIcon />
              <span style={{ color: "#ef4444", fontSize: "12px", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "6px", fontFamily: "'Inter', sans-serif" }}>Email Address</label>
            <input type="email" placeholder="admin@restaurant.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = "#f97316"}
              onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "6px", fontFamily: "'Inter', sans-serif" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}
                style={{ ...inputStyle, paddingRight: "42px" }}
                onFocus={e => e.currentTarget.style.borderColor = "#f97316"}
                onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
              />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button onClick={handleLogin} disabled={!canSubmit}
            style={{ width: "100%", padding: "11px", borderRadius: "9px", border: "2px solid #111", backgroundColor: canSubmit ? "#f97316" : "#f3f4f6", color: canSubmit ? "#fff" : "#9ca3af", fontSize: "13px", fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'Inter', sans-serif", boxShadow: canSubmit ? "3px 3px 0px #111" : "none", transition: "all 0.15s" }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </div>

        <p style={{ color: "#d1d5db", fontSize: "11px", textAlign: "center", marginTop: "16px", fontFamily: "'Inter', sans-serif" }}>
          Restricted to authorized personnel only
        </p>
      </div>
    </main>
  )
}