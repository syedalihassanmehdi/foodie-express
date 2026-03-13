"use client"
import { useState, useEffect } from "react"

const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
)

const team = [
  { name:"Marco Rossi",  role:"Head Chef & Founder",  image:"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80", bio:"25 years of culinary mastery across Italy and France." },
  { name:"Sophia Chen",  role:"Pastry Chef",           image:"https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80", bio:"Award-winning pastry artist with a love for bold flavors." },
  { name:"James Okafor", role:"Grill Master",          image:"https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&q=80", bio:"Specialist in fire-cooked meats and smoky BBQ traditions." },
  { name:"Aisha Patel",  role:"Operations Director",   image:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", bio:"Keeps everything running smoothly so your food arrives on time." },
]

export function AboutTeam() {
  const [hovered, setHovered]   = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section style={{
      backgroundColor: "#fff",
      padding: isMobile ? "56px 1.25rem" : "100px 2rem",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #111",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        .team-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
        @media(max-width:900px) { .team-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:500px) { .team-grid { grid-template-columns:1fr !important; } }
        .team-card { transition:all 0.22s ease !important; }
        .team-card:hover { transform:translateY(-6px) !important; }
      `}</style>

      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.13, backgroundImage:"radial-gradient(circle,#f97316 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
      {/* Warm blob */}
      <div style={{ position:"absolute", top:"-60px", left:"-60px", width:"360px", height:"360px", background:"radial-gradient(circle,#fff3e8 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:2 }}>

        {/* ── Header ── */}
        <div style={{ textAlign:isMobile?"left":"center", marginBottom:isMobile?"32px":"56px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"999px", padding:"5px 14px", marginBottom:"14px", boxShadow:"3px 3px 0px #f97316" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#f97316", display:"inline-block", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne',sans-serif" }}>The People Behind the Food</span>
          </div>
          <h2 style={{ fontSize:isMobile?"clamp(28px,8vw,38px)":"clamp(28px,4vw,46px)", fontWeight:800, color:"#111", letterSpacing:"-2px", lineHeight:1.0, margin:0, fontFamily:"'Syne',sans-serif" }}>
            Meet Our <span style={{ color:"#f97316", fontStyle:"italic" }}>Team.</span>
          </h2>
        </div>

        {/* ── Cards ── */}
        <div className="team-grid">
          {team.map(member => {
            const isHov = hovered === member.name
            return (
              <div
                key={member.name}
                className="team-card"
                onMouseEnter={() => setHovered(member.name)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor:"#fff",
                  borderRadius:"18px",
                  overflow:"hidden",
                  border:`2px solid ${isHov ? "#f97316" : "#111"}`,
                  boxShadow: isHov ? "6px 6px 0px #f97316" : "4px 4px 0px #111",
                  textAlign:"center",
                  cursor:"pointer",
                }}
              >
                {/* Photo */}
                <div style={{ height:"200px", overflow:"hidden", position:"relative" }}>
                  <img src={member.image} alt={member.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", transition:"transform 0.4s ease", transform:isHov?"scale(1.05)":"scale(1)" }} />
                  {/* Orange top bar on hover */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px", backgroundColor:"#f97316", transform:isHov?"scaleX(1)":"scaleX(0)", transition:"transform 0.3s ease", transformOrigin:"left" }} />
                  {/* Gradient bottom */}
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(255,255,255,0.15) 0%,transparent 60%)" }} />
                </div>

                {/* Text */}
                <div style={{ padding:"18px 16px 20px" }}>
                  <h3 style={{ fontWeight:800, fontSize:"15px", color:"#111", marginBottom:"4px", fontFamily:"'Syne',sans-serif" }}>{member.name}</h3>
                  <div style={{ display:"inline-block", backgroundColor:"#fff3e8", border:"1.5px solid #f97316", borderRadius:"6px", padding:"3px 10px", marginBottom:"10px" }}>
                    <p style={{ color:"#f97316", fontSize:"10px", fontWeight:700, margin:0, textTransform:"uppercase", letterSpacing:"1px", fontFamily:"'Syne',sans-serif" }}>{member.role}</p>
                  </div>
                  <p style={{ color:"#aaa", fontSize:"12px", lineHeight:1.7, margin:"0 0 14px" }}>{member.bio}</p>

                  {/* LinkedIn chip */}
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", backgroundColor: isHov ? "#f97316" : "#f5f5f5", border:`1.5px solid ${isHov ? "#f97316" : "#e8e8e8"}`, borderRadius:"8px", padding:"6px 12px", transition:"all 0.2s", cursor:"pointer" }}>
                    <span style={{ color: isHov ? "#fff" : "#aaa" }}><LinkedInIcon /></span>
                    <span style={{ color: isHov ? "#fff" : "#aaa", fontSize:"11px", fontWeight:700, fontFamily:"'Syne',sans-serif" }}>Connect</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}