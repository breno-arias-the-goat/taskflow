import { useState } from 'react'
import { X, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Task, TaskStatus, TaskPriority } from '@/lib/types'

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent']
const PRIORITY_LABELS: Record<TaskPriority, string> = { low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente' }
const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done', 'blocked']
const STATUS_LABELS: Record<TaskStatus, string> = { todo: 'A fazer', in_progress: 'Em progresso', done: 'Concluído', blocked: 'Bloqueado' }

const SEL = "h-10 border rounded-lg px-3 text-sm outline-none cursor-pointer w-full"

export function TaskModal({ task, onSave, onClose }: { task?: Partial<Task>; onSave: (d: Partial<Task>) => void; onClose: () => void }) {
  const [title, setTitle]           = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus]         = useState<TaskStatus>(task?.status ?? 'todo')
  const [priority, setPriority]     = useState<TaskPriority>(task?.priority ?? 'medium')
  const [dueDate, setDueDate]       = useState(task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '')

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
         style={{ background: 'oklch(0% 0 0 / 60%)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border shadow-[var(--shadow-lg)]"
           style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            {task?.id ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded cursor-pointer transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}><X size={16} /></button>
        </div>

        <div className="p-5 space-y-4">
          <Input label="Título" placeholder="O que precisa ser feito?" value={title}
                 onChange={e => setTitle(e.target.value)} autoFocus />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Descrição</label>
            <textarea className="w-full min-h-20 rounded-lg px-3 py-2 text-sm border outline-none resize-none transition-all"
                      style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      placeholder="Detalhes adicionais..." value={description}
                      onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Status</label>
              <select className={SEL} value={status} onChange={e => setStatus(e.target.value as TaskStatus)}
                      style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Prioridade</label>
              <select className={SEL} value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}
                      style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <Calendar size={13} /> Prazo
            </label>
            <input type="date" className={`${SEL} px-3`} value={dueDate} onChange={e => setDueDate(e.target.value)}
                   style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
          </div>
        </div>

        <div className="flex gap-2 justify-end p-5 pt-0">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => { if (!title.trim()) return; onSave({ title: title.trim(), description, status, priority, dueDate: dueDate ? new Date(dueDate).getTime() : null }); onClose() }} disabled={!title.trim()}>
            {task?.id ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
