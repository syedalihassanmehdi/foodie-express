import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"
import { UserAuthProvider } from "@/context/UserAuthContext"

export const metadata: Metadata = {
  title: "FoodieExpress",
  description: "Delicious food delivered fresh",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, backgroundColor: "#0a0a0a", fontFamily: "'DM Sans', sans-serif" }}>
        <AuthProvider>
          <UserAuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </UserAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}