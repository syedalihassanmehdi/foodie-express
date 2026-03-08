"use client"
import { createContext, useContext, useState, ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  desc: string
  image: string
  price: number
  qty: number
  isBundle?: boolean
  originalPrice?: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "qty">) => void
  increase: (id: string) => void
  decrease: (id: string) => void
  remove: (id: string) => void
  clearCart: () => void  // 👈 added
  cartCount: number
  cartTotal: number
  bundleDiscount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const increase = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i))

  const decrease = (id: string) => setCart(prev => {
    const item = prev.find(i => i.id === id)
    if (item?.qty === 1) return prev.filter(i => i.id !== id)
    return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
  })

  const remove = (id: string) => setCart(prev => prev.filter(i => i.id !== id))

  const clearCart = () => setCart([])  // 👈 added

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const bundleDiscount = cart
    .filter(i => i.isBundle && i.originalPrice)
    .reduce((s, i) => s + ((i.originalPrice! - i.price) * i.qty), 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, increase, decrease, remove, clearCart, cartCount, cartTotal, bundleDiscount }}>  {/* 👈 added clearCart */}
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}