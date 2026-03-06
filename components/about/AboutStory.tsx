"use client"
import { useState } from "react"

const milestones = [
  { year: "1998", title: "The Beginning", desc: "Started as a tiny family kitchen with just 3 tables and a dream." },
  { year: "2005", title: "First Restaurant", desc: "Opened our first full restaurant after years of sold-out pop-ups." },
  { year: "2015", title: "City Award", desc: "Won Best Restaurant in the City for the first time — of many." },
  { year: "2024", title: "Going Digital", desc: "Launched FoodieExpress to bring our food to your doorstep." },
]

export function AboutStory() {
  const [active, setActive] = useState(0)

  return (
    <section style={{ padding: "100px 1.5rem", backgroundColor: "#0a0a0a", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "100px", padding: "6px 14px", marginBottom: "20px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316" }} />
            <span style={{ color: "#f97316", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>Who We Are</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1.1, margin: 0 }}>
            Born from a Passion<br />for <span style={{ color: "#f97316", fontStyle: "italic" }}>Real Food</span>
          </h2>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px", alignItems: "start", marginBottom: "80px" }}>
          {/* Image side */}
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: "24px", overflow: "hidden", height: "480px", position: "relative" }}>
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" alt="Our kitchen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "24px", border: "1px solid rgba(249,115,22,0.2)" }} />
              {/* Floating badge */}
              <div style={{ position: "absolute", bottom: "28px", left: "28px", backgroundColor: "#f97316", borderRadius: "16px", padding: "16px 22px" }}>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: "32px", lineHeight: 1 }}>25+</div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", fontWeight: 500, marginTop: "4px" }}>Years of Excellence</div>
              </div>
              {/* Floating rating card */}
              <div style={{ position: "absolute", top: "24px", right: "24px", backgroundColor: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)", borderRadius: "14px", padding: "14px 18px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "#f97316", fontWeight: 900, fontSize: "22px", lineHeight: 1 }}>4.9★</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", marginTop: "4px" }}>50K+ Reviews</div>
              </div>
            </div>

            {/* Stats row below image */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "16px" }}>
              {[
                { value: "50K+", label: "Customers" },
                { value: "120+", label: "Menu Items" },
                { value: "12", label: "Cities" },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: "center", padding: "16px 10px", backgroundColor: "#161616", border: "1px solid rgba(249,115,22,0.15)", borderRadius: "14px" }}>
                  <div style={{ fontWeight: 900, fontSize: "22px", color: "#f97316", letterSpacing: "-1px" }}>{stat.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Text side */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.9, marginBottom: "16px" }}>
              FoodieExpress started as a small family kitchen in 1998. What began as a simple dream — to serve honest, delicious food made from scratch — has grown into one of the most beloved food brands in the city.
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.9, marginBottom: "48px" }}>
              Every ingredient is hand-picked from local farms. Every recipe is tested hundreds of times before it reaches your plate. We believe great food brings people together.
            </p>

            {/* Interactive Timeline */}
            <div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>Our Journey</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {milestones.map((m, i) => (
                  <div
                    key={m.year}
                    onClick={() => setActive(i)}
                    style={{
                      padding: "18px 20px",
                      borderRadius: "14px",
                      cursor: "pointer",
                      backgroundColor: active === i ? "rgba(249,115,22,0.1)" : "transparent",
                      border: `1px solid ${active === i ? "rgba(249,115,22,0.3)" : "transparent"}`,
                      transition: "all 0.2s",
                      display: "flex",
                      gap: "16px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ color: active === i ? "#f97316" : "rgba(255,255,255,0.2)", fontWeight: 900, fontSize: "14px", minWidth: "44px", paddingTop: "2px" }}>{m.year}</span>
                    <div>
                      <div style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{m.title}</div>
                      {active === i && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: 1.6 }}>{m.desc}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom feature strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", padding: "32px", backgroundColor: "#161616", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { icon: "🌿", label: "100% Fresh Ingredients" },
            { icon: "🏆", label: "5x Award Winner" },
            { icon: "🚚", label: "30 Min Delivery" },
            { icon: "❤️", label: "Family Owned" },
          ].map(f => (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
              <span style={{ fontSize: "22px" }}>{f.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 600 }}>{f.label}</span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-story-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}