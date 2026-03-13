"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

const categories = [
  { name:"Authentic Pizzas",  slug:"pizzas",   desc:"Traditional wood-fired crusts topped with San Marzano tomatoes and premium buffalo mozzarella.", image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" },
  { name:"Gourmet Burgers",   slug:"burgers",  desc:"Hand-pressed premium wagyu beef, house-made brioche buns, and our secret signature truffle sauce.", image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
  { name:"Artisan Pasta",     slug:"pasta",    desc:"Hand-rolled dough made daily, paired with authentic regional sauces from across Italy.", image:"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80" },
  { name:"Fresh Salads",      slug:"salads",   desc:"Seasonal greens sourced from local farms with unique house-made vinaigrettes.", image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80" },
  { name:"Signature Steaks",  slug:"steaks",   desc:"Dry-aged prime cuts, flame-grilled to your preference and served with roasted bone marrow.", image:"https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" },
  { name:"Decadent Desserts", slug:"desserts", desc:"Artisan pastries and sweet creations crafted daily by our award-winning pastry chef.", image:"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80" },
]

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#f97316">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const ArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

export function CategoryGrid() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [cols, setCols] = useState(3)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setCols(w < 600 ? 1 : w < 1024 ? 2 : 3)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const isMobile = cols === 1

  return (
    <section style={{
      backgroundColor: "#fafaf8",
      padding: isMobile ? "48px 1.25rem 56px" : "80px 2rem",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #111",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        .cg-btn:hover {
          background-color: #f97316 !important;
          color: #fff !important;
          border-color: #f97316 !important;
          box-shadow: 3px 3px 0px #c2540a !important;
        }
      `}</style>

      {/* Dot grid bg */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.2, backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize:"36px 36px" }} />
      {/* Warm blob */}
      <div style={{ position:"absolute", top:"-10%", right:"-5%", width:"400px", height:"400px", background:"radial-gradient(circle, #fff3e8 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:2 }}>

        {/* ── Header ── */}
        <div style={{
          display:"flex", justifyContent:"space-between",
          alignItems: isMobile ? "flex-start" : "center",
          marginBottom: isMobile ? "28px" : "48px",
          flexDirection: isMobile ? "column" : "row",
          gap:"16px",
        }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"999px", padding:"5px 14px", marginBottom:"12px", boxShadow:"3px 3px 0px #f97316" }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#f97316", display:"inline-block", animation:"pulse 2s infinite" }} />
              <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne', sans-serif" }}>All Categories</span>
            </div>
            <h2 style={{ fontSize: isMobile ? "32px" : "clamp(28px,4vw,48px)", fontWeight:800, color:"#111", margin:0, letterSpacing:"-2px", lineHeight:1.0, fontFamily:"'Syne', sans-serif" }}>
              Browse by<br />
              <span style={{ color:"#f97316", fontStyle:"italic" }}>Category.</span>
            </h2>
          </div>
          {!isMobile && (
            <p style={{ color:"#999", fontSize:"14px", maxWidth:"260px", lineHeight:1.7, margin:0, textAlign:"right" }}>
              Dishes that keep our customers coming back — crafted with passion.
            </p>
          )}
        </div>

        {/* ── Grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap: isMobile ? "14px" : "16px" }}>
          {categories.map((cat) => {
            const isH = hovered === cat.slug
            return (
              <div
                key={cat.slug}
                onMouseEnter={() => setHovered(cat.slug)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor:"#fff",
                  borderRadius:"18px",
                  overflow:"hidden",
                  border:"2px solid #111",
                  transition:"all 0.25s ease",
                  transform: isH ? "translateY(-5px)" : "translateY(0)",
                  boxShadow: isH ? "6px 6px 0px #f97316" : "4px 4px 0px #111",
                }}
              >
                {/* Image */}
                <div style={{ height: isMobile ? "170px" : "195px", overflow:"hidden", position:"relative" }}>
                  <img
                    src={cat.image} alt={cat.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover", transform: isH ? "scale(1.06)" : "scale(1)", transition:"transform 0.4s ease" }}
                  />
                  {/* Rating */}
                  <div style={{ position:"absolute", top:"10px", right:"10px", backgroundColor:"#fff", border:"2px solid #111", borderRadius:"8px", padding:"3px 8px", display:"flex", alignItems:"center", gap:"4px", boxShadow:"2px 2px 0px #111" }}>
                    <StarIcon />
                    <span style={{ color:"#111", fontSize:"11px", fontWeight:800 }}>4.9</span>
                  </div>
                  {/* Hover top bar */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", backgroundColor:"#f97316", opacity: isH ? 1 : 0, transition:"opacity 0.2s ease" }} />
                  {/* Gradient */}
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 60%)" }} />
                </div>

                {/* Content */}
                <div style={{ padding: isMobile ? "14px" : "18px" }}>
                  <h3 style={{ fontWeight:800, fontSize:"15px", color:"#111", margin:"0 0 6px", letterSpacing:"-0.3px", fontFamily:"'Syne', sans-serif" }}>{cat.name}</h3>
                  <p style={{
                    color:"#999", fontSize:"12px", lineHeight:1.65, margin:"0 0 14px",
                    display:"-webkit-box", WebkitLineClamp:2,
                    WebkitBoxOrient:"vertical" as const, overflow:"hidden",
                  }}>{cat.desc}</p>
                  <Link
                    href={`/menu/${cat.slug}`}
                    className="cg-btn"
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"center", gap:"7px",
                      padding:"10px 16px", borderRadius:"10px",
                      fontSize:"13px", fontWeight:700, textDecoration:"none",
                      transition:"all 0.2s",
                      backgroundColor:"transparent",
                      color:"#f97316",
                      border:"2px solid #f97316",
                      fontFamily:"'Syne', sans-serif",
                      boxShadow:"3px 3px 0px #111",
                      width:"100%", boxSizing:"border-box" as const,
                    }}
                  >
                    <CartIcon /> View Items <ArrowRight />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop:"48px", height:"2px", backgroundColor:"#f0f0f0", borderRadius:"2px" }} />
      </div>
    </section>
  )
}