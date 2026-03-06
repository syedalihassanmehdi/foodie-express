"use client"

export type DeliveryData = {
  address: string
  notes: string
}

export function DeliveryDetails({ data, onChange }: { data: DeliveryData; onChange: (d: DeliveryData) => void }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "28px", border: "1px solid #f0f0f0", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ width: "36px", height: "36px", backgroundColor: "#fff5ee", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🚚</div>
        <h2 style={{ fontWeight: 700, fontSize: "18px", color: "#111", margin: 0 }}>Delivery Details</h2>
      </div>

      {/* Address */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>Delivery Address</label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>📍</span>
          <input
            type="text"
            placeholder="123 Foodie Street, Flavor Town"
            value={data.address}
            onChange={e => onChange({ ...data, address: e.target.value })}
            style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: "10px", border: "1.5px solid #e5e5e5", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#111", boxSizing: "border-box" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
            onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>Delivery Notes <span style={{ color: "#aaa", fontWeight: 400 }}>(Optional)</span></label>
        <textarea
          placeholder="Door code, floor number, or where to leave the bag..."
          value={data.notes}
          onChange={e => onChange({ ...data, notes: e.target.value })}
          rows={4}
          style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e5e5", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#111", resize: "vertical", boxSizing: "border-box" }}
          onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
          onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
        />
      </div>
    </div>
  )
}