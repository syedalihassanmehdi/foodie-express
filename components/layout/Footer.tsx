"use client"
import Link from "next/link"

const ForkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)
const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
)
const MessageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16z"/>
  </svg>
)
const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
)

export function Footer() {
  return (
    <footer style={{
      backgroundColor: "#fafaf8",
      borderTop: "2px solid #111",
      fontFamily: "'DM Sans', sans-serif",
      padding: "64px 1.5rem 28px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 56px; }
        .footer-link { display: block; color: #888; font-size: 14px; text-decoration: none; margin-bottom: 10px; transition: color 0.2s; font-weight: 500; }
        .footer-link:hover { color: #f97316; }
        .footer-social { width: 38px; height: 38px; border-radius: 10px; background: #fff; border: 2px solid #111; display: flex; align-items: center; justify-content: center; text-decoration: none; color: #555; transition: all 0.2s; box-shadow: 2px 2px 0px #111; }
        .footer-social:hover { border-color: #f97316; color: #f97316; background: #fff3e8; box-shadow: 3px 3px 0px #f97316; transform: translateY(-2px); }
        .footer-bottom { border-top: 2px solid #ebebeb; padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .footer-cta-btn:hover { transform: translateY(-2px) !important; box-shadow: 5px 5px 0px #111 !important; }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; } }
        @media (max-width: 500px) { .footer-grid { grid-template-columns: 1fr; gap: 28px; } .footer-bottom { justify-content: center; text-align: center; } }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* CTA Banner */}
        <div style={{
          backgroundColor: "#fff",
          border: "2px solid #111",
          borderRadius: "20px", padding: "28px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "20px", marginBottom: "56px",
          boxShadow: "6px 6px 0px #f97316",
          position: "relative", overflow: "hidden",
        }}>
          {/* Dot grid accent */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.15, backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#fff3e8", border: "2px solid #f97316", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "3px 3px 0px #f97316" }}>
              <RocketIcon />
            </div>
            <div>
              <h3 style={{ color: "#111", fontWeight: 800, fontSize: "clamp(16px, 2.5vw, 22px)", letterSpacing: "-0.5px", margin: "0 0 4px", fontFamily: "'Syne', sans-serif" }}>
                Hungry? Order in <span style={{ color: "#f97316" }}>30 minutes</span> or less
              </h3>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Fresh food delivered hot to your door, every time.</p>
            </div>
          </div>
          <Link href="/categories" className="footer-cta-btn" style={{
            backgroundColor: "#f97316", color: "#fff",
            padding: "12px 26px", borderRadius: "12px",
            fontSize: "14px", fontWeight: 700, textDecoration: "none",
            border: "2px solid #111", boxShadow: "4px 4px 0px #111",
            transition: "all 0.15s", whiteSpace: "nowrap",
            fontFamily: "'Syne', sans-serif", position: "relative", zIndex: 1,
          }}>
            Order Now →
          </Link>
        </div>

        {/* Main Grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-flex", textDecoration: "none", marginBottom: "16px" }}>
              <img src="/logo6.png" alt="FoodieExpress" style={{ height: "44px", width: "auto", display: "block" }} />
            </Link>
            <p style={{ fontSize: "13px", lineHeight: 1.8, color: "#888", maxWidth: "220px", marginBottom: "20px" }}>
              Redefining delivery with gourmet standards and local passion. Freshness to your door.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[<TwitterIcon />, <InstagramIcon />, <MessageIcon />].map((icon, i) => (
                <a key={i} href="#" className="footer-social">{icon}</a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: "#111", fontWeight: 800, fontSize: "12px", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'Syne', sans-serif" }}>Navigation</h4>
            {[["Home", "/"], ["View Menu", "/categories"], ["Special Offers", "/offers"], ["About Us", "/about"]].map(([label, href]) => (
              <Link key={label} href={href} className="footer-link">{label}</Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ color: "#111", fontWeight: 800, fontSize: "12px", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'Syne', sans-serif" }}>Support</h4>
            {["Help Center", "Contact Us", "Terms of Service", "Privacy Policy"].map(link => (
              <a key={link} href="#" className="footer-link">{link}</a>
            ))}
          </div>

          {/* Hours */}
          <div>
            <h4 style={{ color: "#111", fontWeight: 800, fontSize: "12px", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'Syne', sans-serif" }}>Opening Hours</h4>
            {[["Mon – Thu", "10am – 11pm"], ["Fri – Sat", "10am – 1am"], ["Sunday", "11am – 10pm"]].map(([day, time]) => (
              <div key={day} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: "#aaa" }}>{day}</span>
                <span style={{ fontSize: "13px", color: "#555", fontWeight: 700 }}>{time}</span>
              </div>
            ))}
            <div style={{
              marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "#fff3e8", border: "2px solid #f97316",
              borderRadius: "10px", padding: "8px 14px",
              boxShadow: "2px 2px 0px #f97316",
            }}>
              <PhoneIcon />
              <span style={{ color: "#f97316", fontSize: "13px", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>+1 (800) FOODIE</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>
            © 2024 FoodieExpress. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e", border: "1.5px solid #111" }} />
            <span style={{ fontSize: "13px", color: "#aaa", fontWeight: 500 }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}