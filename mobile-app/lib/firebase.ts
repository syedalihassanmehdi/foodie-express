import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
  apiKey: "AIzaSyA-yt0pR20z-S2OF1VTqXSTLmotKNAArLM",
  authDomain: "fooddash-bd1ab.firebaseapp.com",
  projectId: "fooddash-bd1ab",
  storageBucket: "fooddash-bd1ab.firebasestorage.app",
  messagingSenderId: "1097841896334",
  appId: "1:1097841896334:web:86685dbaf7c2e3d830d2df",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const db = getFirestore(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
export default app
