"use client"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useMenuData } from "@/lib/menuData"

export default function MenuPage() {
  const { categories, loading } = useMenuData()

  return (
    <main style={{ backgroundColor: "#faf9f7", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <section style={{ padding: "56px 2rem 40px", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ color: "#f97316", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>What are you craving?</p>
        <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#111", letterSpacing: "-1px", marginBottom: "12px" }}>Our Menu</h1>
        <p style={{ color: "#777", fontSize: "16px", lineHeight: 1.7, maxWidth: "520px" }}>
          Browse all categories and pick your favourite dish. Fresh ingredients, crafted with passion.
        </p>
      </section>

      {/* Category Grid */}
      <section style={{ padding: "0 2rem 80px", maxWidth: "1100px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: "#fff", border: "1px solid #f0f0f0" }}>
                <div style={{ height: "180px", backgroundColor: "#f0f0f0", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ padding: "18px" }}>
                  <div style={{ height: "20px", backgroundColor: "#f0f0f0", borderRadius: "6px", marginBottom: "8px", width: "60%" }} />
                  <div style={{ height: "14px", backgroundColor: "#f0f0f0", borderRadius: "6px", width: "90%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {categories.map((cat, i) => (
              <Link
                key={`${cat.slug}-${i}`}
                href={`/menu/${cat.slug}`}
                style={{ textDecoration: "none", borderRadius: "16px", overflow: "hidden", display: "block", backgroundColor: "#fff", border: "1px solid #f0f0f0", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
              >
                <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                  <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", bottom: "10px", right: "10px", backgroundColor: "rgba(0,0,0,0.55)", borderRadius: "999px", padding: "4px 12px" }}>
                    <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{cat.items.length} items</span>
                  </div>
                </div>
                <div style={{ padding: "18px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#111", marginBottom: "6px" }}>{cat.name}</h3>
                  <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.5, marginBottom: "14px" }}>{cat.desc}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#f97316", fontSize: "13px", fontWeight: 600 }}>
                    View Menu →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <Footer />
    </main>
  )
}