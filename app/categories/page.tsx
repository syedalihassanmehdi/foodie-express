import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CategoryHero } from "@/components/categories/CategoryHero"
import { CategoryGrid } from "@/components/categories/CategoryGrid"
import { CategoryCTA } from "@/components/categories/CategoryCTA"

export default function CategoriesPage() {
  return (
    <main style={{ backgroundColor: "#faf9f7", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <CategoryHero />
      <CategoryGrid />
      <CategoryCTA />
      <Footer />
    </main>
  )
}