"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const { login, error } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    try {
      await login(email, password)
      router.push("/dashboard")
    } catch {
      // error is handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <main style={{
      minHeight: "100vh", backgroundColor: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: "1rem",
    }}>
      {/* Glow */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 10,
        backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px", padding: "48px 40px",
        width: "100%", maxWidth: "420px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "52px", height: "52px", borderRadius: "14px",
            backgroundColor: "#f97316", fontSize: "24px", marginBottom: "16px",
          }}>🍽️</div>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            Dashboard Login
          </h1>
          <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>
            Sign in to manage your restaurant
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{ fontSize: "14px" }}>⚠️</span>
            <span style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>{error}</span>
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="admin@restaurant.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "#1a1a1a", color: "#fff", fontSize: "14px",
              outline: "none", fontFamily: "'DM Sans', sans-serif",
              boxSizing: "border-box", transition: "border-color 0.2s",
            }}
            onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", padding: "12px 48px 12px 16px", borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "#1a1a1a", color: "#fff", fontSize: "14px",
                outline: "none", fontFamily: "'DM Sans', sans-serif",
                boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "14px", top: "50%",
                transform: "translateY(-50%)", background: "none",
                border: "none", cursor: "pointer", fontSize: "16px",
                color: "#555", padding: 0,
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
            backgroundColor: loading || !email || !password ? "#333" : "#f97316",
            color: loading || !email || !password ? "#666" : "#fff",
            fontSize: "15px", fontWeight: 700, cursor: loading || !email || !password ? "not-allowed" : "pointer",
            transition: "background 0.2s", fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={e => { if (!loading && email && password) e.currentTarget.style.backgroundColor = "#ea6c0a" }}
          onMouseLeave={e => { if (!loading && email && password) e.currentTarget.style.backgroundColor = "#f97316" }}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        <p style={{ color: "#333", fontSize: "12px", textAlign: "center", marginTop: "24px", lineHeight: 1.6 }}>
          Access restricted to authorized personnel only.<br />
          Contact your administrator to get access.
        </p>
      </div>
    </main>
  )
}