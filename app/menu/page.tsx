"use client"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useMenuData } from "@/lib/menuData"

export default function MenuPage() {
  const { categories, loading } = useMenuData()

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <style>{`
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .menu-card {
          text-decoration: none;
          border-radius: 20px;
          overflow: hidden;
          display: block;
          background-color: #111;
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .menu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          border-color: rgba(249,115,22,0.25);
        }
        .menu-card:hover .menu-card-img {
          transform: scale(1.06);
          filter: brightness(0.75);
        }
        .menu-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease, filter 0.4s ease;
          filter: brightness(0.6);
        }
        .skeleton {
          background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        @media (max-width: 900px) {
          .menu-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 540px) {
          .menu-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      {/* Header */}
      <section style={{ padding: "56px 1.25rem 40px", maxWidth: "1100px", margin: "0 auto", position: "relative" }}>

        {/* Top rule */}
        <div style={{ position: "absolute", top: 0, left: "1.25rem", right: "1.25rem", height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "999px", padding: "6px 16px", marginBottom: "20px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block" }} />
          <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>What are you craving?</span>
        </div>

        <h1 style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 800, color: "#fff",
          letterSpacing: "-1.5px", marginBottom: "14px", lineHeight: 1.1,
        }}>
          Our <span style={{ color: "transparent", WebkitTextStroke: "2px #f97316", fontStyle: "italic" }}>Menu.</span>
        </h1>

        <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.75, maxWidth: "480px", margin: 0 }}>
          Browse all categories and pick your favourite dish. Fresh ingredients, crafted with passion.
        </p>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: "1100px", margin: "0 auto 32px", padding: "0 1.25rem" }}>
        <div style={{ position: "relative" }}>
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)" }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%) rotate(45deg)",
            width: "8px", height: "8px",
            backgroundColor: "#f97316",
            boxShadow: "0 0 10px rgba(249,115,22,0.6)",
          }} />
        </div>
      </div>

      {/* Category Grid */}
      <section style={{ padding: "0 1.25rem 80px", maxWidth: "1100px", margin: "0 auto" }}>
        {loading ? (
          <div className="menu-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ borderRadius: "20px", overflow: "hidden", backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="skeleton" style={{ height: "200px" }} />
                <div style={{ padding: "18px" }}>
                  <div className="skeleton" style={{ height: "18px", borderRadius: "6px", marginBottom: "10px", width: "55%" }} />
                  <div className="skeleton" style={{ height: "13px", borderRadius: "6px", marginBottom: "6px", width: "90%" }} />
                  <div className="skeleton" style={{ height: "13px", borderRadius: "6px", width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>No categories yet</h2>
            <p style={{ color: "#555", fontSize: "14px" }}>Check back soon — we're adding new dishes.</p>
          </div>
        ) : (
          <div className="menu-grid">
            {categories.map((cat, i) => (
              <Link
                key={`${cat.slug}-${i}`}
                href={`/menu/${cat.slug}`}
                className="menu-card"
              >
                {/* Image */}
                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="menu-card-img"
                  />
                  {/* Gradient overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />

                  {/* Items count badge */}
                  <div style={{
                    position: "absolute", bottom: "12px", left: "14px",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "999px", padding: "4px 12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                    <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700 }}>{cat.items.length} items</span>
                  </div>

                  {/* Orange top accent on hover */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, #f97316, #ea580c)", opacity: 0.8 }} />
                </div>

                {/* Content */}
                <div style={{ padding: "18px 20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px", letterSpacing: "-0.3px" }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, marginBottom: "16px" }}>
                    {cat.desc}
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    color: "#f97316", fontSize: "13px", fontWeight: 700,
                  }}>
                    View Menu →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}