"use client"
import { useState } from "react"
import { MenuItem } from "@/lib/menuData"
import { MenuFilters, Filters } from "@/components/menu/MenuFilters"
import { MenuCard } from "@/components/menu/MenuCard"

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
      <MenuFilters filters={filters} onChange={setFilters} />
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🍽️</div>
          <p style={{ fontSize: "15px" }}>No items match your filters.</p>
        </div>
      ) : (
        <>
          <style>{`
            .menu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            @media (max-width: 900px) { .menu-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 500px) { .menu-grid { grid-template-columns: 1fr; } }
          `}</style>
          <div className="menu-grid">
            {filtered.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        </>
      )}
    </div>
  )
}