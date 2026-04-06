import { LayoutGrid, List, Calendar, FileText, Settings, ChevronLeft, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useWorkspaceStore } from '@/store/workspace'
import { Logo } from '@/components/ui/Logo'

const NAV = [
  { icon: LayoutGrid, label: 'Board',      view: 'board'    as const },
  { icon: List,       label: 'Lista',      view: 'list'     as const },
  { icon: Calendar,   label: 'Calendário', view: 'calendar' as const },
  { icon: FileText,   label: 'Notas',      view: 'notes'    as const },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const { sidebarOpen, activeView, toggleSidebar, setActiveView, workspaces, activeWorkspaceId } = useWorkspaceStore()
  const activeWs = workspaces.find(w => w.id === activeWorkspaceId)

  return (
    <aside className="flex flex-col shrink-0 transition-all duration-200 border-r"
           style={{ width: sidebarOpen ? '220px' : '56px', background: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between p-3 h-14 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {sidebarOpen && (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xl">{activeWs?.emoji ?? '🏠'}</span>
            <span className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
              {activeWs?.name ?? 'TaskFlow'}
            </span>
          </div>
        )}
        {!sidebarOpen && <Logo size={28} />}
        <button onClick={toggleSidebar} className="p-1 rounded cursor-pointer ml-auto transition-colors"
                style={{ color: 'var(--color-text-muted)' }}>
          <ChevronLeft size={16} style={{ transform: sidebarOpen ? '' : 'rotate(180deg)', transition: 'transform 200ms' }} />
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {NAV.map(({ icon: Icon, label, view }) => (
          <button key={view} onClick={() => setActiveView(view)} title={!sidebarOpen ? label : undefined}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={{
                    background: activeView === view ? 'var(--color-accent-subtle)' : 'transparent',
                    color: activeView === view ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  }}>
            <Icon size={17} className="shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-2 border-t space-y-0.5" style={{ borderColor: 'var(--color-border)' }}>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }} title={!sidebarOpen ? 'Configurações' : undefined}>
          <Settings size={17} className="shrink-0" />
          {sidebarOpen && <span>Configurações</span>}
        </button>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }} title={!sidebarOpen ? 'Sair' : undefined}>
          <LogOut size={17} className="shrink-0" />
          {sidebarOpen && <span>Sair</span>}
        </button>
        {sidebarOpen && user && (
          <div className="flex items-center gap-2 px-3 py-2">
            {user.photoURL
              ? <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
              : <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                     style={{ background: 'var(--color-accent)', color: 'var(--color-bg-base)' }}>
                  {user.displayName?.[0] ?? user.email?.[0] ?? '?'}
                </div>
            }
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{user.displayName || 'Usuário'}</p>
              <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
