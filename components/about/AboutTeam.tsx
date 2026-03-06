"use client"

const team = [
      { name: "Marco Rossi", role: "Head Chef & Founder", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80", bio: "25 years of culinary mastery across Italy and France." },
      { name: "Sophia Chen", role: "Pastry Chef", image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80", bio: "Award-winning pastry artist with a love for bold flavors." },
      { name: "James Okafor", role: "Grill Master", image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&q=80", bio: "Specialist in fire-cooked meats and smoky BBQ traditions." },
      { name: "Aisha Patel", role: "Operations Director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", bio: "Keeps everything running smoothly so your food arrives on time." },
    ]
    
    export function AboutTeam() {
      return (
        <section style={{ padding: "80px 2rem", maxWidth: "1100px", margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ color: "#f97316", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>The People Behind the Food</p>
            <h2 style={{ fontSize: "36px", fontWeight: 800, color: "#111", letterSpacing: "-1px", margin: 0 }}>Meet Our Team</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {team.map(member => (
              <div key={member.name} style={{ backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #f0f0f0", textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
              >
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                </div>
                <div style={{ padding: "18px" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#111", marginBottom: "4px" }}>{member.name}</h3>
                  <p style={{ color: "#f97316", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>{member.role}</p>
                  <p style={{ color: "#888", fontSize: "12px", lineHeight: 1.6, margin: 0 }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )
    }