"use client"
import Link from "next/link"

export function Footer() {
  return (
    <footer style={{
      backgroundColor: "#0a0a0a",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      fontFamily: "'DM Sans', sans-serif",
      padding: "72px 1.5rem 28px",
    }}>
      <style>{`
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 56px; }
        .footer-link { display: block; color: rgba(255,255,255,0.35); font-size: 14px; text-decoration: none; margin-bottom: 12px; transition: color 0.2s; }
        .footer-link:hover { color: #fff; }
        .footer-social { width: 38px; height: 38px; border-radius: 10px; background: #161616; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 15px; text-decoration: none; color: rgba(255,255,255,0.4); transition: all 0.2s; }
        .footer-social:hover { border-color: rgba(249,115,22,0.4); color: #f97316; background: rgba(249,115,22,0.08); }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; } }
        @media (max-width: 500px) { .footer-grid { grid-template-columns: 1fr; gap: 32px; } .footer-bottom { justify-content: center; text-align: center; } }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Top CTA Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))",
          border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: "20px", padding: "32px 36px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "20px", marginBottom: "64px",
        }}>
          <div>
            <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(18px, 3vw, 24px)", letterSpacing: "-0.5px", margin: "0 0 6px" }}>
              Hungry? Order in <span style={{ color: "#f97316" }}>30 minutes</span> or less 🚀
            </h3>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", margin: 0 }}>Fresh food delivered hot to your door, every time.</p>
          </div>
          <Link href="/categories" style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff", padding: "12px 28px", borderRadius: "999px",
            fontSize: "14px", fontWeight: 700, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(249,115,22,0.35)", whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(249,115,22,0.5)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(249,115,22,0.35)" }}
          >
            Order Now →
          </Link>
        </div>

        {/* Main Grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "18px" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "10px",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
              }}>🍴</div>
              <div>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.5px" }}>Foodie</span>
                <span style={{ color: "#f97316", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.5px" }}>Express</span>
              </div>
            </Link>
            <p style={{ fontSize: "14px", lineHeight: 1.8, color: "rgba(255,255,255,0.3)", maxWidth: "240px", marginBottom: "24px" }}>
              Redefining delivery with gourmet standards and local passion. Freshness to your door.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["𝕏", "📸", "💬"].map((icon, i) => (
                <a key={i} href="#" className="footer-social">{icon}</a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, fontSize: "13px", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Navigation</h4>
            {[["Home", "/"], ["View Menu", "/categories"], ["Special Offers", "/offers"], ["About Us", "/about"]].map(([label, href]) => (
              <Link key={label} href={href} className="footer-link">{label}</Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, fontSize: "13px", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Support</h4>
            {["Help Center", "Contact Us", "Terms of Service", "Privacy Policy"].map(link => (
              <a key={link} href="#" className="footer-link">{link}</a>
            ))}
          </div>

          {/* Hours */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, fontSize: "13px", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Opening Hours</h4>
            {[
              ["Mon – Thu", "10am – 11pm"],
              ["Fri – Sat", "10am – 1am"],
              ["Sunday", "11am – 10pm"],
            ].map(([day, time]) => (
              <div key={day} style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>{day}</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{time}</span>
              </div>
            ))}
            <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "999px", padding: "8px 14px" }}>
              <span style={{ fontSize: "14px" }}>📞</span>
              <span style={{ color: "#f97316", fontSize: "13px", fontWeight: 700 }}>+1 (800) FOODIE</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
            © 2024 FoodieExpress. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  )
}