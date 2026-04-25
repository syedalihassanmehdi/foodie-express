import {
  collection, addDoc, updateDoc, deleteDoc, doc, setDoc,
  getDocs, onSnapshot, query, orderBy, serverTimestamp, Timestamp, where,
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
  notes?: string
  status: OrderStatus
  createdAt: Timestamp
  userId?: string
  promoCode?: string
  discount?: number
}
export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  notes: string;
  isDefault: boolean;
  userId: string;
  createdAt?: Timestamp;
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

export interface Bundle {
  id: string
  name: string
  description: string
  discount: number
  active: boolean
  categories: {
    label: string
    emoji: string
    items: {
      id: string
      name: string
      price: number
      image: string
      menuItemId: string
    }[]
  }[]
  createdAt: Timestamp
}

// ─── MENU ITEMS ───────────────────────────────────────────────────────────────

export const subscribeToMenu = (cb: (i: MenuItem[]) => void) =>
  onSnapshot(
    collection(db, "menuItems"),
    s => cb(s.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)))
  )

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

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export const addOrder = async (order: Omit<Order, "id" | "createdAt">) =>
  addDoc(collection(db, "orders"), { ...order, createdAt: serverTimestamp() })

export const subscribeToUserOrders = (userId: string, cb: (o: Order[]) => void) =>
  onSnapshot(
    query(collection(db, "orders"), where("userId", "==", userId)),
    s => {
      const orders = s.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      // Sort by createdAt desc in JS to avoid needing a composite index
      orders.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      cb(orders);
    }
  )

// ─── OFFERS ──────────────────────────────────────────────────────────────────

export const subscribeToOffers = (cb: (o: Offer[]) => void) =>
  onSnapshot(
    collection(db, "offers"),
    s => {
      const offers = s.docs.map(d => ({ id: d.id, ...d.data() } as Offer));
      offers.sort((a, b) => {
        const tA = a.createdAt?.toMillis() || 0;
        const tB = b.createdAt?.toMillis() || 0;
        return tB - tA;
      });
      cb(offers);
    },
    err => console.error("Error subscribing to offers:", err)
  )

// ─── BUNDLES ──────────────────────────────────────────────────────────────────

export const subscribeToBundles = (cb: (b: Bundle[]) => void) =>
  onSnapshot(
    query(collection(db, "bundles"), orderBy("createdAt", "desc")),
    s => cb(s.docs.map(d => ({ id: d.id, ...d.data() } as Bundle)))
  )

// ─── ADDRESSES ────────────────────────────────────────────────────────────────

export const addAddress = async (address: Omit<Address, "id" | "createdAt">) =>
  addDoc(collection(db, "addresses"), { ...address, createdAt: serverTimestamp() })

export const deleteAddress = async (id: string) =>
  deleteDoc(doc(db, "addresses", id))

export const subscribeToUserAddresses = (userId: string, cb: (a: Address[]) => void) =>
  onSnapshot(
    query(collection(db, "addresses"), where("userId", "==", userId)),
    s => cb(s.docs.map(d => ({ id: d.id, ...d.data() } as Address)))
  )
