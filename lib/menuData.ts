import { useEffect, useState } from "react"
import { subscribeToMenu, subscribeToCategories } from "./firestore"

export type MenuItem = {
  id: string
  name: string
  price: number
  rating?: number
  reviews?: number
  desc: string
  image: string
  veg: boolean
  category: string
  available?: boolean
}

export type Category = {
  id?: string
  slug: string
  name: string
  desc: string
  image: string
  items: MenuItem[]
}

// Hook to get live Firestore menu data shaped as Category[]
export function useMenuData() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let itemsData: MenuItem[] = []
    let catsData: { slug: string; name: string; desc: string; image: string }[] = []
    let itemsLoaded = false
    let catsLoaded = false

    const merge = () => {
      if (!itemsLoaded || !catsLoaded) return
      const uniqueCats = [...new Map(catsData.map(c => [c.slug, c])).values()]
      const shaped: Category[] = uniqueCats.map(cat => ({
        ...cat,
        items: itemsData
          .filter(i => i.category === cat.slug && i.available !== false)
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      setCategories(shaped)
      setLoading(false)
    }

    const u1 = subscribeToMenu(data => {
      itemsData = [...new Map(data.map(i => [i.id, i])).values()]
      itemsLoaded = true
      merge()
      setItems(itemsData)
    })

    const u2 = subscribeToCategories(data => {
      catsData = [...new Map(data.map(c => [c.slug, c])).values()]
      catsLoaded = true
      merge()
    })

    return () => { u1(); u2() }
  }, [])

  const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug)

  return { categories, items, loading, getCategoryBySlug }
}