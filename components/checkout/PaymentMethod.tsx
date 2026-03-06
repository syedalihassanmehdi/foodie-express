"use client"
import { useState } from "react"

export type PaymentData = {
  method: "card" | "cash"
  cardNumber: string
  expiry: string
  cvv: string
}

export function PaymentMethod({ data, onChange }: { data: PaymentData; onChange: (d: PaymentData) => void }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "28px", border: "1px solid #f0f0f0", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ width: "36px", height: "36px", backgroundColor: "#fff5ee", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>💳</div>
        <h2 style={{ fontWeight: 700, fontSize: "18px", color: "#111", margin: 0 }}>Payment Method</h2>
      </div>

      {/* Method Toggle */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        {[
          { id: "card", label: "Credit Card", sub: "Visa, Mastercard, Amex", icon: "💳" },
          { id: "cash", label: "Cash on Delivery", sub: "Pay when you receive", icon: "💵" },
        ].map(opt => (
          <div
            key={opt.id}
            onClick={() => onChange({ ...data, method: opt.id as "card" | "cash" })}
            style={{
              padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
              border: `1.5px solid ${data.method === opt.id ? "#f97316" : "#e5e5e5"}`,
              backgroundColor: data.method === opt.id ? "#fff7ed" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>{opt.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#111" }}>{opt.label}</div>
                <div style={{ fontSize: "12px", color: "#999" }}>{opt.sub}</div>
              </div>
            </div>
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%",
              border: `2px solid ${data.method === opt.id ? "#f97316" : "#ddd"}`,
              backgroundColor: data.method === opt.id ? "#f97316" : "#fff",
              flexShrink: 0,
            }} />
          </div>
        ))}
      </div>

      {/* Card Fields */}
      {data.method === "card" && (
        <div style={{ padding: "20px", backgroundColor: "#fafafa", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>Card Number</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              value={data.cardNumber}
              onChange={e => onChange({ ...data, cardNumber: e.target.value })}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e5e5", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
              onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={data.expiry}
                onChange={e => onChange({ ...data, expiry: e.target.value })}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e5e5", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>CVV</label>
              <input
                type="password"
                placeholder="123"
                maxLength={3}
                value={data.cvv}
                onChange={e => onChange({ ...data, cvv: e.target.value })}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e5e5", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}