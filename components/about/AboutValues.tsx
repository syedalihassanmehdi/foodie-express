"use client"

const values = [
  { icon: "🌿", title: "Fresh & Organic", desc: "Every ingredient is sourced from certified local farms, picked fresh daily for maximum flavor and nutrition." },
  { icon: "👨‍🍳", title: "Master Chefs", desc: "Our team of award-winning chefs bring decades of culinary expertise to every dish we create." },
  { icon: "🚚", title: "Fast Delivery", desc: "We guarantee your food arrives hot and fresh within 30 minutes, or your next order is on us." },
  { icon: "♻️", title: "Sustainable", desc: "We use 100% eco-friendly packaging and work hard to minimize our carbon footprint every day." },
  { icon: "❤️", title: "Made with Love", desc: "Every recipe is crafted with care and passion — you'll taste the difference in every single bite." },
  { icon: "🏆", title: "Award Winning", desc: "Recognized as the Best Food Delivery Service for 5 consecutive years by the City Food Awards." },
]

export function AboutValues() {
  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "100px 1.5rem", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .values-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .values-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "100px", padding: "6px 14px", marginBottom: "20px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316" }} />
            <span style={{ color: "#f97316", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>What Drives Us</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", margin: 0 }}>Our Core Values</h2>
        </div>
        <div className="values-grid">
          {values.map(v => (
            <div
              key={v.title}
              style={{ padding: "32px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#161616", transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none" }}
            >
              <div style={{ width: "52px", height: "52px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "20px" }}>{v.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: "17px", color: "#fff", marginBottom: "10px" }}>{v.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: 1.8, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}