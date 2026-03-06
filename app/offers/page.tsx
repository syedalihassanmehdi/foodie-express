import { Navbar } from "@/components/layout/Navbar"
import { OffersHero } from "@/components/offers/OffersHero"
import { CountdownTimer } from "@/components/offers/CountdownTimer"
import { BuildYourBundle } from "@/components/offers/BuildYourBundle"
import { CouponCodes } from "@/components/offers/CouponCodes"
import { LoyaltyBanner } from "@/components/offers/LoyaltyBanner"
import { Footer } from "@/components/layout/Footer"

export default function OffersPage() {
  return (
    <main>
      <Navbar />
      <OffersHero />
      <CountdownTimer />
      <BuildYourBundle />
      <CouponCodes />
      <LoyaltyBanner />
      <Footer />
    </main>
  )
}