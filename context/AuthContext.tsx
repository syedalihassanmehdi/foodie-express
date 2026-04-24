"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { adminAuth } from "@/lib/firebase"
import {
  signInWithEmailAndPassword, signOut,
  onAuthStateChanged, User
} from "firebase/auth"

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(adminAuth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      await signInWithEmailAndPassword(adminAuth, email, password)
    } catch (err: any) {
      const messages: Record<string, string> = {
        "auth/invalid-credential": "Invalid email or password.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
        "auth/invalid-email": "Please enter a valid email address.",
      }
      const msg = messages[err.code] || "Login failed. Please try again."
      setError(msg)
      throw new Error(msg)
    }
  }

  const logout = async () => {
    await signOut(adminAuth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}