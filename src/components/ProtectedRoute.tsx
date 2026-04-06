import type { ReactNode } from 'react'
import { Redirect } from 'wouter'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStore()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-base)' }}>
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
    </div>
  )
  if (!user) return <Redirect to="/auth" />
  return <>{children}</>
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStore()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-base)' }}>
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
    </div>
  )
  if (user) return <Redirect to="/" />
  return <>{children}</>
}
