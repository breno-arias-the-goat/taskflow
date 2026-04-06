import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { listenWorkspaces, createWorkspace, listenTasks, listenNotes } from '@/lib/db'
import type { Workspace, Task, Note } from '@/lib/types'

interface WorkspaceState {
  workspaces:          Workspace[]
  activeWorkspaceId:   string | null
  tasks:               Task[]
  notes:               Note[]
  sidebarOpen:         boolean
  activeView:          'board' | 'list' | 'calendar' | 'notes'
  loadWorkspaces:      (uid: string) => () => void
  loadTasks:           (uid: string) => () => void
  loadNotes:           (uid: string) => () => void
  setActiveWorkspace:  (id: string) => void
  setActiveView:       (v: WorkspaceState['activeView']) => void
  toggleSidebar:       () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: [], activeWorkspaceId: null, tasks: [], notes: [],
      sidebarOpen: true, activeView: 'board',

      loadWorkspaces: (uid) => listenWorkspaces(uid, async (ws) => {
        set({ workspaces: ws })
        if (ws.length === 0) {
          const newWs = await createWorkspace(uid, {
            name: 'Meu Workspace', emoji: '🏠', color: 'oklch(75% 0.18 65)', ownerId: uid
          })
          set({ workspaces: [newWs], activeWorkspaceId: newWs.id })
        } else if (!get().activeWorkspaceId) {
          set({ activeWorkspaceId: ws[0].id })
        }
      }),

      loadTasks: (uid) => {
        const wsId = get().activeWorkspaceId
        if (!wsId) return () => {}
        return listenTasks(uid, wsId, (tasks) => set({ tasks }))
      },

      loadNotes: (uid) => {
        const wsId = get().activeWorkspaceId
        if (!wsId) return () => {}
        return listenNotes(uid, wsId, (notes) => set({ notes }))
      },

      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
      setActiveView: (v) => set({ activeView: v }),
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: 'taskflow-ws',
      partialize: s => ({ activeWorkspaceId: s.activeWorkspaceId, sidebarOpen: s.sidebarOpen, activeView: s.activeView })
    }
  )
)
