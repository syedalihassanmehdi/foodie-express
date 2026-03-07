"use client"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useMenuData } from "@/lib/menuData"
import { useCart } from "@/context/CartContext"
import { useState } from "react"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { items, categories, loading } = useMenuData()
  const { addToCart } = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const q = query.toLowerCase()

  const matchedItems = items.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.desc.toLowerCase().includes(q) ||
    i.category.toLowerCase().includes(q)
  )

  const matchedCategories = categories.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.desc.toLowerCase().includes(q) ||
    c.slug.toLowerCase().includes(q)
  )

  const handleAdd = (item: typeof items[0]) => {
    addToCart({ id: item.id, name: item.name, desc: item.desc, image: item.image, price: item.price })
    setAdded(item.id)
    setTimeout(() => setAdded(null), 1500)
  }

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 1.5rem 32px" }}>
        <p style={{ color: "#f97316", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Search Results</p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", margin: "0 0 8px" }}>
          Results for <span style={{ color: "#f97316" }}>"{query}"</span>
        </h1>
        {!loading && (
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
            {matchedItems.length + matchedCategories.length} results found
          </p>
        )}
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 80px" }}>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: "280px", backgroundColor: "#161616", borderRadius: "20px", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </div>
        ) : matchedItems.length === 0 && matchedCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div>
            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "22px", marginBottom: "8px" }}>No results found</h2>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", marginBottom: "28px" }}>Try searching for something else</p>
            <Link href="/categories" style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff",
              padding: "12px 28px", borderRadius: "999px", fontSize: "14px",
              fontWeight: 700, textDecoration: "none",
            }}>Browse All Menu</Link>
          </div>
        ) : (
          <>
            {/* Matched Categories */}
            {matchedCategories.length > 0 && (
              <div style={{ marginBottom: "56px" }}>
                <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px", marginBottom: "20px" }}>
                  Categories <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 500, fontSize: "16px" }}>({matchedCategories.length})</span>
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
                  {matchedCategories.map(cat => (
                    <Link key={cat.slug} href={`/menu/${cat.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        position: "relative", height: "140px", borderRadius: "16px", overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.25s", cursor: "pointer",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"; e.currentTarget.style.transform = "translateY(-4px)" }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)" }}
                      >
                        <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4)" }} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "999px", padding: "3px 10px", width: "fit-content", marginBottom: "6px" }}>
                            <span style={{ color: "#f97316", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Category</span>
                          </div>
                          <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "16px", margin: 0 }}>{cat.name}</h3>
                          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "4px 0 0", lineHeight: 1.4 }}>{cat.items.length} items</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Items */}
            {matchedItems.length > 0 && (
              <div>
                <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px", marginBottom: "20px" }}>
                  Menu Items <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 500, fontSize: "16px" }}>({matchedItems.length})</span>
                </h2>
                <style>{`
                  .search-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                  @media (max-width: 900px) { .search-grid { grid-template-columns: repeat(2, 1fr); } }
                  @media (max-width: 500px) { .search-grid { grid-template-columns: 1fr; } }
                `}</style>
                <div className="search-grid">
                  {matchedItems.map(item => (
                    <div key={item.id} style={{
                      backgroundColor: "#161616", borderRadius: "20px", overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.25s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)" }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none" }}
                    >
                      <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)" }} />
                        {item.rating && (
                          <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", borderRadius: "999px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <span style={{ color: "#f97316", fontSize: "11px" }}>★</span>
                            <span style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>{item.rating}</span>
                          </div>
                        )}
                        {/* Category tag */}
                        <div style={{ position: "absolute", bottom: "10px", left: "10px", backgroundColor: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "999px", padding: "3px 10px" }}>
                          <span style={{ color: "#f97316", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{item.category}</span>
                        </div>
                      </div>
                      <div style={{ padding: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <h3 style={{ fontWeight: 800, fontSize: "15px", color: "#fff", margin: 0 }}>{item.name}</h3>
                          <span style={{ color: "#f97316", fontWeight: 800, fontSize: "15px", marginLeft: "8px", flexShrink: 0 }}>${item.price.toFixed(2)}</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", lineHeight: 1.6, marginBottom: "16px" }}>{item.desc}</p>
                        <button onClick={() => handleAdd(item)} style={{
                          width: "100%", padding: "10px", border: "none", borderRadius: "12px",
                          background: added === item.id ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #f97316, #ea580c)",
                          color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                          boxShadow: added === item.id ? "0 4px 12px rgba(34,197,94,0.3)" : "0 4px 12px rgba(249,115,22,0.3)",
                        }}>
                          {added === item.id ? "✓ Added!" : "+ Add to Cart"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }} />}>
      <SearchResults />
    </Suspense>
  )
}