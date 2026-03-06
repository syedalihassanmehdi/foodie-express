export function AboutStory() {
      return (
        <section style={{ padding: "80px 2rem", maxWidth: "1100px", margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
            {/* Image */}
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", height: "420px" }}>
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" alt="Our kitchen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {/* Badge */}
              <div style={{ position: "absolute", bottom: "24px", left: "24px", backgroundColor: "#f97316", borderRadius: "14px", padding: "14px 20px" }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "28px", lineHeight: 1 }}>25+</div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", marginTop: "4px" }}>Years of Excellence</div>
              </div>
            </div>
    
            {/* Text */}
            <div>
              <p style={{ color: "#f97316", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Who We Are</p>
              <h2 style={{ fontSize: "36px", fontWeight: 800, color: "#111", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "20px" }}>
                Born from a Passion<br />for Real Food
              </h2>
              <p style={{ color: "#777", fontSize: "15px", lineHeight: 1.8, marginBottom: "16px" }}>
                FoodieExpress started as a small family kitchen in 1998. What began as a simple dream — to serve honest, delicious food made from scratch — has grown into one of the most beloved food brands in the city.
              </p>
              <p style={{ color: "#777", fontSize: "15px", lineHeight: 1.8, marginBottom: "32px" }}>
                Every ingredient is hand-picked from local farms. Every recipe is tested hundreds of times before it reaches your plate. We believe great food brings people together, and that's exactly what we set out to do every single day.
              </p>
    
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {[
                  { value: "50K+", label: "Happy Customers" },
                  { value: "120+", label: "Menu Items" },
                  { value: "12", label: "Cities Served" },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: "center", padding: "16px", backgroundColor: "#fff5ee", borderRadius: "12px" }}>
                    <div style={{ fontWeight: 800, fontSize: "24px", color: "#f97316" }}>{stat.value}</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )
    }