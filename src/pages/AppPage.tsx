import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth'
import { useWorkspaceStore } from '@/store/workspace'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import BoardView from '@/views/BoardView'
import ListView from '@/views/ListView'
import CalendarView from '@/views/CalendarView'
import NotesView from '@/views/NotesView'

export default function AppPage() {
  const { user } = useAuthStore()
  const { loadWorkspaces, loadTasks, loadNotes, activeView, activeWorkspaceId, sidebarOpen, toggleSidebar } = useWorkspaceStore()
  const newTaskRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!user) return
    const unsub = loadWorkspaces(user.uid)
    return () => unsub?.()
  }, [user?.uid])

  useEffect(() => {
    if (!user || !activeWorkspaceId) return
    const u1 = loadTasks(user.uid)
    const u2 = loadNotes(user.uid)
    return () => { u1?.(); u2?.() }
  }, [user?.uid, activeWorkspaceId])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--n-bg)' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <Topbar newTaskRef={newTaskRef} sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeView === 'board'    && <BoardView    newTaskRef={newTaskRef} />}
          {activeView === 'list'     && <ListView     newTaskRef={newTaskRef} />}
          {activeView === 'calendar' && <CalendarView newTaskRef={newTaskRef} />}
          {activeView === 'notes'    && <NotesView />}
        </main>
      </div>
    </div>
  )
}
