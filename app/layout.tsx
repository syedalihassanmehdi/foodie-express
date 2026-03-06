import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"

export const metadata: Metadata = {
  title: "FoodieExpress",
  description: "Delicious food delivered fresh",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}