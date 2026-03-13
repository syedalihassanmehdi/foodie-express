"use client"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useMenuData } from "@/lib/menuData"

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const ForkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)

export default function MenuPage() {
  const { categories, loading } = useMenuData()

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; }

        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        .menu-cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .menu-cat-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
        @media (max-width: 540px) { .menu-cat-grid { grid-template-columns: 1fr; gap: 14px; } }

        .menu-cat-card {
          text-decoration: none;
          display: block;
          border-radius: 18px;
          overflow: hidden;
          background-color: #fff;
          border: 2px solid #111;
          box-shadow: 4px 4px 0px #111;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .menu-cat-card:hover {
          transform: translateY(-5px);
          box-shadow: 6px 6px 0px #f97316;
        }
        .menu-cat-card:hover .cat-img {
          transform: scale(1.06);
        }
        .menu-cat-card:hover .cat-arrow {
          background-color: #f97316;
          color: #fff;
          border-color: #f97316;
        }
        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .cat-arrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #f97316;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          padding: 6px 12px;
          border: 2px solid #f97316;
          border-radius: 8px;
          transition: all 0.2s;
          background: transparent;
          cursor: pointer;
        }
        .skeleton-card {
          border-radius: 18px;
          overflow: hidden;
          background-color: #fff;
          border: 2px solid #e8e8e8;
        }
      `}</style>

      <Navbar />

      {/* Page Header */}
      <section style={{ padding: "52px 1.25rem 0", maxWidth: "1100px", margin: "0 auto", borderBottom: "2px solid #111", paddingBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "#fff3e8", border: "2px solid #f97316",
              borderRadius: "999px", padding: "5px 14px", marginBottom: "18px",
              boxShadow: "3px 3px 0px #f97316",
            }}>
              <ForkIcon />
              <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>What are you craving?</span>
            </div>

            <h1 style={{
              fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, color: "#111",
              letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 14px",
              fontFamily: "'Syne', sans-serif",
            }}>
              Explore Our<br />
              <span style={{ color: "#f97316", fontStyle: "italic" }}>Menu.</span>
            </h1>

            <p style={{ color: "#888", fontSize: "15px", lineHeight: 1.75, maxWidth: "460px", margin: 0 }}>
              Browse all categories and pick your favourite dish. Fresh ingredients, crafted with passion.
            </p>
          </div>

          {/* Dot grid decoration */}
          <div style={{
            width: "120px", height: "80px", flexShrink: 0,
            backgroundImage: "radial-gradient(circle, #f97316 1.5px, transparent 1.5px)",
            backgroundSize: "18px 18px", opacity: 0.25,
            alignSelf: "flex-end",
          }} />
        </div>
      </section>

      {/* Category Grid */}
      <section style={{ padding: "36px 1.25rem 80px", maxWidth: "1100px", margin: "0 auto" }}>
        {loading ? (
          <div className="menu-cat-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton" style={{ height: "200px" }} />
                <div style={{ padding: "18px" }}>
                  <div className="skeleton" style={{ height: "18px", borderRadius: "6px", marginBottom: "10px", width: "55%" }} />
                  <div className="skeleton" style={{ height: "13px", borderRadius: "6px", marginBottom: "6px", width: "90%" }} />
                  <div className="skeleton" style={{ height: "13px", borderRadius: "6px", width: "70%", marginBottom: "16px" }} />
                  <div className="skeleton" style={{ height: "32px", borderRadius: "8px", width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{
              width: "72px", height: "72px", margin: "0 auto 20px",
              backgroundColor: "#fff3e8", border: "2px solid #f97316",
              borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "4px 4px 0px #f97316",
            }}>
              <ForkIcon />
            </div>
            <h2 style={{ color: "#111", fontSize: "20px", fontWeight: 800, marginBottom: "8px", fontFamily: "'Syne', sans-serif" }}>No categories yet</h2>
            <p style={{ color: "#aaa", fontSize: "14px" }}>Check back soon — we're adding new dishes.</p>
          </div>
        ) : (
          <div className="menu-cat-grid">
            {categories.map((cat, i) => (
              <Link key={`${cat.slug}-${i}`} href={`/menu/${cat.slug}`} className="menu-cat-card">

                {/* Image */}
                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                  <img src={cat.image} alt={cat.name} className="cat-img" />

                  {/* Overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />

                  {/* Orange top bar */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "#f97316" }} />

                  {/* Items count badge */}
                  <div style={{
                    position: "absolute", bottom: "12px", left: "12px",
                    backgroundColor: "#fff", border: "2px solid #111",
                    borderRadius: "8px", padding: "3px 10px",
                    boxShadow: "2px 2px 0px #111",
                  }}>
                    <span style={{ color: "#111", fontSize: "11px", fontWeight: 800 }}>{cat.items.length} items</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "16px 18px 18px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#111", marginBottom: "6px", letterSpacing: "-0.4px", fontFamily: "'Syne', sans-serif" }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.6, marginBottom: "14px" }}>
                    {cat.desc}
                  </p>
                  <span className="cat-arrow">
                    View Menu <ArrowIcon />
                  </span>
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