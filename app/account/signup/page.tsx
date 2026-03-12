"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserAuth } from "@/context/UserAuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

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
    setLoading(true)
    setError("")
    try {
      await signup(email, password, name.trim())
      router.push("/account")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", backgroundColor: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
    padding: "12px 14px", color: "#fff", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "12px", fontWeight: 700,
    color: "#666", textTransform: "uppercase",
    letterSpacing: "0.5px", marginBottom: "8px",
  }

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 2rem" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🍔</div>
            <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}>Create account</h1>
            <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>Join FoodieExpress and order faster</p>
          </div>

          <div style={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "32px" }}>

            {error && (
              <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="John Doe"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email</label>
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

            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="Min. 6 characters"
                  style={{ ...inputStyle, paddingRight: "52px" }}
                  onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <button onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", backgroundColor: "#f97316", color: "#fff", border: "none", borderRadius: "999px", padding: "14px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 30px rgba(249,115,22,0.25)" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#ea6c0a" }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#f97316" }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </div>

          <p style={{ textAlign: "center", color: "#555", fontSize: "13px", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/account/login" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}