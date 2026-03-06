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
        <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🍽️</div>
          <p style={{ fontSize: "15px" }}>No items match your filters.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {filtered.map(item => <MenuCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}