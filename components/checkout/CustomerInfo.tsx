"use client"

export type CustomerData = {
  fullName: string
  phone: string
}

// ── Icons ──────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.37 6.37l1.05-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
  </svg>
)
const NameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

export function CustomerInfo({ data, onChange }: { data: CustomerData; onChange: (d: CustomerData) => void }) {
  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    borderRadius: "12px",
    border: "2px solid #e8e8e8",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    color: "#111",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: "3px 3px 0px #f0f0f0",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "8px",
    fontFamily: "'Syne', sans-serif",
  }

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "20px",
      border: "2px solid #111",
      boxShadow: "5px 5px 0px #111",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .ci-input:focus { border-color: #f97316 !important; box-shadow: 3px 3px 0px #f97316 !important; }
        .ci-input::placeholder { color: #ccc; }
        @media (max-width: 540px) { .ci-two-col { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Header */}
      <div style={{
        backgroundColor: "#fafaf8",
        borderBottom: "2px solid #111",
        padding: "18px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{
          width: "38px", height: "38px",
          backgroundColor: "#fff3e8",
          border: "2px solid #111",
          borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#f97316", flexShrink: 0,
        }}>
          <UserIcon />
        </div>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "16px", color: "#111", margin: 0, letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif" }}>
            Your Info
          </h2>
          <p style={{ color: "#aaa", fontSize: "12px", margin: 0, fontWeight: 500 }}>So we know who's ordering</p>
        </div>
      </div>

      {/* Fields */}
      <div style={{ padding: "24px" }}>
        <div
          className="ci-two-col"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
        >
          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name *</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <NameIcon />
              </span>
              <input
                type="text"
                className="ci-input"
                placeholder="John Doe"
                value={data.fullName}
                onChange={e => onChange({ ...data, fullName: e.target.value })}
                style={inputBase}
                onFocus={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.boxShadow = "3px 3px 0px #f97316" }}
                onBlur={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.boxShadow = "3px 3px 0px #f0f0f0" }}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>Phone Number *</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <PhoneIcon />
              </span>
              <input
                type="tel"
                className="ci-input"
                placeholder="+92 300 0000000"
                value={data.phone}
                onChange={e => onChange({ ...data, phone: e.target.value })}
                style={inputBase}
                onFocus={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.boxShadow = "3px 3px 0px #f97316" }}
                onBlur={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.boxShadow = "3px 3px 0px #f0f0f0" }}
              />
            </div>
          </div>
        </div>

        {/* Tip */}
        <div style={{
          marginTop: "16px",
          padding: "10px 14px",
          borderRadius: "10px",
          backgroundColor: "#fff3e8",
          border: "1.5px solid #fddcbb",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontSize: "12px", color: "#c2540a", fontWeight: 600 }}>
            We'll call this number if there's an issue with your delivery.
          </span>
        </div>
      </div>
    </div>
  )
}