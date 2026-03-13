"use client"

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)

const suggestions = [
  { id: "fa1", name: "Large Fries",       price: 4.00, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80" },
  { id: "fa2", name: "Chocolate Donut",   price: 2.50, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80" },
  { id: "fa3", name: "Sparkling Water",   price: 3.00, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec6?w=300&q=80" },
  { id: "fa4", name: "Berry Cheesecake",  price: 6.00, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80" },
]

export function FrequentlyAdded({ onAdd }: {
  onAdd: (item: { id: string; name: string; image: string; price: number; desc: string; qty: number }) => void
}) {
  return (
    <div style={{ marginTop: "40px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .fa-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 700px) { .fa-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
        @media (max-width: 380px) { .fa-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
        .fa-card {
          background-color: #fff;
          border-radius: 16px;
          border: 2px solid #111;
          overflow: hidden;
          box-shadow: 3px 3px 0px #111;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .fa-card:hover {
          transform: translateY(-4px);
          box-shadow: 5px 5px 0px #f97316;
          border-color: #f97316;
        }
        .fa-card:hover img {
          transform: scale(1.05);
          filter: brightness(0.95);
        }
        .fa-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.88);
          transition: filter 0.3s, transform 0.3s;
        }
        .fa-add-btn {
          width: 32px; height: 32px;
          border-radius: 10px;
          background-color: #f97316;
          color: #fff;
          border: 2px solid #111;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 2px 2px 0px #c2540a;
          transition: transform 0.15s, background-color 0.15s;
        }
        .fa-add-btn:hover {
          background-color: #111;
          transform: scale(1.08);
        }
      `}</style>

      {/* Section header */}
      <div style={{ marginBottom: "20px" }}>
        {/* Divider with diamond */}
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <div style={{ height: "2px", backgroundColor: "#f5f5f5", borderRadius: "2px" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: "12px", height: "12px", backgroundColor: "#f97316", border: "2px solid #111" }} />
        </div>

        <h2 style={{ fontWeight: 800, fontSize: "clamp(18px, 3vw, 22px)", color: "#111", letterSpacing: "-0.5px", margin: 0, fontFamily: "'Syne', sans-serif" }}>
          Frequently added <span style={{ color: "#f97316", fontStyle: "italic" }}>together</span>
        </h2>
        <p style={{ color: "#aaa", fontSize: "13px", margin: "6px 0 0" }}>Customers also love these with their order</p>
      </div>

      <div className="fa-grid">
        {suggestions.map(item => (
          <div key={item.id} className="fa-card">
            <div className="fa-img-wrap" style={{ height: "120px", overflow: "hidden", position: "relative" }}>
              <img src={item.image} alt={item.name} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
            </div>
            <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: "13px", color: "#111", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Syne', sans-serif" }}>
                  {item.name}
                </p>
                <p style={{ fontWeight: 800, fontSize: "13px", color: "#f97316", margin: 0 }}>
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <button
                className="fa-add-btn"
                onClick={() => onAdd({ id: item.id, name: item.name, image: item.image, price: item.price, desc: "", qty: 1 })}
              >
                <PlusIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}