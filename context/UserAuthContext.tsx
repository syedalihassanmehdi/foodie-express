"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth"

type UserAuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  signup: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const UserAuthContext = createContext<UserAuthContextType>({} as UserAuthContextType)

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signup = async (email: string, password: string, name: string) => {
    setError(null)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
      setUser({ ...result.user, displayName: name })
    } catch (e: any) {
      const msg =
        e.code === "auth/email-already-in-use" ? "This email is already registered." :
        e.code === "auth/weak-password" ? "Password must be at least 6 characters." :
        e.code === "auth/invalid-email" ? "Invalid email address." :
        "Signup failed. Please try again."
      setError(msg)
      throw new Error(msg)
    }
  }

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e: any) {
      const msg =
        e.code === "auth/user-not-found" ? "No account found with this email." :
        e.code === "auth/wrong-password" ? "Incorrect password." :
        e.code === "auth/invalid-email" ? "Invalid email address." :
        e.code === "auth/too-many-requests" ? "Too many attempts. Try again later." :
        "Login failed. Please try again."
      setError(msg)
      throw new Error(msg)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <UserAuthContext.Provider value={{ user, loading, error, signup, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = () => useContext(UserAuthContext)