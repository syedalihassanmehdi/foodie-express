"use client"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/context/CartContext"

export function Navbar() {
  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const { cartCount } = useCart()

  return (
    <>
      <style>{`
        .nav-link { color: #fff; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; position: relative; }
        .nav-link:hover { color: #fff; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: #f97316; transition: width 0.2s; border-radius: 2px; }
        .nav-link:hover::after { width: 100%; }
        .mobile-menu { display: none; }
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-search { display: flex; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-search { display: none; }
          .mobile-menu { display: flex; }
        }
      `}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 2rem", height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", boxShadow: "0 4px 12px rgba(249,115,22,0.3)"
          }}>🍴</div>
          <div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.5px" }}>Foodie</span>
            <span style={{ color: "#f97316", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.5px" }}>Express</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="nav-links">
          {[["Categories", "/categories"], ["Offers", "/offers"], ["About", "/about"]].map(([label, href]) => (
            <Link key={label} href={href} className="nav-link">{label}</Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* Search */}
          <div className="nav-search" style={{
            alignItems: "center", gap: "8px",
            backgroundColor: searchFocused ? "#1f1f1f" : "#161616",
            border: `1px solid ${searchFocused ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: "999px", padding: "8px 16px",
            transition: "all 0.2s",
            boxShadow: searchFocused ? "0 0 0 3px rgba(249,115,22,0.08)" : "none",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={searchFocused ? "#f97316" : "#555"} strokeWidth="2.5" style={{ transition: "stroke 0.2s" }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search cravings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "13px", width: "150px" }}
            />
          </div>

          {/* Cart */}
          <Link href="/cart" style={{
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            width: "42px", height: "42px", borderRadius: "12px",
            backgroundColor: "#161616", border: "1px solid rgba(255,255,255,0.06)",
            textDecoration: "none", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"; e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.08)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.backgroundColor = "#161616" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <div style={{
                position: "absolute", top: "-6px", right: "-6px",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff", width: "19px", height: "19px", borderRadius: "50%",
                fontSize: "10px", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #0a0a0a",
                boxShadow: "0 2px 8px rgba(249,115,22,0.5)",
              }}>
                {cartCount > 9 ? "9+" : cartCount}
              </div>
            )}
          </Link>

          {/* Order Now */}
          <Link href="/categories" style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff", padding: "10px 22px", borderRadius: "999px",
            fontSize: "13px", fontWeight: 700, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(249,115,22,0.5)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.35)" }}
          >
            Order Now →
          </Link>

          {/* Mobile hamburger */}
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
            cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column",
            gap: "4px", alignItems: "center", justifyContent: "center", width: "40px", height: "40px",
          }}>
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "68px", left: 0, right: 0, zIndex: 49,
          backgroundColor: "rgba(10,10,10,0.98)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 2rem 24px", display: "flex", flexDirection: "column", gap: "4px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {/* Mobile Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            backgroundColor: "#161616", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "10px 16px", marginBottom: "12px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search cravings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "14px", width: "100%" }}
            />
          </div>

          {[["Categories", "/categories"], ["Offers", "/offers"], ["About", "/about"]].map(([label, href]) => (
            <Link key={label} href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#aaa", textDecoration: "none", fontSize: "15px",
                fontWeight: 600, padding: "12px 16px", borderRadius: "12px",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.backgroundColor = "#161616" }}
              onMouseLeave={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.backgroundColor = "transparent" }}
            >{label}</Link>
          ))}
        </div>
      )}
    </>
  )
}