"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useMenuData } from "@/lib/menuData"
import { useUserAuth } from "@/context/UserAuthContext"

export function Navbar() {
  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { cartCount } = useCart()
  const { items, categories } = useMenuData()
  const { user } = useUserAuth()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const q = search.toLowerCase().trim()

  const matchedItems = q ? items.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.desc.toLowerCase().includes(q) ||
    i.category.toLowerCase().includes(q)
  ) : []

  const matchedCategories = q ? categories.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.slug.toLowerCase().includes(q)
  ) : []

  const PREVIEW_ITEMS = 3
  const PREVIEW_CATS = 2
  const previewItems = matchedItems.slice(0, PREVIEW_ITEMS)
  const previewCats = matchedCategories.slice(0, PREVIEW_CATS)
  const hasMore = matchedItems.length > PREVIEW_ITEMS || matchedCategories.length > PREVIEW_CATS
  const totalResults = matchedItems.length + matchedCategories.length

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch("")
      setShowDropdown(false)
    }
  }

  const handleViewMore = () => {
    router.push(`/search?q=${encodeURIComponent(search.trim())}`)
    setSearch("")
    setShowDropdown(false)
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    setShowDropdown(q.length >= 2 && totalResults > 0)
  }, [q, totalResults])

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; }
        .nav-link { color: #fff; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: #f97316; transition: width 0.2s; border-radius: 2px; }
        .nav-link:hover::after { width: 100%; }
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-search { display: flex; }
        .nav-signin { display: flex; }
        .nav-ordernow { display: flex; }
        .nav-account-desktop { display: flex; }
        .mobile-menu { display: none; }
        .mobile-cart { display: none; }
        .dropdown-item:hover { background: rgba(255,255,255,0.04) !important; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-search { display: none; }
          .nav-signin { display: none; }
          .nav-ordernow { display: none; }
          .nav-account-desktop { display: none; }
          .mobile-menu { display: flex; }
          .mobile-cart { display: flex; }
          .desktop-cart { display: none; }
        }
      `}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 1.25rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "'DM Sans', sans-serif",
        width: "100%", overflow: "hidden",
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", boxShadow: "0 4px 12px rgba(249,115,22,0.3)", flexShrink: 0,
          }}>🍴</div>
          <div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "16px", letterSpacing: "-0.5px" }}>Foodie</span>
            <span style={{ color: "#f97316", fontWeight: 800, fontSize: "16px", letterSpacing: "-0.5px" }}>Express</span>
          </div>
        </Link>

        {/* Nav Links — desktop only */}
        <div className="nav-links">
          {[["Categories", "/categories"], ["Offers", "/offers"], ["About", "/about"]].map(([label, href]) => (
            <Link key={label} href={href} className="nav-link">{label}</Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

          {/* Search — desktop only */}
          <div ref={searchRef} className="nav-search" style={{ position: "relative" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: searchFocused ? "#1f1f1f" : "#161616",
              border: `1px solid ${searchFocused ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: showDropdown ? "14px 14px 0 0" : "999px",
              padding: "8px 6px 8px 16px",
              transition: "all 0.2s",
              boxShadow: searchFocused ? "0 0 0 3px rgba(249,115,22,0.08)" : "none",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={searchFocused ? "#f97316" : "#555"} strokeWidth="2.5" style={{ transition: "stroke 0.2s", flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search cravings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "13px", width: "140px" }}
              />
              {search.trim() && (
                <button onClick={handleViewMore} style={{
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  border: "none", borderRadius: "999px", cursor: "pointer",
                  padding: "4px 12px", color: "#fff", fontSize: "12px", fontWeight: 700, flexShrink: 0,
                }}>Go</button>
              )}
            </div>

            {/* Search Dropdown */}
            {showDropdown && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                backgroundColor: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderTop: "1px solid rgba(249,115,22,0.2)",
                borderRadius: "0 0 16px 16px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                zIndex: 100,
              }}>
                {previewCats.length > 0 && (
                  <div>
                    <div style={{ padding: "10px 14px 6px" }}>
                      <span style={{ color: "#f97316", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>Categories</span>
                    </div>
                    {previewCats.map(cat => (
                      <Link key={cat.slug} href={`/menu/${cat.slug}`}
                        onClick={() => { setSearch(""); setShowDropdown(false) }}
                        className="dropdown-item"
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", textDecoration: "none", transition: "background 0.15s", backgroundColor: "transparent" }}
                      >
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", overflow: "hidden", flexShrink: 0 }}>
                          <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} />
                        </div>
                        <div>
                          <div style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>{cat.name}</div>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>{cat.items.length} items</div>
                        </div>
                        <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>→</div>
                      </Link>
                    ))}
                  </div>
                )}
                {previewCats.length > 0 && previewItems.length > 0 && (
                  <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.05)", margin: "4px 0" }} />
                )}
                {previewItems.length > 0 && (
                  <div>
                    <div style={{ padding: "10px 14px 6px" }}>
                      <span style={{ color: "#f97316", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>Menu Items</span>
                    </div>
                    {previewItems.map(item => (
                      <div key={item.id} className="dropdown-item"
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", transition: "background 0.15s", cursor: "pointer", backgroundColor: "transparent" }}
                      >
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", overflow: "hidden", flexShrink: 0 }}>
                          <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: "#fff", fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>{item.category}</div>
                        </div>
                        <div style={{ color: "#f97316", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>${item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
                {hasMore && (
                  <button onClick={handleViewMore} style={{
                    width: "100%", padding: "12px 14px",
                    backgroundColor: "rgba(249,115,22,0.08)",
                    borderTop: "1px solid rgba(249,115,22,0.15)",
                    border: "none", cursor: "pointer",
                    color: "#f97316", fontSize: "13px", fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.15)")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.08)")}
                  >
                    View all {totalResults} results →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Account — desktop only */}
          <div className="nav-account-desktop">
            {user ? (
              <Link href="/account" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "36px", height: "36px", borderRadius: "50%",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff", fontWeight: 800, fontSize: "14px", textDecoration: "none",
                boxShadow: "0 2px 8px rgba(249,115,22,0.4)", flexShrink: 0,
              }}>
                {user.displayName?.[0]?.toUpperCase() ?? "U"}
              </Link>
            ) : (
              <Link href="/account/login" className="nav-signin" style={{
                color: "#aaa", fontSize: "13px", fontWeight: 600, textDecoration: "none",
                padding: "8px 16px", borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#aaa" }}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Cart — desktop only */}
          <Link href="/cart" className="desktop-cart" style={{
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            width: "42px", height: "42px", borderRadius: "12px",
            backgroundColor: "#161616", border: "1px solid rgba(255,255,255,0.06)",
            textDecoration: "none", transition: "all 0.2s", flexShrink: 0,
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
                border: "2px solid #0a0a0a", boxShadow: "0 2px 8px rgba(249,115,22,0.5)",
              }}>
                {cartCount > 9 ? "9+" : cartCount}
              </div>
            )}
          </Link>

          {/* Order Now — desktop only */}
          <Link href="/categories" className="nav-ordernow" style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff", padding: "10px 20px", borderRadius: "999px",
            fontSize: "13px", fontWeight: 700, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
            transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(249,115,22,0.5)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.35)" }}
          >
            Order Now →
          </Link>

          {/* Mobile: Cart + Hamburger */}
          <Link href="/cart" className="mobile-cart" style={{
            position: "relative", alignItems: "center", justifyContent: "center",
            width: "40px", height: "40px", borderRadius: "10px",
            backgroundColor: "#161616", border: "1px solid rgba(255,255,255,0.06)",
            textDecoration: "none", flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <div style={{
                position: "absolute", top: "-5px", right: "-5px",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff", width: "17px", height: "17px", borderRadius: "50%",
                fontSize: "9px", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #0a0a0a",
              }}>
                {cartCount > 9 ? "9+" : cartCount}
              </div>
            )}
          </Link>

          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
            cursor: "pointer", padding: "8px",
            alignItems: "center", justifyContent: "center", width: "40px", height: "40px", flexShrink: 0,
          }}>
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 49,
          backgroundColor: "rgba(10,10,10,0.98)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 1.25rem 24px",
          display: "flex", flexDirection: "column", gap: "4px",
          fontFamily: "'DM Sans', sans-serif",
          maxHeight: "calc(100vh - 64px)", overflowY: "auto",
        }}>

          {/* Mobile Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            backgroundColor: "#161616", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "10px 16px", marginBottom: "8px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search cravings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && search.trim()) {
                  router.push(`/search?q=${encodeURIComponent(search.trim())}`)
                  setSearch("")
                  setMenuOpen(false)
                }
              }}
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "14px", width: "100%", fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          {/* Nav Links */}
          {[["Categories", "/categories"], ["Offers", "/offers"], ["About", "/about"]].map(([label, href]) => (
            <Link key={label} href={href}
              onClick={() => setMenuOpen(false)}
              style={{ color: "#aaa", textDecoration: "none", fontSize: "15px", fontWeight: 600, padding: "12px 16px", borderRadius: "12px", transition: "all 0.15s", display: "block" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.backgroundColor = "#161616" }}
              onMouseLeave={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.backgroundColor = "transparent" }}
            >{label}</Link>
          ))}

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

          {/* Account */}
          {user ? (
            <Link href="/account" onClick={() => setMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: "12px", color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: 600, padding: "12px 16px", borderRadius: "12px", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#161616" }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent" }}
            >
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                {user.displayName?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{user.displayName ?? "My Account"}</div>
                <div style={{ fontSize: "11px", color: "#555" }}>{user.email}</div>
              </div>
            </Link>
          ) : (
            <Link href="/account/login" onClick={() => setMenuOpen(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: "#f97316", color: "#fff",
                textDecoration: "none", fontSize: "14px", fontWeight: 700,
                padding: "13px 16px", borderRadius: "12px",
                boxShadow: "0 0 20px rgba(249,115,22,0.25)",
              }}
            >
              Sign In / Create Account →
            </Link>
          )}

          {/* Order Now mobile */}
          <Link href="/categories" onClick={() => setMenuOpen(false)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "transparent", color: "#fff",
              textDecoration: "none", fontSize: "14px", fontWeight: 600,
              padding: "13px 16px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)", marginTop: "4px",
            }}
          >
            Order Now →
          </Link>
        </div>
      )}
    </>
  )
}