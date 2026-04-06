import { useState, useCallback } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay, closestCorners } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { useAuthStore } from '@/store/auth'
import { useWorkspaceStore } from '@/store/workspace'
import { createTask, updateTask, deleteTask } from '@/lib/db'
import { Column } from '@/components/kanban/Column'
import { TaskCard } from '@/components/kanban/TaskCard'
import { TaskModal } from '@/components/kanban/TaskModal'
import type { Task, TaskStatus } from '@/lib/types'

const COLS: TaskStatus[] = ['todo', 'in_progress', 'done', 'blocked']

export function BoardView({ onNewTaskRef }: { onNewTaskRef?: (fn: () => void) => void }) {
  const { user }  = useAuthStore()
  const { tasks, activeWorkspaceId } = useWorkspaceStore()
  const [dragTask, setDragTask]   = useState<Task | null>(null)
  const [modalTask, setModalTask] = useState<Partial<Task> | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const byStatus = useCallback((s: TaskStatus) =>
    tasks.filter(t => t.status === s).sort((a, b) => a.order - b.order), [tasks])

  const openNew = useCallback((status: TaskStatus = 'todo') => {
    setModalTask({ status, workspaceId: activeWorkspaceId!, order: tasks.length })
    setModalOpen(true)
  }, [activeWorkspaceId, tasks.length])

  if (onNewTaskRef) onNewTaskRef(() => openNew())

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setDragTask(null)
    if (!over || !user) return
    const task = tasks.find(t => t.id === active.id)!
    const newStatus: TaskStatus = COLS.includes(over.id as TaskStatus)
      ? (over.id as TaskStatus)
      : (tasks.find(t => t.id === over.id)?.status ?? task.status)
    if (task.status !== newStatus) await updateTask(user.uid, task.id, { status: newStatus })
  }

  const handleSave = async (data: Partial<Task>) => {
    if (!user || !activeWorkspaceId) return
    if (modalTask?.id) await updateTask(user.uid, modalTask.id, data)
    else await createTask(user.uid, { workspaceId: activeWorkspaceId, projectId: null, title: data.title ?? '', description: data.description ?? '', status: data.status ?? 'todo', priority: data.priority ?? 'medium', dueDate: data.dueDate ?? null, tags: [], order: tasks.length })
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners}
                  onDragStart={({ active }) => setDragTask(tasks.find(t => t.id === active.id) ?? null)}
                  onDragEnd={handleDragEnd}>
        <div className="flex gap-5 h-full overflow-x-auto pb-4">
          {COLS.map(s => (
            <Column key={s} status={s} tasks={byStatus(s)} onAdd={openNew}
                    onEdit={t => { setModalTask(t); setModalOpen(true) }}
                    onDelete={async id => { if (user) await deleteTask(user.uid, id) }} />
          ))}
        </div>
        <DragOverlay>
          {dragTask && <div className="rotate-1 opacity-90"><TaskCard task={dragTask} onEdit={() => {}} onDelete={() => {}} /></div>}
        </DragOverlay>
      </DndContext>
      {modalOpen && <TaskModal task={modalTask ?? {}} onSave={handleSave} onClose={() => setModalOpen(false)} />}
    </>
  )
}
