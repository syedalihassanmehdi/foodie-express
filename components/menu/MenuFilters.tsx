"use client"
import { useEffect, useState } from "react"

export type Filters = {
  search: string
  veg: boolean
  sort: "default" | "price-asc" | "price-desc" | "rating"
}

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const LeafIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 22V12M12 12C12 12 7 10 5 6c4 0 7 2 7 6zM12 12c0 0 5-2 7-6-4 0-7 2-7 6z"/>
  </svg>
)
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
const SortIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M3 6h18M6 12h12M9 18h6"/>
  </svg>
)

export function MenuFilters({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .filter-search-input { border: none; outline: none; font-size: 13px; color: #111; width: 100%; font-family: 'DM Sans', sans-serif; background: transparent; }
        .filter-search-input::placeholder { color: #bbb; }
        .filter-select { appearance: none; -webkit-appearance: none; padding: 9px 14px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; outline: none; font-family: 'Syne', sans-serif; transition: all 0.2s; background-color: #fff; color: #555; border: 2px solid #e0e0e0; box-shadow: 2px 2px 0px #e0e0e0; }
        .filter-select:focus { border-color: #f97316; box-shadow: 2px 2px 0px #f97316; color: #111; }
        .filter-btn-veg:hover { border-color: #22c55e !important; }
        .filter-btn-rating:hover { border-color: #f97316 !important; }
      `}</style>

      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "20px 0", flexWrap: "wrap",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          backgroundColor: "#fff", border: "2px solid #e0e0e0",
          borderRadius: "10px", padding: "9px 14px",
          flex: 1, minWidth: "180px",
          boxShadow: "2px 2px 0px #e0e0e0",
          transition: "all 0.2s",
          color: "#aaa",
        }}
          onFocus={e => { const el = e.currentTarget; el.style.borderColor = "#f97316"; el.style.boxShadow = "3px 3px 0px #f97316"; el.style.color = "#f97316" }}
          onBlur={e => { const el = e.currentTarget; el.style.borderColor = "#e0e0e0"; el.style.boxShadow = "2px 2px 0px #e0e0e0"; el.style.color = "#aaa" }}
        >
          <SearchIcon />
          <input
            type="text"
            placeholder="Find your favourite dish..."
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            className="filter-search-input"
          />
        </div>

        {/* Veg toggle */}
        <button
          className="filter-btn-veg"
          onClick={() => onChange({ ...filters, veg: !filters.veg })}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "9px 16px", borderRadius: "10px",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s", whiteSpace: "nowrap",
            fontFamily: "'Syne', sans-serif",
            border: `2px solid ${filters.veg ? "#22c55e" : "#e0e0e0"}`,
            backgroundColor: filters.veg ? "#f0fdf4" : "#fff",
            color: filters.veg ? "#22c55e" : "#555",
            boxShadow: filters.veg ? "3px 3px 0px #22c55e" : "2px 2px 0px #e0e0e0",
          }}
        >
          <LeafIcon /> Veg
        </button>

        {/* Sort */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#888", pointerEvents: "none", display: "flex" }}>
            <SortIcon />
          </div>
          <select
            className="filter-select"
            value={filters.sort === "rating" ? "default" : filters.sort}
            onChange={e => onChange({ ...filters, sort: e.target.value as Filters["sort"] })}
            style={{ paddingLeft: "32px" }}
          >
            <option value="default">Price</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        {/* Rating */}
        <button
          className="filter-btn-rating"
          onClick={() => onChange({ ...filters, sort: filters.sort === "rating" ? "default" : "rating" })}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "9px 16px", borderRadius: "10px",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s", whiteSpace: "nowrap",
            fontFamily: "'Syne', sans-serif",
            border: `2px solid ${filters.sort === "rating" ? "#f97316" : "#e0e0e0"}`,
            backgroundColor: filters.sort === "rating" ? "#fff3e8" : "#fff",
            color: filters.sort === "rating" ? "#f97316" : "#555",
            boxShadow: filters.sort === "rating" ? "3px 3px 0px #f97316" : "2px 2px 0px #e0e0e0",
          }}
        >
          <StarIcon /> Rating
        </button>
      </div>
    </>
  )
}