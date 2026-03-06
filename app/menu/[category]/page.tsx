"use client"
import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { MenuHero } from "@/components/menu/MenuHero"
import { MenuGrid } from "@/components/menu/MenuGrid"
import { OrderSidebar } from "@/components/menu/OrderSidebar"
import { useMenuData, Category } from "@/lib/menuData"
import { useCart } from "@/context/CartContext"

export default function MenuCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = use(params)
  const { getCategoryBySlug, loading } = useMenuData()
  const { cart, increase, decrease, remove } = useCart()
  const [category, setCategory] = useState<Category | null>(null)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    if (loading) return
    const cat = getCategoryBySlug(slug)
    if (!cat) setNotFoundState(true)
    else setCategory(cat)
  }, [loading, slug, getCategoryBySlug])

  if (notFoundState) notFound()

  if (loading || !category) {
    return (
      <main style={{ backgroundColor: "#faf9f7", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <div style={{ height: "300px", backgroundColor: "#f0f0f0", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "32px 2rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: "280px", backgroundColor: "#f0f0f0", borderRadius: "16px", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        <Footer />
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: "#faf9f7", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <MenuHero category={category} />
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "32px 2rem", display: "flex", gap: "32px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <MenuGrid items={category.items} />
        </div>
        <OrderSidebar cart={cart} onIncrease={increase} onDecrease={decrease} onRemove={remove} />
      </div>
      <Footer />
    </main>
  )
}