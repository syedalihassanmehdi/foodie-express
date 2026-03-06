export function AboutHero() {
  return (
    <section style={{ position: "relative", height: "500px", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.15)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, transparent 50%), linear-gradient(to bottom, transparent 40%, #0a0a0a 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "linear-gradient(to bottom, #f97316, transparent)" }} />
      <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "100px", padding: "6px 14px", marginBottom: "24px", width: "fit-content" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316" }} />
          <span style={{ color: "#f97316", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>Our Story</span>
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1.05, marginBottom: "20px", maxWidth: "650px" }}>
          Crafting Memories,<br />
          <span style={{ color: "#f97316", fontStyle: "italic" }}>One Dish</span> at a Time
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(14px, 2vw, 17px)", maxWidth: "480px", lineHeight: 1.8 }}>
          Since 1998, we've been serving the finest artisanal food with love, passion, and locally sourced ingredients.
        </p>
      </div>
    </section>
  )
}