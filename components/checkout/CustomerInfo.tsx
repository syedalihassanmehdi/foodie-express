"use client"

export type CustomerData = {
  fullName: string
  phone: string
}

export function CustomerInfo({ data, onChange }: { data: CustomerData; onChange: (d: CustomerData) => void }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "28px", border: "1px solid #f0f0f0", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ width: "36px", height: "36px", backgroundColor: "#fff5ee", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👤</div>
        <h2 style={{ fontWeight: 700, fontSize: "18px", color: "#111", margin: 0 }}>Customer Information</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Full Name */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={data.fullName}
            onChange={e => onChange({ ...data, fullName: e.target.value })}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e5e5", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#111", boxSizing: "border-box" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
            onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
          />
        </div>

        {/* Phone */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>Phone Number</label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={data.phone}
            onChange={e => onChange({ ...data, phone: e.target.value })}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e5e5", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#111", boxSizing: "border-box" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
            onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
          />
        </div>
      </div>
    </div>
  )
}