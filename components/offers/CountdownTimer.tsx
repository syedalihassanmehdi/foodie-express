"use client"
import { useState, useEffect } from "react"

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
  return {
    hours: Math.floor(diff / 1000 / 60 / 60) % 24,
    minutes: Math.floor(diff / 1000 / 60) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  }
}

export function CountdownTimer() {
  const target = new Date(Date.now() + 1000 * 60 * 60 * 23)
  const [time, setTime] = useState(getTimeLeft(target))

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")

  const box = (value: number, label: string) => (
    <div style={{ textAlign: "center" }}>
      <div style={{
        backgroundColor: "#111",
        border: "1px solid rgba(249,115,22,0.2)",
        color: "#fff", borderRadius: "16px",
        padding: "20px 28px", fontSize: "44px", fontWeight: 800,
        letterSpacing: "-2px", minWidth: "90px",
        boxShadow: "0 0 20px rgba(249,115,22,0.08)",
        position: "relative" as const, overflow: "hidden" as const,
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(249,115,22,0.06) 0%, transparent 60%)" }} />
        <span style={{ position: "relative", zIndex: 1 }}>{pad(value)}</span>
      </div>
      <p style={{ color: "#555", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "10px" }}>{label}</p>
    </div>
  )

  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "64px 2rem", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }`}</style>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "200px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "999px", padding: "6px 16px", marginBottom: "20px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Hurry Up!</span>
        </div>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "#fff", margin: "0 0 36px", letterSpacing: "-0.5px" }}>
          Today's Deals Expire In
        </h2>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
          {box(time.hours, "Hours")}
          <span style={{ fontSize: "44px", fontWeight: 800, color: "#f97316", marginTop: "16px", lineHeight: 1 }}>:</span>
          {box(time.minutes, "Minutes")}
          <span style={{ fontSize: "44px", fontWeight: 800, color: "#f97316", marginTop: "16px", lineHeight: 1 }}>:</span>
          {box(time.seconds, "Seconds")}
        </div>
      </div>
    </section>
  )
}