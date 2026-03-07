import { Category } from "@/lib/menuData"

export function MenuHero({ category }: { category: Category }) {
  return (
    <section style={{ position: "relative", height: "320px", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${category.image}')`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.15)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, transparent 50%), linear-gradient(to bottom, transparent 30%, #0a0a0a 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "linear-gradient(to bottom, #f97316, transparent)" }} />
      <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "100px", padding: "6px 14px", marginBottom: "20px", width: "fit-content" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316" }} />
          <span style={{ color: "#f97316", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>Our Menu</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1.05, marginBottom: "14px" }}>
          {category.name}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(13px, 2vw, 16px)", maxWidth: "500px", lineHeight: 1.8 }}>{category.desc}</p>
      </div>
    </section>
  )
}