import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { useWorkspaceStore } from '@/store/workspace'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { BoardView } from '@/views/BoardView'
import { ListView } from '@/views/ListView'
import { CalendarView } from '@/views/CalendarView'
import { NotesView } from '@/views/NotesView'
import { Loader2 } from 'lucide-react'

export default function AppPage() {
  const { user } = useAuthStore()
  const { loadWorkspaces, loadTasks, loadNotes, activeWorkspaceId, activeView } = useWorkspaceStore()
  const [ready, setReady] = useState(false)
  const newTaskFnRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!user) return
    const unsub = loadWorkspaces(user.uid)
    return unsub
  }, [user])

  useEffect(() => {
    if (!user || !activeWorkspaceId) return
    const u1 = loadTasks(user.uid)
    const u2 = loadNotes(user.uid)
    setReady(true)
    return () => { u1(); u2() }
  }, [user, activeWorkspaceId])

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-base)' }}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Carregando workspace...</p>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onNewTask={() => newTaskFnRef.current?.()} />
        <main className="flex-1 overflow-auto p-6">
          {activeView === 'board'    && <BoardView onNewTaskRef={fn => { newTaskFnRef.current = fn }} />}
          {activeView === 'list'     && <ListView />}
          {activeView === 'calendar' && <CalendarView />}
          {activeView === 'notes'    && <NotesView />}
        </main>
      </div>
    </div>
  )
}
