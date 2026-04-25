import { useEffect, useState } from "react"
import { subscribeToMenu, subscribeToCategories, MenuItem } from "./firestore"

export type MenuCategory = {
  slug: string
  name: string
  desc: string
  image: string
  items: MenuItem[]
}

export function useMenuData() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let itemsData: MenuItem[] = []
    let catsData: { slug: string; name: string; desc: string; image: string }[] = []
    let itemsLoaded = false
    let catsLoaded = false

    const merge = () => {
      if (!itemsLoaded || !catsLoaded) return
      const uniqueCats = [...new Map(catsData.map(c => [c.slug, c])).values()]
      const shaped: MenuCategory[] = uniqueCats.map(cat => ({
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
