"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useMenuData } from "@/lib/menuData"
import { useUserAuth } from "@/context/UserAuthContext"
import Image from "next/image";

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
)
const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
)
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
)
const ForkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)

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
  const matchedItems = q ? items.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)) : []
  const matchedCategories = q ? categories.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)) : []
  const previewItems = matchedItems.slice(0, 3)
  const previewCats = matchedCategories.slice(0, 2)
  const hasMore = matchedItems.length > 3 || matchedCategories.length > 2
  const totalResults = matchedItems.length + matchedCategories.length

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch(""); setShowDropdown(false)
    }
  }
  const handleViewMore = () => {
    router.push(`/search?q=${encodeURIComponent(search.trim())}`)
    setSearch(""); setShowDropdown(false)
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false)
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; }

        .nav-link {
          color: #555; text-decoration: none; font-size: 14px; font-weight: 700;
          transition: color 0.2s; position: relative; font-family: 'Syne', sans-serif;
          letter-spacing: -0.2px;
        }
        .nav-link:hover { color: #111; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2.5px; background: #f97316; transition: width 0.2s; border-radius: 2px; }
        .nav-link:hover::after { width: 100%; }

        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-search { display: flex; }
        .nav-account-desktop { display: flex; }
        .desktop-cart { display: flex; }
        .nav-ordernow { display: flex; }
        .mobile-cart { display: none; }
        .mobile-menu-btn { display: none; }

        .nav-search-input::placeholder { color: #bbb; }
        .dropdown-item:hover { background: #fff8f2 !important; }

        .cart-btn:hover { border-color: #f97316 !important; background: #fff3e8 !important; }
        .signin-btn:hover { border-color: #f97316 !important; color: #f97316 !important; }

        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-search { display: none !important; }
          .nav-account-desktop { display: none !important; }
          .desktop-cart { display: none !important; }
          .nav-ordernow { display: none !important; }
          .mobile-cart { display: flex !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: "#fff",
        borderBottom: "2px solid #111",
        padding: "0 1.5rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "'DM Sans', sans-serif",
        width: "100%", overflow: "visible",
        boxShadow: "0 4px 0px #f97316",
      }}>

      
<Link
  href="/"
  style={{
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    flexShrink: 0,
  }}
>
  <Image
    src="/logo6.png"
    alt="Foodie Express Logo"
    width={400}
    height={160}
    priority
    style={{
      height: "44px",
      width: "auto",
      objectFit: "contain",
    }}
  />
</Link>

        {/* Nav Links */}
        <div className="nav-links">
          {[["Categories", "/categories"], ["Offers", "/offers"], ["About", "/about"]].map(([label, href]) => (
            <Link key={label} href={href} className="nav-link">{label}</Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

          {/* Search */}
          <div ref={searchRef} className="nav-search" style={{ position: "relative" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: searchFocused ? "#fff" : "#fafaf8",
              border: `2px solid ${searchFocused ? "#f97316" : "#e0e0e0"}`,
              borderRadius: showDropdown ? "12px 12px 0 0" : "10px",
              padding: "7px 8px 7px 14px",
              transition: "all 0.2s",
              boxShadow: searchFocused ? "3px 3px 0px #f97316" : "2px 2px 0px #e0e0e0",
              color: searchFocused ? "#f97316" : "#aaa",
            }}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search cravings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="nav-search-input"
                style={{ background: "transparent", border: "none", outline: "none", color: "#111", fontSize: "13px", width: "140px", fontFamily: "'DM Sans', sans-serif" }}
              />
              {search.trim() && (
                <button onClick={handleViewMore} style={{
                  backgroundColor: "#f97316", border: "2px solid #111",
                  borderRadius: "8px", cursor: "pointer",
                  padding: "3px 10px", color: "#fff", fontSize: "12px", fontWeight: 700,
                  flexShrink: 0, boxShadow: "2px 2px 0px #111", fontFamily: "'Syne', sans-serif",
                }}>Go</button>
              )}
            </div>

            {/* Search Dropdown */}
            {showDropdown && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                backgroundColor: "#fff",
                border: "2px solid #111", borderTop: "2px solid #f97316",
                borderRadius: "0 0 14px 14px",
                overflow: "hidden",
                boxShadow: "4px 4px 0px #111",
                zIndex: 100,
              }}>
                {previewCats.length > 0 && (
                  <div>
                    <div style={{ padding: "10px 14px 6px" }}>
                      <span style={{ color: "#f97316", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>Categories</span>
                    </div>
                    {previewCats.map(cat => (
                      <Link key={cat.slug} href={`/menu/${cat.slug}`}
                        onClick={() => { setSearch(""); setShowDropdown(false) }}
                        className="dropdown-item"
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", textDecoration: "none", transition: "background 0.15s", backgroundColor: "transparent" }}
                      >
                        <div style={{ width: "34px", height: "34px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1.5px solid #111" }}>
                          <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div>
                          <div style={{ color: "#111", fontWeight: 700, fontSize: "13px", fontFamily: "'Syne', sans-serif" }}>{cat.name}</div>
                          <div style={{ color: "#aaa", fontSize: "11px" }}>{cat.items.length} items</div>
                        </div>
                        <div style={{ marginLeft: "auto", color: "#f97316", fontSize: "12px", fontWeight: 700 }}>→</div>
                      </Link>
                    ))}
                  </div>
                )}
                {previewCats.length > 0 && previewItems.length > 0 && (
                  <div style={{ height: "1px", backgroundColor: "#f0f0f0", margin: "4px 0" }} />
                )}
                {previewItems.length > 0 && (
                  <div>
                    <div style={{ padding: "10px 14px 6px" }}>
                      <span style={{ color: "#f97316", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>Menu Items</span>
                    </div>
                    {previewItems.map(item => (
                      <div key={item.id} className="dropdown-item"
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", transition: "background 0.15s", cursor: "pointer", backgroundColor: "transparent" }}
                      >
                        <div style={{ width: "34px", height: "34px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1.5px solid #111" }}>
                          <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: "#111", fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Syne', sans-serif" }}>{item.name}</div>
                          <div style={{ color: "#aaa", fontSize: "11px" }}>{item.category}</div>
                        </div>
                        <div style={{ color: "#f97316", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>${item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
                {hasMore && (
                  <button onClick={handleViewMore} style={{
                    width: "100%", padding: "11px 14px",
                    backgroundColor: "#fff3e8",
                    borderTop: "2px solid #f97316",
                    border: "none", cursor: "pointer",
                    color: "#f97316", fontSize: "13px", fontWeight: 700,
                    fontFamily: "'Syne', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ffe8cc")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#fff3e8")}
                  >
                    View all {totalResults} results →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Account */}
          <div className="nav-account-desktop">
            {user ? (
              <Link href="/account" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "36px", height: "36px", borderRadius: "10px",
                backgroundColor: "#f97316", border: "2px solid #111",
                boxShadow: "2px 2px 0px #111",
                color: "#fff", fontWeight: 800, fontSize: "14px", textDecoration: "none",
                flexShrink: 0, fontFamily: "'Syne', sans-serif",
              }}>
                {user.displayName?.[0]?.toUpperCase() ?? "U"}
              </Link>
            ) : (
              <Link href="/account/login" className="signin-btn" style={{
                color: "#555", fontSize: "13px", fontWeight: 700, textDecoration: "none",
                padding: "8px 16px", borderRadius: "10px",
                border: "2px solid #e0e0e0",
                boxShadow: "2px 2px 0px #e0e0e0",
                transition: "all 0.2s", whiteSpace: "nowrap",
                fontFamily: "'Syne', sans-serif",
              }}>
                Sign In
              </Link>
            )}
          </div>

          {/* Cart — desktop */}
          <Link href="/cart" className="desktop-cart cart-btn" style={{
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            width: "42px", height: "42px", borderRadius: "12px",
            backgroundColor: "#fafaf8", border: "2px solid #111",
            textDecoration: "none", transition: "all 0.2s", flexShrink: 0,
            boxShadow: "2px 2px 0px #111", color: "#111",
          }}>
            <CartIcon />
            {cartCount > 0 && (
              <div style={{
                position: "absolute", top: "-7px", right: "-7px",
                backgroundColor: "#f97316", border: "2px solid #111",
                color: "#fff", width: "20px", height: "20px", borderRadius: "50%",
                fontSize: "10px", fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Syne', sans-serif",
              }}>
                {cartCount > 9 ? "9+" : cartCount}
              </div>
            )}
          </Link>

          {/* Order Now */}
          <Link href="/categories" className="nav-ordernow" style={{
            backgroundColor: "#f97316", color: "#fff",
            padding: "10px 20px", borderRadius: "10px",
            fontSize: "13px", fontWeight: 700, textDecoration: "none",
            border: "2px solid #111",
            boxShadow: "3px 3px 0px #111",
            transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0,
            fontFamily: "'Syne', sans-serif",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "5px 5px 0px #111" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "3px 3px 0px #111" }}
          >
            Order Now →
          </Link>

          {/* Mobile Cart */}
          <Link href="/cart" className="mobile-cart cart-btn" style={{
            position: "relative", alignItems: "center", justifyContent: "center",
            width: "40px", height: "40px", borderRadius: "10px",
            backgroundColor: "#fafaf8", border: "2px solid #111",
            textDecoration: "none", flexShrink: 0,
            boxShadow: "2px 2px 0px #111", color: "#111",
            display: "none",
          }}>
            <CartIcon />
            {cartCount > 0 && (
              <div style={{
                position: "absolute", top: "-6px", right: "-6px",
                backgroundColor: "#f97316", border: "2px solid #111",
                color: "#fff", width: "18px", height: "18px", borderRadius: "50%",
                fontSize: "9px", fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {cartCount > 9 ? "9+" : cartCount}
              </div>
            )}
          </Link>

          {/* Mobile Hamburger */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "#fafaf8", border: "2px solid #111", borderRadius: "10px",
            cursor: "pointer",
            alignItems: "center", justifyContent: "center",
            width: "40px", height: "40px", flexShrink: 0,
            boxShadow: "2px 2px 0px #111",
            display: "none",
          }}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 49,
          backgroundColor: "#fff",
          borderBottom: "2px solid #111",
          padding: "16px 1.25rem 24px",
          display: "flex", flexDirection: "column", gap: "4px",
          fontFamily: "'DM Sans', sans-serif",
          maxHeight: "calc(100vh - 64px)", overflowY: "auto",
          boxShadow: "0 8px 0px #f97316",
        }}>

          {/* Mobile Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            backgroundColor: "#fafaf8", border: "2px solid #e0e0e0",
            borderRadius: "12px", padding: "10px 14px", marginBottom: "8px",
            boxShadow: "2px 2px 0px #e0e0e0",
            color: "#aaa",
          }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search cravings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && search.trim()) {
                  router.push(`/search?q=${encodeURIComponent(search.trim())}`)
                  setSearch(""); setMenuOpen(false)
                }
              }}
              style={{ background: "transparent", border: "none", outline: "none", color: "#111", fontSize: "14px", width: "100%", fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          {/* Nav Links */}
          {[["Categories", "/categories"], ["Offers", "/offers"], ["About", "/about"]].map(([label, href]) => (
            <Link key={label} href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#555", textDecoration: "none", fontSize: "15px", fontWeight: 700,
                padding: "12px 16px", borderRadius: "10px", transition: "all 0.15s",
                display: "block", fontFamily: "'Syne', sans-serif", border: "2px solid transparent",
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff3e8"; e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316" }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#555" }}
            >{label}</Link>
          ))}

          <div style={{ height: "2px", backgroundColor: "#f0f0f0", margin: "8px 0", borderRadius: "2px" }} />

          {/* Account */}
          {user ? (
            <Link href="/account" onClick={() => setMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: "12px", color: "#111", textDecoration: "none", fontSize: "15px", fontWeight: 700, padding: "12px 16px", borderRadius: "10px", transition: "all 0.15s", border: "2px solid transparent" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff3e8"; e.currentTarget.style.borderColor = "#f97316" }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "transparent" }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#f97316", border: "2px solid #111", boxShadow: "2px 2px 0px #111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "#fff", flexShrink: 0, fontFamily: "'Syne', sans-serif" }}>
                {user.displayName?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#111", fontFamily: "'Syne', sans-serif" }}>{user.displayName ?? "My Account"}</div>
                <div style={{ fontSize: "11px", color: "#aaa" }}>{user.email}</div>
              </div>
            </Link>
          ) : (
            <Link href="/account/login" onClick={() => setMenuOpen(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: "#f97316", color: "#fff",
                textDecoration: "none", fontSize: "14px", fontWeight: 700,
                padding: "13px 16px", borderRadius: "12px",
                border: "2px solid #111", boxShadow: "3px 3px 0px #111",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Sign In / Create Account →
            </Link>
          )}

          <Link href="/categories" onClick={() => setMenuOpen(false)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "#fff", color: "#111",
              textDecoration: "none", fontSize: "14px", fontWeight: 700,
              padding: "13px 16px", borderRadius: "12px", marginTop: "4px",
              border: "2px solid #111", boxShadow: "3px 3px 0px #111",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Order Now →
          </Link>
        </div>
      )}
    </>
  )
}