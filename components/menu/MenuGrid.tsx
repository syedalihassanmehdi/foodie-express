"use client"
import { useState } from "react"
import { MenuItem } from "@/lib/menuData"
import { MenuFilters, Filters } from "@/components/menu/MenuFilters"
import { MenuCard } from "@/components/menu/MenuCard"

const PlateIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)

export function MenuGrid({ items }: { items: MenuItem[] }) {
  const [filters, setFilters] = useState<Filters>({ search: "", veg: false, sort: "default" })

  const filtered = items
    .filter(i => !filters.veg || i.veg)
    .filter(i => i.name.toLowerCase().includes(filters.search.toLowerCase()) || i.desc.toLowerCase().includes(filters.search.toLowerCase()))
    .sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price
      if (filters.sort === "price-desc") return b.price - a.price
      if (filters.sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0)
      return 0
    })

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        .menu-items-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 900px) { .menu-items-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .menu-items-grid { grid-template-columns: 1fr; } }
      `}</style>

      <MenuFilters filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}><PlateIcon /></div>
          <p style={{ fontSize: "15px", color: "#bbb", fontWeight: 600 }}>No items match your filters.</p>
          <button
            onClick={() => setFilters({ search: "", veg: false, sort: "default" })}
            style={{
              marginTop: "16px", padding: "10px 24px", backgroundColor: "#fff",
              border: "2px solid #f97316", borderRadius: "10px", color: "#f97316",
              fontSize: "13px", fontWeight: 700, cursor: "pointer",
              fontFamily: "'Syne', sans-serif", boxShadow: "3px 3px 0px #f97316",
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="menu-items-grid">
          {filtered.map(item => <MenuCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}