import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useWorkspaceStore } from '@/store/workspace'

const DOT: Record<string, string> = { low: 'var(--color-text-muted)', medium: 'var(--color-warning)', high: 'var(--color-accent)', urgent: 'var(--color-danger)' }

export function CalendarView() {
  const { tasks } = useWorkspaceStore()
  const [current, setCurrent] = useState(new Date())
  const days = eachDayOfInterval({ start: startOfMonth(current), end: endOfMonth(current) })
  const offset = (startOfMonth(current).getDay() + 6) % 7

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold capitalize" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          {format(current, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex gap-1">
          <button onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1))} className="p-2 rounded-lg cursor-pointer transition-colors" style={{ color: 'var(--color-text-secondary)' }}><ChevronLeft size={16} /></button>
          <button onClick={() => setCurrent(new Date())} className="px-3 py-1.5 text-xs rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>Hoje</button>
          <button onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1))} className="p-2 rounded-lg cursor-pointer transition-colors" style={{ color: 'var(--color-text-secondary)' }}><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden border" style={{ background: 'var(--color-border)', borderColor: 'var(--color-border)' }}>
        {['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(d => (
          <div key={d} className="px-3 py-2 text-xs font-semibold text-center" style={{ background: 'var(--color-bg-surface)', color: 'var(--color-text-muted)' }}>{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} className="min-h-24" style={{ background: 'var(--color-bg-base)' }} />)}
        {days.map(day => {
          const dt = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day))
          return (
            <div key={day.toISOString()} className="min-h-24 p-2 transition-colors" style={{ background: 'var(--color-bg-surface)' }}>
              <div className="w-6 h-6 flex items-center justify-center text-xs font-medium rounded-full mb-1.5"
                   style={{ background: isToday(day) ? 'var(--color-accent)' : 'transparent', color: isToday(day) ? 'var(--color-bg-base)' : 'var(--color-text-secondary)' }}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dt.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-1.5 text-xs truncate">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: DOT[t.priority] }} />
                    <span className="truncate" style={{ color: t.status === 'done' ? 'var(--color-text-muted)' : 'var(--color-text-primary)', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>{t.title}</span>
                  </div>
                ))}
                {dt.length > 3 && <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>+{dt.length - 3} mais</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
