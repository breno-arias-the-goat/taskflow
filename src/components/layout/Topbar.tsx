import type { MutableRefObject } from 'react'
import { useWorkspaceStore } from '@/store/workspace'
import type { ViewType } from '@/lib/types'
import { toggleTheme, currentTheme } from '@/lib/utils'
import { useState } from 'react'

const TABS: { id: ViewType; label: string }[] = [
  { id: 'board',    label: 'Quadro' },
  { id: 'list',     label: 'Lista' },
  { id: 'calendar', label: 'Calendário' },
  { id: 'notes',    label: 'Notas' },
]

const VIEW_LABEL: Record<ViewType, string> = {
  board: 'Quadro', list: 'Lista', calendar: 'Calendário', notes: 'Notas',
}

interface TopbarProps {
  newTaskRef: MutableRefObject<(() => void) | null>
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function Topbar({ newTaskRef, sidebarOpen, onToggleSidebar }: TopbarProps) {
  const { activeView, setActiveView, workspaces, activeWorkspaceId } = useWorkspaceStore()
  const ws = workspaces.find(w => w.id === activeWorkspaceId)
  const [theme, setTheme] = useState<'light' | 'dark'>(currentTheme)

  function handleThemeToggle() {
    const next = toggleTheme()
    setTheme(next)
  }

  return (
    <header style={{
      height: '44px', flexShrink: 0,
      borderBottom: `1px solid var(--n-border)`,
      display: 'flex', alignItems: 'center',
      padding: '0 12px', gap: '6px',
      background: 'var(--n-bg)',
    }}>
      {/* Sidebar toggle */}
      <IconBtn onClick={onToggleSidebar} title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}>
        <SidebarToggleIcon />
      </IconBtn>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: 'var(--n-text2)' }}>
        <span style={{ fontSize: '16px' }}>{ws?.emoji ?? '🏠'}</span>
        <span style={{ color: 'var(--n-text)', fontWeight: 500 }}>{ws?.name ?? 'Workspace'}</span>
        <span style={{ color: 'var(--n-text3)', margin: '0 1px' }}>/</span>
        <span>{VIEW_LABEL[activeView]}</span>
      </div>

      {/* View tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '10px' }}>
        {TABS.map(tab => {
          const active = activeView === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                padding: '4px 9px', borderRadius: '4px', border: 'none',
                cursor: 'pointer', fontSize: '13px',
                background: active ? 'var(--n-bg3)' : 'none',
                color: active ? 'var(--n-text)' : 'var(--n-text2)',
                fontWeight: active ? 500 : 400,
                transition: 'all 0.08s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--n-hover)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'none' }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <IconBtn onClick={handleThemeToggle} title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </IconBtn>

      {/* New task */}
      {activeView !== 'notes' && (
        <button
          onClick={() => newTaskRef.current?.()}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 11px', borderRadius: '6px', border: 'none',
            background: 'var(--n-text)', color: 'var(--n-bg)',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            transition: 'opacity 0.1s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <span style={{ fontSize: '15px', lineHeight: 1 }}>+</span>
          Nova tarefa
        </button>
      )}
    </header>
  )
}

function IconBtn({ onClick, title, children }: { onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '5px', border: 'none', background: 'none', cursor: 'pointer',
        color: 'var(--n-text2)', fontSize: '14px', lineHeight: 1, flexShrink: 0,
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      {children}
    </button>
  )
}

function SidebarToggleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5.5 2.5v11" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}
