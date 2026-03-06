"use client"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/context/CartContext"

export function Navbar() {
  const [search, setSearch] = useState("")
  const { cartCount } = useCart()

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      backgroundColor: "#0f0f0f", borderBottom: "1px solid #1f1f1f",
      padding: "0 2rem", height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <span style={{ fontSize: "22px" }}>🍴</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.3px" }}>FoodieExpress</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {[["Categories", "/categories"], ["Offers", "/offers"], ["About", "/about"]].map(([label, href]) => (
          <Link key={label} href={href} style={{ color: "#aaa", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
          >{label}</Link>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "999px", padding: "8px 16px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search cravings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "13px", width: "160px" }}
          />
        </div>

        {/* Cart Icon with live badge */}
        <Link href="/cart" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", textDecoration: "none", transition: "border-color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#f97316")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <div style={{
              position: "absolute", top: "-6px", right: "-6px",
              backgroundColor: "#f97316", color: "#fff",
              width: "18px", height: "18px", borderRadius: "50%",
              fontSize: "10px", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #0f0f0f",
            }}>
              {cartCount > 9 ? "9+" : cartCount}
            </div>
          )}
        </Link>

        {/* Order Now */}
        <Link href="/categories" style={{ backgroundColor: "#f97316", color: "#fff", padding: "9px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ea6c0a")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f97316")}
        >
          Order Now
        </Link>

        {/* Avatar */}
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#2a2a2a", border: "2px solid #333", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "16px" }}>
          👤
        </div>
      </div>
    </nav>
  )
}