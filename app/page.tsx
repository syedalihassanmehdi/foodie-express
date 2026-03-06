import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/home/HeroSection"
import { FeaturesBar } from "@/components/home/FeaturesBar"
import { CategoriesSection } from "@/components/home/CategoriesSection"
import { BestSellers } from "@/components/home/BestSellers"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"

export default function HomePage() {
  return (
    <main style={{ backgroundColor: "#0f0f0f" }}>
      <Navbar />
      <HeroSection />
      <FeaturesBar />
      <CategoriesSection />
      <BestSellers />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}