"use client"

const suggestions = [
  { id: "fa1", name: "Large Fries", price: 4.00, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80" },
  { id: "fa2", name: "Chocolate Donut", price: 2.50, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80" },
  { id: "fa3", name: "Sparkling Water", price: 3.00, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec6?w=300&q=80" },
  { id: "fa4", name: "Berry Cheesecake", price: 6.00, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80" },
]

export function FrequentlyAdded({ onAdd }: { onAdd: (item: { id: string; name: string; image: string; price: number; desc: string; qty: number }) => void }) {
  return (
    <div style={{ marginTop: "32px", fontFamily: "'DM Sans', sans-serif" }}>
      <h2 style={{ fontWeight: 800, fontSize: "22px", color: "#111", marginBottom: "20px", letterSpacing: "-0.5px" }}>
        Frequently added together
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {suggestions.map(item => (
          <div key={item.id} style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #f0f0f0", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
          >
            <div style={{ height: "140px", overflow: "hidden" }}>
              <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "14px", color: "#111", margin: "0 0 2px" }}>{item.name}</p>
                <p style={{ fontWeight: 700, fontSize: "13px", color: "#f97316", margin: 0 }}>${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => onAdd({ id: item.id, name: item.name, image: item.image, price: item.price, desc: "", qty: 1 })}
                style={{ width: "30px", height: "30px", borderRadius: "8px", backgroundColor: "#f97316", color: "#fff", border: "none", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ea6c0a")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f97316")}
              >+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}