import {
  collection, addDoc, updateDoc, deleteDoc, doc, setDoc,
  getDocs, onSnapshot, query, orderBy, serverTimestamp, Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export type OrderStatus = "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: { name: string; qty: number; price: number }[]
  total: number
  status: OrderStatus
  createdAt: Timestamp
  userId?: string  // 👈 added — optional so guest orders still work
}

export interface MenuItem {
  id: string
  name: string
  desc: string
  price: number
  category: string
  image: string
  available: boolean
  veg: boolean
  rating?: number
  reviews?: number
  createdAt?: Timestamp
}

export interface Category {
  id: string
  slug: string
  name: string
  desc: string
  image: string
}

export interface Offer {
  id: string
  title: string
  description: string
  type: "percent" | "flat" | "bogo" | "free_delivery"
  value: number
  code: string
  active: boolean
  expiresAt: string
  createdAt: Timestamp
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export const subscribeToOrders = (cb: (o: Order[]) => void) =>
  onSnapshot(
    query(collection(db, "orders"), orderBy("createdAt", "desc")),
    s => cb(s.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
  )

export const updateOrderStatus = async (id: string, status: OrderStatus) =>
  updateDoc(doc(db, "orders", id), { status })

export const addOrder = async (order: Omit<Order, "id" | "createdAt">) =>
  addDoc(collection(db, "orders"), { ...order, createdAt: serverTimestamp() })

export const deleteOrder = async (id: string) =>
  deleteDoc(doc(db, "orders", id))

// ─── MENU ITEMS ───────────────────────────────────────────────────────────────

export const subscribeToMenu = (cb: (i: MenuItem[]) => void) =>
  onSnapshot(
    collection(db, "menuItems"),
    s => cb(s.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)))
  )

export const addMenuItem = async (item: Omit<MenuItem, "id">) =>
  addDoc(collection(db, "menuItems"), { ...item, createdAt: serverTimestamp() })

export const updateMenuItem = async (id: string, data: Partial<MenuItem>) =>
  updateDoc(doc(db, "menuItems", id), data)

export const deleteMenuItem = async (id: string) =>
  deleteDoc(doc(db, "menuItems", id))

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const subscribeToCategories = (cb: (c: Category[]) => void) =>
  onSnapshot(
    collection(db, "categories"),
    s => {
      const seen = new Set<string>()
      const cats = s.docs
        .map(d => ({ id: d.id, ...d.data() } as Category))
        .filter(c => {
          if (seen.has(c.slug)) return false
          seen.add(c.slug)
          return true
        })
      cb(cats)
    }
  )

export const addCategory = async (cat: Omit<Category, "id">) =>
  setDoc(doc(db, "categories", cat.slug), cat)

export const updateCategory = async (id: string, data: Partial<Category>) =>
  updateDoc(doc(db, "categories", id), data)

export const deleteCategory = async (id: string) =>
  deleteDoc(doc(db, "categories", id))

// ─── OFFERS ──────────────────────────────────────────────────────────────────

export const subscribeToOffers = (cb: (o: Offer[]) => void) =>
  onSnapshot(
    query(collection(db, "offers"), orderBy("createdAt", "desc")),
    s => cb(s.docs.map(d => ({ id: d.id, ...d.data() } as Offer)))
  )

export const addOffer = async (offer: Omit<Offer, "id" | "createdAt">) =>
  addDoc(collection(db, "offers"), { ...offer, createdAt: serverTimestamp() })

export const updateOffer = async (id: string, data: Partial<Offer>) =>
  updateDoc(doc(db, "offers", id), data)

export const deleteOffer = async (id: string) =>
  deleteDoc(doc(db, "offers", id))