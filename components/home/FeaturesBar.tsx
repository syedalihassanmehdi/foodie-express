"use client"

export function FeaturesBar() {
  const features = [
    { icon: "⚡", title: "Fast Delivery", subtitle: "Under 30 mins" },
    { icon: "🌿", title: "Fresh Organic", subtitle: "Farm to doorstep" },
    { icon: "⭐", title: "Top Rated", subtitle: "5-star gourmet chefs" },
    { icon: "🕐", title: "24/7 Service", subtitle: "Always open for you" },
  ]

  return (
    <>
      <style>{`
        .features-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
        }
        .feature-card {
          transition: background 0.2s;
        }
        .feature-card:hover {
          background: rgba(249,115,22,0.06) !important;
        }
        .feature-card:hover .feature-icon {
          background: rgba(249,115,22,0.18) !important;
        }
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: repeat(1, 1fr); }
        }
      `}</style>

      <section style={{
        backgroundColor: "#0f0f0f",
        padding: "0 2rem",
        fontFamily: "'DM Sans', sans-serif",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Subtle glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "100px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="features-grid" style={{ position: "relative", zIndex: 2 }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "24px 28px",
                backgroundColor: "transparent",
                borderRight: i < features.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                cursor: "default",
              }}
            >
              <div
                className="feature-icon"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(249,115,22,0.1)",
                  border: "1px solid rgba(249,115,22,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff", letterSpacing: "-0.2px" }}>{f.title}</div>
                <div style={{ fontSize: "12px", color: "#555", marginTop: "3px" }}>{f.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}