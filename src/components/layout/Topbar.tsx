import { Plus, Search } from 'lucide-react'
import { useWorkspaceStore } from '@/store/workspace'

const VIEW_LABELS = { board: 'Board Kanban', list: 'Lista de Tarefas', calendar: 'Calendário', notes: 'Notas' }

export function Topbar({ onNewTask }: { onNewTask: () => void }) {
  const { activeView } = useWorkspaceStore()
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b shrink-0"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-base)' }}>
      <h1 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
        {VIEW_LABELS[activeView]}
      </h1>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 h-8 px-3 rounded-lg border text-sm w-44 cursor-text"
             style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          <Search size={13} />
          <span className="flex-1">Buscar...</span>
          <kbd className="text-xs px-1.5 py-0.5 rounded border" style={{ background: 'var(--color-bg-overlay)', borderColor: 'var(--color-border)' }}>⌘K</kbd>
        </div>
        {activeView !== 'notes' && (
          <button onClick={onNewTask} className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg-base)' }}>
            <Plus size={15} /> Nova tarefa
          </button>
        )}
      </div>
    </header>
  )
}
