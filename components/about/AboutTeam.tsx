"use client"

const team = [
  { name: "Marco Rossi", role: "Head Chef & Founder", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80", bio: "25 years of culinary mastery across Italy and France." },
  { name: "Sophia Chen", role: "Pastry Chef", image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80", bio: "Award-winning pastry artist with a love for bold flavors." },
  { name: "James Okafor", role: "Grill Master", image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&q=80", bio: "Specialist in fire-cooked meats and smoky BBQ traditions." },
  { name: "Aisha Patel", role: "Operations Director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", bio: "Keeps everything running smoothly so your food arrives on time." },
]

export function AboutTeam() {
  return (
    <section style={{ backgroundColor: "#0d0d0d", padding: "100px 1.5rem", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media (max-width: 900px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .team-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "100px", padding: "6px 14px", marginBottom: "20px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316" }} />
            <span style={{ color: "#f97316", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>The People Behind the Food</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", margin: 0 }}>Meet Our Team</h2>
        </div>
        <div className="team-grid">
          {team.map(member => (
            <div key={member.name}
              style={{ backgroundColor: "#161616", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center", transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.5)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none" }}
            >
              <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #161616 0%, transparent 60%)" }} />
              </div>
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontWeight: 800, fontSize: "15px", color: "#fff", marginBottom: "4px" }}>{member.name}</h3>
                <p style={{ color: "#f97316", fontSize: "11px", fontWeight: 600, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>{member.role}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", lineHeight: 1.7, margin: 0 }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}