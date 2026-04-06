import { useAuthStore } from '@/store/auth'
import { useWorkspaceStore } from '@/store/workspace'
import type { ViewType } from '@/lib/types'

const NAV: { id: ViewType; label: string; icon: string }[] = [
  { id: 'board',    label: 'Quadro',    icon: '⊞' },
  { id: 'list',     label: 'Lista',     icon: '≡' },
  { id: 'calendar', label: 'Calendário', icon: '◫' },
  { id: 'notes',    label: 'Notas',     icon: '◱' },
]

export default function Sidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const { user, logout } = useAuthStore()
  const { activeView, setActiveView, workspaces, activeWorkspaceId, tasks } = useWorkspaceStore()

  const ws = workspaces.find(w => w.id === activeWorkspaceId)
  const pending = tasks.filter(t => t.status !== 'done').length
  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Usuário'

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.15)' }}
          className="lg:hidden"
        />
      )}

      <aside style={{
        width: isOpen ? '240px' : '0',
        minWidth: isOpen ? '240px' : '0',
        background: 'var(--n-bg2)',
        borderRight: `1px solid var(--n-border)`,
        overflow: 'hidden',
        transition: 'width 0.2s ease, min-width 0.2s ease',
        display: 'flex', flexDirection: 'column',
        height: '100%', zIndex: 10, flexShrink: 0,
      }}>
        {/* Workspace header */}
        <div style={{ padding: '10px 8px 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '6px' }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{ws?.emoji ?? '🏠'}</span>
            <span style={{ fontWeight: 600, fontSize: '14px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--n-text)' }}>
              {ws?.name ?? 'Workspace'}
            </span>
          </div>
        </div>

        {/* Search hint */}
        <div style={{ padding: '2px 8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '5px 8px', borderRadius: '6px',
            color: 'var(--n-text3)', fontSize: '13px',
            background: 'var(--n-bg3)', cursor: 'default',
          }}>
            <SearchIcon />
            <span style={{ flex: 1 }}>Buscar</span>
            <kbd style={{ fontSize: '10px', background: 'var(--n-bg4)', padding: '1px 5px', borderRadius: '3px', color: 'var(--n-text3)' }}>⌘K</kbd>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px 8px', overflow: 'auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--n-text3)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px', marginBottom: '4px', marginTop: 0 }}>
            Páginas
          </p>

          {NAV.map(item => {
            const isActive = activeView === item.id
            const badge = (item.id === 'board' || item.id === 'list') ? pending : undefined
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '5px 8px', borderRadius: '5px', border: 'none',
                  cursor: 'pointer', fontSize: '14px',
                  background: isActive ? 'var(--n-active)' : 'none',
                  color: 'var(--n-text)',
                  fontWeight: isActive ? 500 : 400,
                  marginBottom: '1px',
                  transition: 'background 0.08s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--n-hover)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none' }}
              >
                <span style={{ fontSize: '15px', width: '20px', textAlign: 'center', lineHeight: 1 }}>{item.icon}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {badge !== undefined && badge > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--n-text3)', background: 'var(--n-bg3)', borderRadius: '4px', padding: '1px 5px', fontWeight: 500 }}>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: `1px solid var(--n-border)`, padding: '8px' }}>
          <button
            onClick={() => logout()}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
              padding: '6px 8px', borderRadius: '6px', border: 'none',
              background: 'none', cursor: 'pointer', color: 'var(--n-text)',
              transition: 'background 0.1s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0 }} />
            ) : (
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--n-accent)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, flexShrink: 0,
              }}>
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden', minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{firstName}</p>
              <p style={{ fontSize: '11px', color: 'var(--n-text3)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
            </div>
            <LogoutIcon />
          </button>
        </div>
      </aside>
    </>
  )
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--n-text3)', flexShrink: 0 }}>
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
