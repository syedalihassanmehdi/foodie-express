"use client"

export type DeliveryData = {
  address: string
  notes: string
}

// ── Icons ──────────────────────────────────────────────────────────────────
const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const NoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

export function DeliveryDetails({ data, onChange }: { data: DeliveryData; onChange: (d: DeliveryData) => void }) {
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

  const textareaBase: React.CSSProperties = {
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
    resize: "vertical",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: "3px 3px 0px #f0f0f0",
    minHeight: "90px",
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
        .dd-input:focus, .dd-textarea:focus {
          border-color: #f97316 !important;
          box-shadow: 3px 3px 0px #f97316 !important;
        }
        .dd-input::placeholder, .dd-textarea::placeholder { color: #ccc; }
        .dd-textarea { resize: vertical; }
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
          <TruckIcon />
        </div>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "16px", color: "#111", margin: 0, letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif" }}>
            Delivery Details
          </h2>
          <p style={{ color: "#aaa", fontSize: "12px", margin: 0, fontWeight: 500 }}>Where should we bring your food?</p>
        </div>
      </div>

      {/* Fields */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Address */}
        <div>
          <label style={labelStyle}>Street Address *</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "13px", top: "14px", pointerEvents: "none" }}>
              <PinIcon />
            </span>
            <input
              type="text"
              className="dd-input"
              placeholder="House 12, Street 5, Block A"
              value={data.address}
              onChange={e => onChange({ ...data, address: e.target.value })}
              style={inputBase}
              onFocus={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.boxShadow = "3px 3px 0px #f97316" }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.boxShadow = "3px 3px 0px #f0f0f0" }}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>
            Delivery Notes
            <span style={{ color: "#ccc", fontWeight: 400, textTransform: "none", fontSize: "11px", marginLeft: "6px" }}>(optional)</span>
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "13px", top: "14px", pointerEvents: "none" }}>
              <NoteIcon />
            </span>
            <textarea
              className="dd-textarea"
              placeholder="Door code, floor number, or where to leave the bag..."
              value={data.notes}
              onChange={e => onChange({ ...data, notes: e.target.value })}
              rows={3}
              style={textareaBase}
              onFocus={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.boxShadow = "3px 3px 0px #f97316" }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.boxShadow = "3px 3px 0px #f0f0f0" }}
            />
          </div>
        </div>

        {/* Estimated time strip */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 14px",
          borderRadius: "12px",
          border: "2px solid #111",
          boxShadow: "3px 3px 0px #111",
          backgroundColor: "#fafaf8",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 800, color: "#111", margin: 0, fontFamily: "'Syne', sans-serif" }}>
              Est. delivery: 30–45 min
            </p>
            <p style={{ fontSize: "11px", color: "#aaa", margin: 0, fontWeight: 500 }}>After your order is confirmed</p>
          </div>
        </div>
      </div>
    </div>
  )
}