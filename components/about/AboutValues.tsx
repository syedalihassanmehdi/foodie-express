"use client"

import { useState } from "react"

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
    <section style={{ backgroundColor: "#fff", padding: "80px 2rem", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ color: "#f97316", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>What Drives Us</p>
          <h2 style={{ fontSize: "36px", fontWeight: 800, color: "#111", letterSpacing: "-1px", margin: 0 }}>Our Core Values</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {values.map(v => (
            <div
              key={v.title}
              style={{ padding: "28px", borderRadius: "16px", border: "1px solid #f0f0f0", backgroundColor: "#fafafa", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.07)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
            >
              <div style={{ width: "48px", height: "48px", backgroundColor: "#fff5ee", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "16px" }}>{v.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: "16px", color: "#111", marginBottom: "8px" }}>{v.title}</h3>
              <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}