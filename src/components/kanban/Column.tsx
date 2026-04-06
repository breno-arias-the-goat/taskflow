import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, TaskStatus } from '@/lib/types'
import { STATUS_CONFIG } from '@/lib/types'
import TaskCard from './TaskCard'

interface ColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
}

export default function Column({ status, tasks, onAddTask, onEditTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const cfg = STATUS_CONFIG[status]

  return (
    <div style={{ width: '268px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0, display: 'block' }} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--n-text)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>
          {cfg.label}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--n-text3)' }}>{tasks.length}</span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1, minHeight: '60px',
          borderRadius: '6px', padding: '3px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          background: isOver ? 'var(--n-accent-light)' : 'transparent',
          border: isOver ? `1.5px dashed var(--n-accent)` : '1.5px solid transparent',
          transition: 'background 0.1s, border-color 0.1s',
        }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onEditTask(task)} />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div style={{ padding: '16px 8px', textAlign: 'center', color: 'var(--n-text3)', fontSize: '13px' }}>
            Sem tarefas
          </div>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={onAddTask}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '6px 8px', marginTop: '4px',
          border: 'none', background: 'none', cursor: 'pointer',
          color: 'var(--n-text3)', fontSize: '13px', borderRadius: '5px',
          width: '100%', transition: 'all 0.1s', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--n-hover)'; e.currentTarget.style.color = 'var(--n-text2)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--n-text3)' }}
      >
        <span style={{ fontSize: '15px', lineHeight: 1 }}>+</span>
        Nova tarefa
      </button>
    </div>
  )
}
