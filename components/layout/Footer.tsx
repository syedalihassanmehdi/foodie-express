"use client"
import Link from "next/link"

export function Footer() {
  return (
    <footer style={{
      backgroundColor: "#0f0f0f",
      color: "#aaa",
      fontFamily: "'DM Sans', sans-serif",
      padding: "56px 2rem 24px",
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        {/* Top grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "48px",
          marginBottom: "48px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ fontSize: "20px" }}>🍴</span>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "17px" }}>FoodieExpress</span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.7, maxWidth: "240px", marginBottom: "20px" }}>
              Redefining the delivery experience with gourmet standards and local passion. Freshness delivered to your door.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {["𝕏", "📸"].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  textDecoration: "none",
                  color: "#aaa",
                }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, fontSize: "14px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Navigation</h4>
            {["Home", "View Menu", "Special Offers", "Track Order"].map(link => (
              <Link key={link} href="#" style={{ display: "block", color: "#888", fontSize: "14px", textDecoration: "none", marginBottom: "10px" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#888")}
              >{link}</Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, fontSize: "14px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Support</h4>
            {["Help Center", "Contact Us", "Terms of Service", "Privacy Policy"].map(link => (
              <Link key={link} href="#" style={{ display: "block", color: "#888", fontSize: "14px", textDecoration: "none", marginBottom: "10px" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#888")}
              >{link}</Link>
            ))}
          </div>

          {/* Hours */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, fontSize: "14px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Opening Hours</h4>
            {[
              ["Mon – Thu", "10am – 11pm"],
              ["Fri – Sat", "10am – 01am"],
              ["Sunday", "11am – 10pm"],
            ].map(([day, time]) => (
              <div key={day} style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "13px", color: "#888" }}>{day}</div>
                <div style={{ fontSize: "13px", color: "#ccc" }}>{time}</div>
              </div>
            ))}
            <div style={{ marginTop: "12px", color: "#f97316", fontSize: "13px", fontWeight: 600 }}>
              📞 +1 (800) FOODIE-EX
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid #1f1f1f",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>
            © 2024 FoodieExpress. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}