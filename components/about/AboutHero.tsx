export function AboutHero() {
      return (
        <section style={{ position: "relative", height: "420px", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.35)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #faf9f7 100%)" }} />
          <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 2rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ color: "#f97316", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Our Story</p>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "16px", maxWidth: "600px" }}>
              Crafting Memories,<br />One Dish at a Time
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", maxWidth: "480px", lineHeight: 1.7 }}>
              Since 1998, we've been serving the finest artisanal food with love, passion, and locally sourced ingredients.
            </p>
          </div>
        </section>
      )
    }