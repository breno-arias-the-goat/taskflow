import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAuthStore } from '@/store/auth'
import { deleteTask } from '@/lib/db'
import { formatDate, isOverdue } from '@/lib/utils'
import type { Task } from '@/lib/types'
import { PRIORITY_CONFIG } from '@/lib/types'

interface Props {
  task: Task
  onClick?: () => void
}

export default function TaskCard({ task, onClick }: Props) {
  const [hovered, setHovered] = useState(false)
  const { user } = useAuthStore()
  const uid = user?.uid ?? ''

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: sorting } = useSortable({ id: task.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: sorting ? 0.3 : 1 }

  const pc   = PRIORITY_CONFIG[task.priority]
  const over = isOverdue(task.dueDate, task.status)
  const done = task.status === 'done'

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'var(--n-bg)',
        border: `1px solid var(--n-border)`,
        borderLeft: `3px solid ${pc.color}`,
        borderRadius: '6px',
        padding: '10px 12px',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: hovered ? 'var(--n-shadow-md)' : 'var(--n-shadow)',
        transition: 'box-shadow 0.12s',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle */}
      {hovered && (
        <div
          {...attributes}
          {...listeners}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', left: '-14px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--n-text3)', cursor: 'grab', fontSize: '12px', opacity: 0.7,
            userSelect: 'none',
          }}
        >
          ⠿
        </div>
      )}

      {/* Title */}
      <p style={{
        margin: '0 0 6px', fontSize: '14px', fontWeight: 500, lineHeight: 1.4,
        color: done ? 'var(--n-text3)' : 'var(--n-text)',
        textDecoration: done ? 'line-through' : 'none',
        wordBreak: 'break-word',
        paddingRight: hovered ? '20px' : '0',
      }}>
        {task.title}
      </p>

      {/* Properties */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '3px',
          padding: '2px 6px', borderRadius: '4px',
          fontSize: '11px', fontWeight: 500,
          color: pc.color, background: pc.bg,
        }}>
          {pc.icon} {pc.label}
        </span>

        {task.dueDate && (
          <span style={{ fontSize: '11px', color: over ? 'var(--n-red)' : 'var(--n-text3)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            📅 {formatDate(task.dueDate)}
          </span>
        )}

        {task.tags?.slice(0, 2).map(tag => (
          <span key={tag} style={{ fontSize: '11px', color: 'var(--n-blue)', background: 'var(--n-blue-bg)', padding: '2px 6px', borderRadius: '4px' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Delete */}
      {hovered && (
        <button
          onClick={e => { e.stopPropagation(); deleteTask(uid, task.id) }}
          style={{
            position: 'absolute', top: '7px', right: '7px',
            width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'var(--n-bg3)',
            borderRadius: '4px', cursor: 'pointer',
            color: 'var(--n-text2)', fontSize: '14px', lineHeight: 1,
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--n-red-bg)'; e.currentTarget.style.color = 'var(--n-red)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--n-bg3)'; e.currentTarget.style.color = 'var(--n-text2)' }}
        >
          ×
        </button>
      )}
    </div>
  )
}
