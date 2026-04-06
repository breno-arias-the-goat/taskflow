import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { TaskCard } from './TaskCard'
import type { Task, TaskStatus } from '@/lib/types'

const COL: Record<TaskStatus, { label: string; color: string }> = {
  todo:        { label: 'A fazer',      color: 'var(--color-todo)' },
  in_progress: { label: 'Em progresso', color: 'var(--color-in-progress)' },
  done:        { label: 'Concluído',    color: 'var(--color-done)' },
  blocked:     { label: 'Bloqueado',    color: 'var(--color-blocked)' },
}

export function Column({ status, tasks, onAdd, onEdit, onDelete }: {
  status: TaskStatus; tasks: Task[]; onAdd: (s: TaskStatus) => void; onEdit: (t: Task) => void; onDelete: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const cfg = COL[status]

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{cfg.label}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full border" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
            {tasks.length}
          </span>
        </div>
        <button onClick={() => onAdd(status)} className="p-1 rounded cursor-pointer transition-colors"
                style={{ color: 'var(--color-text-muted)' }}>
          <Plus size={15} />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 min-h-24 rounded-xl p-2 space-y-2.5 transition-colors"
           style={{ background: isOver ? 'var(--color-accent-subtle)' : 'oklch(14% 0.008 260 / 50%)', border: isOver ? '1px dashed var(--color-accent)' : '1px solid transparent' }}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />)}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Arraste tarefas aqui
          </div>
        )}
      </div>
    </div>
  )
}
