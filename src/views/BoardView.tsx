import { useState, useEffect } from 'react'
import type { MutableRefObject } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import { useWorkspaceStore } from '@/store/workspace'
import { useAuthStore } from '@/store/auth'
import { updateTask } from '@/lib/db'
import type { Task, TaskStatus } from '@/lib/types'
import Column from '@/components/kanban/Column'
import TaskCard from '@/components/kanban/TaskCard'
import TaskModal from '@/components/kanban/TaskModal'

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'done']

export default function BoardView({ newTaskRef }: { newTaskRef: MutableRefObject<(() => void) | null> }) {
  const { tasks, activeWorkspaceId } = useWorkspaceStore()
  const { user } = useAuthStore()
  const uid = user?.uid ?? ''

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [modalTask, setModalTask]   = useState<Task | Partial<Task> | null>(null)

  useEffect(() => {
    newTaskRef.current = () => setModalTask({ status: 'todo', priority: 'medium', tags: [] })
  }, [])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const byStatus = (s: TaskStatus) => tasks.filter(t => t.status === s).sort((a, b) => a.order - b.order)

  function onDragStart({ active }: DragStartEvent) {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null)
  }

  async function onDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null)
    if (!over || active.id === over.id) return
    const dragged = tasks.find(t => t.id === active.id)
    if (!dragged) return
    const newStatus = COLUMNS.includes(over.id as TaskStatus)
      ? (over.id as TaskStatus)
      : tasks.find(t => t.id === over.id)?.status ?? dragged.status
    if (dragged.status !== newStatus) {
      await updateTask(uid, dragged.id, { status: newStatus })
    }
  }

  const total   = tasks.length
  const pending = tasks.filter(t => t.status !== 'done').length
  const done    = tasks.filter(t => t.status === 'done').length

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', background: 'var(--n-bg)' }}>
      {/* Page title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--n-text)', margin: 0, letterSpacing: '-0.01em' }}>
          Minhas Tarefas
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--n-text2)', margin: '5px 0 0' }}>
          {total > 0 ? `${pending} pendentes · ${done} concluídas` : 'Nenhuma tarefa ainda'}
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', paddingBottom: '20px', minWidth: 'max-content' }}>
          {COLUMNS.map(status => (
            <Column
              key={status}
              status={status}
              tasks={byStatus(status)}
              onAddTask={() => setModalTask({ status, priority: 'medium', tags: [] })}
              onEditTask={(task) => setModalTask(task)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div style={{ opacity: 0.92, transform: 'rotate(1.5deg)', pointerEvents: 'none' }}>
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {modalTask && (
        <TaskModal
          task={modalTask}
          workspaceId={activeWorkspaceId ?? ''}
          onClose={() => setModalTask(null)}
        />
      )}
    </div>
  )
}
