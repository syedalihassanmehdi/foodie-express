import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { AboutHero } from "@/components/about/AboutHero"
import { AboutStory } from "@/components/about/AboutStory"
import { AboutValues } from "@/components/about/AboutValues"
import { AboutTeam } from "@/components/about/AboutTeam"

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "#faf9f7", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
      <Footer />
    </main>
  )
}