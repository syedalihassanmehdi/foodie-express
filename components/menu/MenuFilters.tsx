"use client"
import { useState } from "react"

export type Filters = {
  search: string
  veg: boolean
  sort: "default" | "price-asc" | "price-desc" | "rating"
}

export function MenuFilters({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 0", flexWrap: "wrap", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#fff", border: "1.5px solid #e5e5e5", borderRadius: "999px", padding: "10px 18px", flex: 1, minWidth: "200px" }}>
        <span style={{ color: "#aaa" }}>🔍</span>
        <input
          type="text"
          placeholder="Find your favourite dish..."
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          style={{ border: "none", outline: "none", fontSize: "13px", color: "#111", width: "100%", fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>

      {/* Veg toggle */}
      <button
        onClick={() => onChange({ ...filters, veg: !filters.veg })}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "10px 18px", borderRadius: "999px", fontSize: "13px", fontWeight: 600,
          border: `1.5px solid ${filters.veg ? "#22c55e" : "#e5e5e5"}`,
          backgroundColor: filters.veg ? "#f0fdf4" : "#fff",
          color: filters.veg ? "#22c55e" : "#555",
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        🌿 Veg
      </button>

      {/* Sort by Price */}
      <select
        value={filters.sort}
        onChange={e => onChange({ ...filters, sort: e.target.value as Filters["sort"] })}
        style={{
          padding: "10px 18px", borderRadius: "999px", fontSize: "13px", fontWeight: 600,
          border: "1.5px solid #e5e5e5", backgroundColor: "#fff", color: "#555",
          cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <option value="default">💰 Price</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      {/* Sort by Rating */}
      <button
        onClick={() => onChange({ ...filters, sort: filters.sort === "rating" ? "default" : "rating" })}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "10px 18px", borderRadius: "999px", fontSize: "13px", fontWeight: 600,
          border: `1.5px solid ${filters.sort === "rating" ? "#f97316" : "#e5e5e5"}`,
          backgroundColor: filters.sort === "rating" ? "#fff7ed" : "#fff",
          color: filters.sort === "rating" ? "#f97316" : "#555",
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        ⭐ Rating
      </button>
    </div>
  )
}