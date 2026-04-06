import { useState, useEffect } from 'react'
import type { MutableRefObject } from 'react'
import { useWorkspaceStore } from '@/store/workspace'
import { useAuthStore } from '@/store/auth'
import { updateTask, deleteTask } from '@/lib/db'
import { formatDate, isOverdue } from '@/lib/utils'
import type { Task, TaskStatus } from '@/lib/types'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/types'
import TaskModal from '@/components/kanban/TaskModal'

export default function ListView({ newTaskRef }: { newTaskRef: MutableRefObject<(() => void) | null> }) {
  const { tasks, activeWorkspaceId } = useWorkspaceStore()
  const { user } = useAuthStore()
  const uid = user?.uid ?? ''

  const [modalTask, setModalTask] = useState<Task | Partial<Task> | null>(null)
  const [filter, setFilter]       = useState<TaskStatus | 'all'>('all')
  const [sortBy, setSortBy]       = useState<'created' | 'due' | 'priority'>('created')

  useEffect(() => {
    newTaskRef.current = () => setModalTask({ status: 'todo', priority: 'medium', tags: [] })
  }, [])

  const filtered = tasks
    .filter(t => filter === 'all' || t.status === filter)
    .sort((a, b) => {
      if (sortBy === 'due') {
        if (!a.dueDate) return 1; if (!b.dueDate) return -1
        return a.dueDate - b.dueDate
      }
      if (sortBy === 'priority') {
        const ord = { urgent: 0, high: 1, medium: 2, low: 3 }
        return ord[a.priority] - ord[b.priority]
      }
      return b.createdAt - a.createdAt
    })

  const FILTER_OPTS: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all',         label: 'Todas' },
    { value: 'todo',        label: 'A fazer' },
    { value: 'in_progress', label: 'Em andamento' },
    { value: 'blocked',     label: 'Bloqueadas' },
    { value: 'done',        label: 'Concluídas' },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'var(--n-bg)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 28px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--n-text)', margin: 0, letterSpacing: '-0.01em' }}>
            Lista de Tarefas
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--n-text2)', margin: '5px 0 0' }}>
            {tasks.length} tarefas · {tasks.filter(t => t.status === 'done').length} concluídas
          </p>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '2px', background: 'var(--n-bg2)', borderRadius: '6px', padding: '2px' }}>
            {FILTER_OPTS.map(opt => {
              const count = opt.value === 'all' ? undefined : tasks.filter(t => t.status === opt.value).length
              const active = filter === opt.value
              return (
                <button key={opt.value} onClick={() => setFilter(opt.value)}
                  style={{
                    padding: '4px 9px', borderRadius: '4px', border: 'none',
                    cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                    fontWeight: active ? 500 : 400,
                    background: active ? 'var(--n-bg)' : 'none',
                    color: active ? 'var(--n-text)' : 'var(--n-text2)',
                    boxShadow: active ? 'var(--n-shadow)' : 'none',
                    transition: 'all 0.1s',
                  }}
                >
                  {opt.label}
                  {count !== undefined && <span style={{ marginLeft: '4px', color: 'var(--n-text3)' }}>{count}</span>}
                </button>
              )
            })}
          </div>

          <div style={{ flex: 1 }} />

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--n-text2)' }}>
            <span>Ordenar por:</span>
            <select
              value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              style={{ border: `1px solid var(--n-border)`, borderRadius: '5px', background: 'var(--n-bg)', color: 'var(--n-text)', fontSize: '13px', padding: '4px 8px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <option value="created">Criação</option>
              <option value="due">Prazo</option>
              <option value="priority">Prioridade</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ border: `1px solid var(--n-border)`, borderRadius: '8px', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 110px 100px 32px', padding: '7px 14px', background: 'var(--n-bg2)', borderBottom: `1px solid var(--n-border)`, fontSize: '11px', fontWeight: 600, color: 'var(--n-text3)', textTransform: 'uppercase', letterSpacing: '0.05em', gap: '8px', alignItems: 'center' }}>
            <span>Nome</span>
            <span>Status</span>
            <span>Prioridade</span>
            <span>Prazo</span>
            <span />
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--n-text3)', fontSize: '14px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📭</div>
              Nenhuma tarefa
            </div>
          ) : (
            filtered.map((task, i) => (
              <TaskRow
                key={task.id} task={task}
                isLast={i === filtered.length - 1}
                onEdit={() => setModalTask(task)}
                onToggle={() => updateTask(uid, task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                onDelete={() => deleteTask(uid, task.id)}
              />
            ))
          )}

          {/* Add row */}
          <button
            onClick={() => setModalTask({ status: 'todo', priority: 'medium', tags: [] })}
            style={{ width: '100%', padding: '10px 14px', border: 'none', borderTop: `1px solid var(--n-border)`, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--n-text3)', fontSize: '13px', fontFamily: 'inherit', transition: 'background 0.1s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <span style={{ fontSize: '15px' }}>+</span> Nova tarefa
          </button>
        </div>
      </div>

      {modalTask && (
        <TaskModal task={modalTask} workspaceId={activeWorkspaceId ?? ''} onClose={() => setModalTask(null)} />
      )}
    </div>
  )
}

function TaskRow({ task, isLast, onEdit, onToggle, onDelete }: {
  task: Task; isLast: boolean
  onEdit: () => void; onToggle: () => void; onDelete: () => void
}) {
  const [hov, setHov] = useState(false)
  const sc  = STATUS_CONFIG[task.status]
  const pc  = PRIORITY_CONFIG[task.priority]
  const done = task.status === 'done'
  const over = isOverdue(task.dueDate, task.status)

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 130px 110px 100px 32px', padding: '0 14px', borderBottom: isLast ? 'none' : `1px solid var(--n-border)`, background: hov ? 'var(--n-hover)' : 'var(--n-bg)', cursor: 'pointer', alignItems: 'center', gap: '8px', minHeight: '40px', transition: 'background 0.08s' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', overflow: 'hidden' }} onClick={onEdit}>
        <button
          onClick={e => { e.stopPropagation(); onToggle() }}
          style={{ width: 15, height: 15, borderRadius: '3px', border: `1.5px solid ${done ? 'var(--n-green)' : 'var(--n-border)'}`, background: done ? 'var(--n-green)' : 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '9px', transition: 'all 0.12s' }}
        >
          {done && '✓'}
        </button>
        <span style={{ fontSize: '14px', color: done ? 'var(--n-text3)' : 'var(--n-text)', textDecoration: done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.title}
        </span>
      </div>

      {/* Status */}
      <div onClick={onEdit}>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, background: sc.bg, color: sc.color, whiteSpace: 'nowrap' }}>
          {sc.label}
        </span>
      </div>

      {/* Priority */}
      <div onClick={onEdit}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 7px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, background: pc.bg, color: pc.color }}>
          {pc.icon} {pc.label}
        </span>
      </div>

      {/* Due date */}
      <div onClick={onEdit} style={{ fontSize: '13px', color: over ? 'var(--n-red)' : task.dueDate ? 'var(--n-text2)' : 'var(--n-text3)', whiteSpace: 'nowrap' }}>
        {task.dueDate ? formatDate(task.dueDate) : '—'}
      </div>

      {/* Delete */}
      <div>
        {hov && (
          <button onClick={e => { e.stopPropagation(); onDelete() }}
            style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--n-text3)', borderRadius: '4px', fontSize: '16px', transition: 'all 0.1s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--n-red-bg)'; e.currentTarget.style.color = 'var(--n-red)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--n-text3)' }}
          >×</button>
        )}
      </div>
    </div>
  )
}
