"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserAuth } from "@/context/UserAuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

// ── Icons ──────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
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

export default function SignupPage() {
  const { signup } = useUserAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Please enter your full name."); return }
    if (!email.trim()) { setError("Please enter your email."); return }
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return }
    setLoading(true); setError("")
    try {
      await signup(email, password, name.trim())
      router.push("/account")
    } catch (e: any) {
      setError(e.message)
    } finally { setLoading(false) }
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
        .su-input::placeholder { color: #ccc; }
        .su-input:focus { border-color: #f97316 !important; box-shadow: 3px 3px 0px #f97316 !important; }
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111", letterSpacing: "-1px", margin: "0 0 6px", fontFamily: "'Syne', sans-serif" }}>
              Create account
            </h1>
            <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>Join FoodieExpress and order faster</p>
          </div>

          {/* Card */}
          <div style={{
            backgroundColor: "#fff", borderRadius: "20px",
            border: "2px solid #111", boxShadow: "6px 6px 0px #111",
            overflow: "hidden",
          }}>
            {/* Header bar */}
            <div style={{ backgroundColor: "#f97316", padding: "14px 24px", borderBottom: "2px solid #111" }}>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "12px", fontWeight: 700, margin: 0, fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                🍔 FoodieExpress — New Account
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

              {/* Perks strip */}
              <div style={{
                backgroundColor: "#fafaf8", border: "2px solid #e8e8e8",
                borderRadius: "12px", padding: "12px 14px", marginBottom: "22px",
                display: "flex", gap: "16px", flexWrap: "wrap",
              }}>
                {[
                  { icon: "📍", text: "Save addresses" },
                  { icon: "📦", text: "Track orders" },
                  { icon: "🎁", text: "Exclusive offers" },
                ].map(p => (
                  <div key={p.text} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "14px" }}>{p.icon}</span>
                    <span style={{ fontSize: "12px", color: "#888", fontWeight: 600 }}>{p.text}</span>
                  </div>
                ))}
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><UserIcon /></span>
                  <input className="su-input" type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="John Doe" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Email</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><EmailIcon /></span>
                  <input className="su-input" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="you@example.com" style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><LockIcon /></span>
                  <input className="su-input" type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="Min. 6 characters" style={{ ...inputBase, paddingRight: "44px" }} onFocus={onFocusIn} onBlur={onFocusOut} />
                  <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                {/* Strength hint */}
                {password.length > 0 && (
                  <div style={{ marginTop: "8px", display: "flex", gap: "4px" }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: "3px", borderRadius: "2px",
                        backgroundColor: password.length >= i * 3
                          ? (password.length >= 9 ? "#22c55e" : password.length >= 6 ? "#f59e0b" : "#ef4444")
                          : "#e8e8e8",
                        transition: "background-color 0.2s",
                      }} />
                    ))}
                  </div>
                )}
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
                {loading ? "Creating account..." : <><span>Create Account</span><ArrowIcon /></>}
              </button>
            </div>
          </div>

          {/* Footer link */}
          <p style={{ textAlign: "center", color: "#aaa", fontSize: "13px", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/account/login" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Sign in →</Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}