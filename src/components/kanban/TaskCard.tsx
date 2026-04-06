import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, GripVertical, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/Badge'
import type { Task } from '@/lib/types'

export function TaskCard({ task, onEdit, onDelete }: { task: Task; onEdit: (t: Task) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={() => onEdit(task)}
      className={`group relative rounded-xl p-3.5 cursor-pointer select-none border transition-all ${isDragging ? 'opacity-50 scale-[1.02]' : ''}`}
    >
      <style>{`
        .task-card-base { background: var(--color-bg-elevated); border-color: var(--color-border); }
        .task-card-base:hover { border-color: oklch(75% 0.18 65 / 50%); box-shadow: var(--shadow-md); }
      `}</style>
      <div className="absolute inset-0 rounded-xl task-card-base pointer-events-none border" style={{ zIndex: -1 }} />

      <div {...attributes} {...listeners} onClick={e => e.stopPropagation()}
           className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
           style={{ color: 'var(--color-text-muted)' }}>
        <GripVertical size={14} />
      </div>

      <button
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded cursor-pointer"
        style={{ color: 'var(--color-text-muted)' }}
        onClick={e => { e.stopPropagation(); onDelete(task.id) }}>
        <Trash2 size={13} />
      </button>

      <div className="pl-3">
        <p className="text-sm font-medium leading-snug mb-2"
           style={{
             color: task.status === 'done' ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
             textDecoration: task.status === 'done' ? 'line-through' : 'none'
           }}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}
             dangerouslySetInnerHTML={{ __html: task.description.replace(/<[^>]*>/g, '') }} />
        )}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant={task.priority} />
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs"
                  style={{ color: task.dueDate < Date.now() && task.status !== 'done' ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
              <Calendar size={11} />
              {format(new Date(task.dueDate), 'dd MMM', { locale: ptBR })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
