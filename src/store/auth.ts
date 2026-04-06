import { create } from 'zustand'
import {
  onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, updateProfile, type User
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'

interface AuthState {
  user: User | null; loading: boolean; error: string | null
  signInGoogle: () => Promise<void>
  signInEmail:  (email: string, pass: string) => Promise<void>
  signUpEmail:  (email: string, pass: string, name: string) => Promise<void>
  logout:       () => Promise<void>
  clearError:   () => void
}

async function upsertUser(user: User) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid, email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL, createdAt: Date.now(), updatedAt: Date.now()
    })
  }
}

export const useAuthStore = create<AuthState>((set) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) await upsertUser(user)
    set({ user, loading: false })
  })

  return {
    user: null, loading: true, error: null,

    signInGoogle: async () => {
      try {
        set({ error: null })
        const r = await signInWithPopup(auth, googleProvider)
        await upsertUser(r.user)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Erro ao entrar com Google'
        set({ error: msg })
      }
    },

    signInEmail: async (email, pass) => {
      try {
        set({ error: null })
        await signInWithEmailAndPassword(auth, email, pass)
      } catch (e: unknown) {
        const code = (e as { code?: string }).code
        set({ error: code === 'auth/invalid-credential' ? 'Email ou senha inválidos' : 'Erro ao entrar' })
      }
    },

    signUpEmail: async (email, pass, name) => {
      try {
        set({ error: null })
        const r = await createUserWithEmailAndPassword(auth, email, pass)
        await updateProfile(r.user, { displayName: name })
        await upsertUser(r.user)
      } catch (e: unknown) {
        const code = (e as { code?: string }).code
        set({ error: code === 'auth/email-already-in-use' ? 'Email já em uso' : 'Erro ao criar conta' })
      }
    },

    logout: async () => { await signOut(auth); set({ user: null }) },
    clearError: () => set({ error: null }),
  }
})
