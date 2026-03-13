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
      <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <style>{`
          @keyframes shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
            background-size: 400px 100%;
            animation: shimmer 1.4s ease-in-out infinite;
          }
          .skeleton-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          @media (max-width: 900px) { .skeleton-grid { grid-template-columns: repeat(2,1fr); } }
          @media (max-width: 480px) { .skeleton-grid { grid-template-columns: 1fr; } }
        `}</style>
        <div className="skeleton" style={{ height: "280px", borderBottom: "2px solid #111" }} />
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "32px 1.25rem" }}>
          <div className="skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "280px", borderRadius: "18px", border: "2px solid #e8e8e8" }} />
            ))}
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; }

        .menu-layout {
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }
        .menu-main { flex: 1; min-width: 0; }

        .sidebar-desktop { display: block; width: 300px; flex-shrink: 0; }
        .sidebar-mobile  { display: none; }

        @media (max-width: 900px) {
          .menu-layout { flex-direction: column; }
          .sidebar-desktop { display: none; }
          .sidebar-mobile  { display: block; width: 100%; margin-top: 24px; }
        }
      `}</style>

      <Navbar />
      <MenuHero category={category} />

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "32px 1.25rem 80px" }}>
        <div className="menu-layout">

          {/* Menu Grid + mobile sidebar */}
          <div className="menu-main">
            <MenuGrid items={category.items} />
            <div className="sidebar-mobile">
              <OrderSidebar cart={cart} onIncrease={increase} onDecrease={decrease} onRemove={remove} />
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="sidebar-desktop">
            <OrderSidebar cart={cart} onIncrease={increase} onDecrease={decrease} onRemove={remove} />
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}