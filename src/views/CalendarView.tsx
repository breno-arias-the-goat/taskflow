import { useState, useEffect } from 'react'
import type { MutableRefObject } from 'react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday,
  addMonths, subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useWorkspaceStore } from '@/store/workspace'
import type { Task } from '@/lib/types'
import { PRIORITY_CONFIG } from '@/lib/types'
import TaskModal from '@/components/kanban/TaskModal'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarView({ newTaskRef }: { newTaskRef: MutableRefObject<(() => void) | null> }) {
  const { tasks, activeWorkspaceId } = useWorkspaceStore()
  const [current, setCurrent] = useState(new Date())
  const [modalTask, setModal] = useState<Task | Partial<Task> | null>(null)

  useEffect(() => {
    newTaskRef.current = () => setModal({ status: 'todo', priority: 'medium', tags: [], dueDate: Date.now() })
  }, [])

  const monthStart = startOfMonth(current)
  const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(endOfMonth(current)) })

  const tasksForDay = (day: Date) => tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day))

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', background: 'var(--n-bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--n-text)', margin: 0, letterSpacing: '-0.01em', flex: 1 }}>
          Calendário
        </h1>
        <button onClick={() => setCurrent(new Date())} style={pillBtnStyle}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >Hoje</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <NavBtn onClick={() => setCurrent(d => subMonths(d, 1))}>‹</NavBtn>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--n-text)', minWidth: '144px', textAlign: 'center' }}>
            {format(current, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <NavBtn onClick={() => setCurrent(d => addMonths(d, 1))}>›</NavBtn>
        </div>
      </div>

      {/* Grid */}
      <div style={{ border: `1px solid var(--n-border)`, borderRadius: '8px', overflow: 'hidden' }}>
        {/* Weekday row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--n-bg2)', borderBottom: `1px solid var(--n-border)` }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--n-text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
          ))}
        </div>

        {/* Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days.map((day, idx) => {
            const dayTasks = tasksForDay(day)
            const inMonth  = isSameMonth(day, current)
            const today    = isToday(day)
            const col      = (idx + 1) % 7 !== 0
            const row      = idx < days.length - 7

            return (
              <div
                key={day.toISOString()}
                onClick={() => setModal({ status: 'todo', priority: 'medium', tags: [], dueDate: day.getTime() })}
                style={{
                  minHeight: '96px', padding: '8px',
                  borderRight:  col ? `1px solid var(--n-border)` : 'none',
                  borderBottom: row ? `1px solid var(--n-border)` : 'none',
                  background: today ? 'var(--n-accent-light)' : 'var(--n-bg)',
                  opacity: inMonth ? 1 : 0.38,
                  cursor: 'pointer',
                  transition: 'background 0.08s',
                }}
                onMouseEnter={e => { if (!today) e.currentTarget.style.background = 'var(--n-hover)' }}
                onMouseLeave={e => { if (!today) e.currentTarget.style.background = 'var(--n-bg)' }}
              >
                {/* Day number */}
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', marginBottom: '4px',
                  fontWeight: today ? 700 : 400,
                  background: today ? 'var(--n-accent)' : 'none',
                  color: today ? 'white' : inMonth ? 'var(--n-text)' : 'var(--n-text3)',
                }}>
                  {format(day, 'd')}
                </div>

                {/* Task chips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      onClick={e => { e.stopPropagation(); setModal(task) }}
                      style={{
                        padding: '2px 6px', borderRadius: '3px', fontSize: '11px',
                        background: PRIORITY_CONFIG[task.priority].bg,
                        color: PRIORITY_CONFIG[task.priority].color,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        cursor: 'pointer', fontWeight: 500,
                      }}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div style={{ fontSize: '11px', color: 'var(--n-text3)', padding: '0 4px' }}>+{dayTasks.length - 3} mais</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {modalTask && (
        <TaskModal task={modalTask} workspaceId={activeWorkspaceId ?? ''} onClose={() => setModal(null)} />
      )}
    </div>
  )
}

function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', border: `1px solid var(--n-border)`, background: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--n-text)', fontFamily: 'inherit', lineHeight: 1 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >{children}</button>
  )
}

const pillBtnStyle: React.CSSProperties = {
  padding: '5px 11px', borderRadius: '6px',
  border: `1px solid var(--n-border)`, background: 'none',
  cursor: 'pointer', fontSize: '13px', color: 'var(--n-text)', fontFamily: 'inherit',
  transition: 'background 0.1s',
}
