"use client"
import { useState, useEffect } from "react"

// ── Icons ────────────────────────────────────────────────────
const LeafIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)
const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="18" width="12" height="4"/>
    <path d="M6 9a6 6 0 0 0 12 0"/>
  </svg>
)
const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f97316">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)

const milestones = [
  { year:"1998", title:"The Beginning",    desc:"Started as a tiny family kitchen with just 3 tables and a dream." },
  { year:"2005", title:"First Restaurant", desc:"Opened our first full restaurant after years of sold-out pop-ups." },
  { year:"2015", title:"City Award",       desc:"Won Best Restaurant in the City for the first time — of many." },
  { year:"2024", title:"Going Digital",    desc:"Launched FoodieExpress to bring our food to your doorstep." },
]

const features = [
  { Icon: LeafIcon,   label:"100% Fresh Ingredients" },
  { Icon: TrophyIcon, label:"5x Award Winner"         },
  { Icon: TruckIcon,  label:"30 Min Delivery"         },
  { Icon: HeartIcon,  label:"Family Owned"            },
]

export function AboutStory() {
  const [active, setActive]     = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section style={{
      padding: isMobile ? "56px 1.25rem" : "100px 2rem",
      backgroundColor: "#fafaf8",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #111",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        .as-grid     { display:grid; grid-template-columns:1fr 1fr; gap:52px; align-items:start; margin-bottom:48px; }
        .as-stats    { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:14px; }
        .as-features { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
        @media(max-width:767px) {
          .as-grid     { grid-template-columns:1fr !important; gap:36px !important; }
          .as-features { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:420px) {
          .as-stats    { grid-template-columns:1fr 1fr !important; }
          .as-features { grid-template-columns:1fr !important; }
        }
        .timeline-row { transition:all 0.2s ease; }
        .timeline-row:hover { border-color:#f97316 !important; }
      `}</style>

      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.14, backgroundImage:"radial-gradient(circle,#f97316 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
      {/* Warm blobs */}
      <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"380px", height:"380px", background:"radial-gradient(circle,#fff3e8 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:2 }}>

        {/* ── Section header ── */}
        <div style={{ marginBottom:isMobile?"36px":"64px", textAlign:isMobile?"left":"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#fff3e8", border:"2px solid #f97316", borderRadius:"999px", padding:"5px 14px", marginBottom:"14px", boxShadow:"3px 3px 0px #f97316" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#f97316", display:"inline-block", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:"11px", color:"#f97316", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Syne',sans-serif" }}>Who We Are</span>
          </div>
          <h2 style={{ fontSize:isMobile?"clamp(28px,8vw,40px)":"clamp(32px,5vw,52px)", fontWeight:800, color:"#111", letterSpacing:"-2px", lineHeight:1.0, margin:0, fontFamily:"'Syne',sans-serif" }}>
            Born from a Passion<br />for <span style={{ color:"#f97316", fontStyle:"italic" }}>Real Food</span>
          </h2>
        </div>

        {/* ── Two-col grid ── */}
        <div className="as-grid">

          {/* LEFT — photo + stats */}
          <div>
            {/* Photo card */}
            <div style={{ borderRadius:"18px", overflow:"hidden", height:isMobile?"260px":"400px", position:"relative", border:"2px solid #111", boxShadow:"6px 6px 0px #f97316" }}>
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" alt="Our kitchen" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)" }} />

              {/* 25+ floating badge */}
              <div style={{ position:"absolute", bottom:"18px", left:"18px", backgroundColor:"#f97316", border:"2px solid #111", borderRadius:"12px", padding:"10px 16px", boxShadow:"3px 3px 0px #111" }}>
                <div style={{ color:"#fff", fontWeight:800, fontSize:"26px", lineHeight:1, fontFamily:"'Syne',sans-serif" }}>25+</div>
                <div style={{ color:"rgba(255,255,255,0.9)", fontSize:"11px", fontWeight:600, marginTop:"3px" }}>Years of Excellence</div>
              </div>

              {/* Rating chip */}
              <div style={{ position:"absolute", top:"14px", right:"14px", backgroundColor:"#fff", border:"2px solid #111", borderRadius:"10px", padding:"8px 12px", boxShadow:"3px 3px 0px #111" }}>
                <div style={{ color:"#f97316", fontWeight:800, fontSize:"18px", lineHeight:1, fontFamily:"'Syne',sans-serif" }}>4.9★</div>
                <div style={{ color:"#aaa", fontSize:"10px", marginTop:"2px" }}>50K+ Reviews</div>
              </div>
            </div>

            {/* Stats row */}
            <div className="as-stats">
              {[["50K+","Customers"],["120+","Menu Items"],["12","Cities"]].map(([val,label]) => (
                <div key={label} style={{ textAlign:"center", padding:"13px 8px", backgroundColor:"#fff", border:"2px solid #111", borderRadius:"12px", boxShadow:"3px 3px 0px #111" }}>
                  <div style={{ fontWeight:800, fontSize:"20px", color:"#f97316", letterSpacing:"-1px", fontFamily:"'Syne',sans-serif" }}>{val}</div>
                  <div style={{ fontSize:"10px", color:"#aaa", marginTop:"3px", textTransform:"uppercase", letterSpacing:"0.8px", fontWeight:600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — text + timeline */}
          <div>
            <p style={{ color:"#777", fontSize:"14px", lineHeight:1.85, marginBottom:"14px" }}>
              FoodieExpress started as a small family kitchen in 1998. What began as a simple dream — to serve honest, delicious food made from scratch — has grown into one of the most beloved food brands in the city.
            </p>
            <p style={{ color:"#777", fontSize:"14px", lineHeight:1.85, marginBottom:"32px" }}>
              Every ingredient is hand-picked from local farms. Every recipe is tested hundreds of times before it reaches your plate. We believe great food brings people together.
            </p>

            {/* Timeline label */}
            <p style={{ color:"#000", fontSize:"10px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", marginBottom:"12px", fontFamily:"'Syne',sans-serif" }}>Our Journey</p>

            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              {milestones.map((m, i) => {
                const isActive = active === i
                return (
                  <div
                    key={m.year}
                    className="timeline-row"
                    onClick={() => setActive(i)}
                    style={{
                      padding:"13px 16px",
                      borderRadius:"12px",
                      cursor:"pointer",
                      backgroundColor: isActive ? "#fff3e8" : "#fff",
                      border:`2px solid ${isActive ? "#f97316" : "#e8e8e8"}`,
                      boxShadow: isActive ? "3px 3px 0px #f97316" : "2px 2px 0px #f0f0f0",
                      display:"flex", gap:"12px", alignItems:"flex-start",
                    }}
                  >
                    {/* Dot + year */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", flexShrink:0, paddingTop:"2px" }}>
                      <div style={{ width:"20px", height:"20px", borderRadius:"50%", backgroundColor:isActive?"#f97316":"#f0f0f0", border:`2px solid ${isActive?"#f97316":"#e8e8e8"}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:isActive?"2px 2px 0px #c2540a":"none" }}>
                        {isActive && <CheckIcon />}
                      </div>
                      <span style={{ color:isActive?"#f97316":"#bbb", fontWeight:800, fontSize:"10px", fontFamily:"'Syne',sans-serif" }}>{m.year}</span>
                    </div>
                    {/* Content */}
                    <div>
                      <div style={{ color:isActive?"#111":"#888", fontWeight:700, fontSize:"13px", marginBottom:isActive?"4px":"0", fontFamily:"'Syne',sans-serif" }}>{m.title}</div>
                      {isActive && <div style={{ color:"#888", fontSize:"12px", lineHeight:1.7 }}>{m.desc}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Feature strip ── */}
        <div className="as-features">
          {features.map(({ Icon, label }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:"12px", backgroundColor:"#fff", border:"2px solid #111", borderRadius:"12px", padding:"13px 16px", boxShadow:"3px 3px 0px #111" }}>
              <div style={{ width:"34px", height:"34px", borderRadius:"9px", backgroundColor:"#fff3e8", border:"2px solid #f97316", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon />
              </div>
              <span style={{ color:"#111", fontSize:"13px", fontWeight:700, fontFamily:"'Syne',sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}