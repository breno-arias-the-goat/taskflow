import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useWorkspaceStore } from '@/store/workspace'
import { createTask, updateTask, deleteTask } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'
import { TaskModal } from '@/components/kanban/TaskModal'
import type { Task, TaskStatus } from '@/lib/types'

const ORDER: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'done']

export function ListView() {
  const { user } = useAuthStore()
  const { tasks, activeWorkspaceId } = useWorkspaceStore()
  const [collapsed, setCollapsed]   = useState<Set<TaskStatus>>(new Set())
  const [modalTask, setModalTask]   = useState<Partial<Task> | null>(null)
  const [modalOpen, setModalOpen]   = useState(false)

  const toggle = (s: TaskStatus) => setCollapsed(c => { const n = new Set(c); n.has(s) ? n.delete(s) : n.add(s); return n })

  const handleSave = async (data: Partial<Task>) => {
    if (!user || !activeWorkspaceId) return
    if (modalTask?.id) await updateTask(user.uid, modalTask.id, data)
    else await createTask(user.uid, { workspaceId: activeWorkspaceId, projectId: null, title: data.title ?? '', description: data.description ?? '', status: data.status ?? 'todo', priority: data.priority ?? 'medium', dueDate: data.dueDate ?? null, tags: [], order: tasks.length })
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-2">
        <button onClick={() => { setModalTask({ status: 'todo', workspaceId: activeWorkspaceId! }); setModalOpen(true) }}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border border-dashed text-sm transition-all cursor-pointer"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          <Plus size={15} /> Nova tarefa
        </button>

        {ORDER.map(status => {
          const grouped = tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order)
          const isCol = collapsed.has(status)
          return (
            <div key={status} className="rounded-xl overflow-hidden border" style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
              <button onClick={() => toggle(status)} className="w-full flex items-center gap-2 px-4 py-2.5 transition-colors cursor-pointer"
                      style={{ color: 'var(--color-text-secondary)' }}>
                {isCol ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                <Badge variant={status} />
                <span className="ml-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>{grouped.length}</span>
              </button>
              {!isCol && grouped.map(task => (
                <div key={task.id} className="flex items-center gap-3 px-4 py-3 border-t group cursor-pointer transition-colors"
                     style={{ borderColor: 'var(--color-border-subtle)' }}
                     onClick={() => { setModalTask(task); setModalOpen(true) }}>
                  <button onClick={e => { e.stopPropagation(); if (user) updateTask(user.uid, task.id, { status: task.status === 'done' ? 'todo' : 'done' }) }}
                          className="w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-all"
                          style={{ background: task.status === 'done' ? 'var(--color-done)' : 'transparent', borderColor: task.status === 'done' ? 'var(--color-done)' : 'var(--color-border)' }}>
                    {task.status === 'done' && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                  <span className="flex-1 text-sm" style={{ color: task.status === 'done' ? 'var(--color-text-muted)' : 'var(--color-text-primary)', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                    {task.title}
                  </span>
                  <Badge variant={task.priority} />
                  {task.dueDate && (
                    <span className="flex items-center gap-1 text-xs shrink-0"
                          style={{ color: task.dueDate < Date.now() && task.status !== 'done' ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                      <Calendar size={11} />
                      {format(new Date(task.dueDate), 'dd MMM', { locale: ptBR })}
                    </span>
                  )}
                  <button onClick={e => { e.stopPropagation(); if (user) deleteTask(user.uid, task.id) }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all cursor-pointer"
                          style={{ color: 'var(--color-text-muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )
        })}
      </div>
      {modalOpen && <TaskModal task={modalTask ?? {}} onSave={handleSave} onClose={() => setModalOpen(false)} />}
    </>
  )
}
