import { Category } from "@/lib/menuData"

export function MenuHero({ category }: { category: Category }) {
  return (
    <section style={{ position: "relative", height: "280px", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${category.image}')`,
        backgroundSize: "cover", backgroundPosition: "center",
        filter: "brightness(0.4)",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #faf9f7 100%)" }} />
      <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 2rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ color: "#f97316", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Our Menu</p>
        <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: "10px" }}>{category.name}</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", maxWidth: "500px", lineHeight: 1.6 }}>{category.desc}</p>
      </div>
    </section>
  )
}