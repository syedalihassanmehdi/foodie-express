"use client"

export type Filters = {
  search: string
  veg: boolean
  sort: "default" | "price-asc" | "price-desc" | "rating"
}

export function MenuFilters({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  return (
    <>
      <style>{`
        .filter-bar { display: flex; align-items: center; gap: 10px; padding: 20px 0; flex-wrap: wrap; font-family: 'DM Sans', sans-serif; }
        .filter-btn { display: flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-select { padding: 10px 18px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; outline: none; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
      `}</style>
      <div className="filter-bar">
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#161616", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: "999px", padding: "10px 18px", flex: 1, minWidth: "200px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Find your favourite dish..."
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            style={{ border: "none", outline: "none", fontSize: "13px", color: "#fff", width: "100%", fontFamily: "'DM Sans', sans-serif", background: "transparent" }}
          />
        </div>

        {/* Veg toggle */}
        <button
          className="filter-btn"
          onClick={() => onChange({ ...filters, veg: !filters.veg })}
          style={{
            border: `1.5px solid ${filters.veg ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
            backgroundColor: filters.veg ? "rgba(34,197,94,0.1)" : "#161616",
            color: filters.veg ? "#4ade80" : "rgba(255,255,255,0.4)",
          }}
        >
          🌿 Veg
        </button>

        {/* Sort */}
        <select
          className="filter-select"
          value={filters.sort}
          onChange={e => onChange({ ...filters, sort: e.target.value as Filters["sort"] })}
          style={{
            border: "1.5px solid rgba(255,255,255,0.08)",
            backgroundColor: "#161616", color: "rgba(255,255,255,0.4)",
          }}
        >
          <option value="default">💰 Price</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        {/* Rating */}
        <button
          className="filter-btn"
          onClick={() => onChange({ ...filters, sort: filters.sort === "rating" ? "default" : "rating" })}
          style={{
            border: `1.5px solid ${filters.sort === "rating" ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.08)"}`,
            backgroundColor: filters.sort === "rating" ? "rgba(249,115,22,0.1)" : "#161616",
            color: filters.sort === "rating" ? "#f97316" : "rgba(255,255,255,0.4)",
          }}
        >
          ⭐ Rating
        </button>
      </div>
    </>
  )
}