"use client"

const suggestions = [
  { id: "fa1", name: "Large Fries", price: 4.00, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80" },
  { id: "fa2", name: "Chocolate Donut", price: 2.50, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80" },
  { id: "fa3", name: "Sparkling Water", price: 3.00, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec6?w=300&q=80" },
  { id: "fa4", name: "Berry Cheesecake", price: 6.00, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80" },
]

export function FrequentlyAdded({ onAdd }: { onAdd: (item: { id: string; name: string; image: string; price: number; desc: string; qty: number }) => void }) {
  return (
    <div style={{ marginTop: "36px", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        .fa-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 700px) {
          .fa-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 380px) {
          .fa-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        .fa-card {
          background-color: #111;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .fa-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
          border-color: rgba(249,115,22,0.25);
        }
        .fa-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.75);
          transition: filter 0.3s, transform 0.3s;
        }
        .fa-card:hover img {
          filter: brightness(0.9);
          transform: scale(1.04);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)", marginBottom: "24px" }} />
        <h2 style={{
          fontWeight: 800, fontSize: "clamp(18px, 3vw, 22px)",
          color: "#fff", letterSpacing: "-0.5px", margin: 0,
        }}>
          Frequently added <span style={{ color: "#f97316" }}>together</span>
        </h2>
      </div>

      <div className="fa-grid">
        {suggestions.map(item => (
          <div key={item.id} className="fa-card">
            <div style={{ height: "130px", overflow: "hidden", position: "relative" }}>
              <img src={item.image} alt={item.name} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
            </div>
            <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontWeight: 700, fontSize: "13px", color: "#fff",
                  margin: "0 0 3px",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{item.name}</p>
                <p style={{ fontWeight: 800, fontSize: "13px", color: "#f97316", margin: 0 }}>
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => onAdd({ id: item.id, name: item.name, image: item.image, price: item.price, desc: "", qty: 1 })}
                style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  backgroundColor: "#f97316", color: "#fff",
                  border: "none", fontSize: "18px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background 0.2s, transform 0.15s",
                  boxShadow: "0 0 12px rgba(249,115,22,0.3)",
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#ea6c0a"; e.currentTarget.style.transform = "scale(1.1)" }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#f97316"; e.currentTarget.style.transform = "scale(1)" }}
              >+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}