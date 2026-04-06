import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useAuthStore } from '@/store/auth'
import { createTask, updateTask } from '@/lib/db'
import type { Task, TaskStatus, TaskPriority } from '@/lib/types'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/types'

const PAGE_EMOJIS = ['📝', '🔥', '⚡', '🎯', '💡', '🚀', '✅', '📌', '⭐', '💪', '🌟', '🔑']

interface Props {
  task: Task | Partial<Task>
  workspaceId: string
  onClose: () => void
}

export default function TaskModal({ task, workspaceId, onClose }: Props) {
  const isNew = !task.id
  const { user } = useAuthStore()
  const uid = user?.uid ?? ''

  const [title, setTitle]     = useState(task.title ?? '')
  const [status, setStatus]   = useState<TaskStatus>(task.status ?? 'todo')
  const [priority, setPrio]   = useState<TaskPriority>(task.priority ?? 'medium')
  const [dueDate, setDue]     = useState(() => task.dueDate ? new Date(task.dueDate as number).toISOString().split('T')[0] : '')
  const [tags, setTags]       = useState<string[]>(task.tags ?? [])
  const [newTag, setNewTag]   = useState('')
  const [emoji, setEmoji]     = useState('📝')
  const [saving, setSaving]   = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)

  const titleRef = useRef<HTMLTextAreaElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Adicione uma descrição, notas ou qualquer conteúdo...' }),
    ],
    content: task.description ?? '',
  })

  useEffect(() => { setTimeout(() => { titleRef.current?.focus() }, 80) }, [])

  // Auto-save for existing tasks
  useEffect(() => {
    if (isNew || !title.trim() || !uid) return
    const t = setTimeout(() => {
      updateTask(uid, task.id!, {
        title: title.trim(), status, priority,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
        tags, description: editor?.getHTML() ?? '',
      })
    }, 900)
    return () => clearTimeout(t)
  }, [title, status, priority, dueDate, tags])

  async function handleSave() {
    if (!title.trim() || !uid) return
    setSaving(true)
    const data = {
      title: title.trim(), status, priority,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      tags, description: editor?.getHTML() ?? '',
      workspaceId, order: Date.now(),
    }
    if (isNew) await createTask(uid, data)
    else       await updateTask(uid, task.id!, data)
    setSaving(false)
    onClose()
  }

  // Backdrop covers
  const coverColor = `linear-gradient(135deg, ${PRIORITY_CONFIG[priority].color}18, ${STATUS_CONFIG[status].dot}18)`

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        overflowY: 'auto', padding: '32px 16px 48px',
        backdropFilter: 'blur(2px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: '100%', maxWidth: '700px',
          background: 'var(--n-bg)',
          borderRadius: '8px', overflow: 'hidden',
          boxShadow: 'var(--n-shadow-xl)',
        }}
        className="anim-up"
      >
        {/* Cover gradient */}
        <div style={{ height: '72px', background: coverColor }} />

        <div style={{ padding: '0 56px 36px' }}>
          {/* Emoji picker */}
          <div style={{ position: 'relative', marginTop: '-22px', marginBottom: '10px', display: 'inline-block' }}>
            <button
              onClick={() => setEmojiOpen(o => !o)}
              style={{ fontSize: '44px', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{emoji}</button>

            {emojiOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0 }} onClick={() => setEmojiOpen(false)} />
                <div style={{
                  position: 'absolute', top: '52px', left: 0, zIndex: 10,
                  background: 'var(--n-bg)', border: `1px solid var(--n-border)`,
                  borderRadius: '8px', padding: '8px',
                  display: 'flex', flexWrap: 'wrap', gap: '2px',
                  boxShadow: 'var(--n-shadow-lg)', width: '196px',
                }}>
                  {PAGE_EMOJIS.map(e => (
                    <button key={e} onClick={() => { setEmoji(e); setEmojiOpen(false) }}
                      style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', lineHeight: 1 }}
                      onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--n-hover)')}
                      onMouseLeave={ev => (ev.currentTarget.style.background = 'none')}
                    >{e}</button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <textarea
            ref={titleRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); editor?.commands.focus() } }}
            placeholder="Sem título"
            rows={1}
            style={{
              width: '100%', border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'inherit', fontSize: '30px', fontWeight: 700,
              color: 'var(--n-text)', background: 'none', lineHeight: 1.25,
              marginBottom: '16px', letterSpacing: '-0.01em', overflow: 'hidden',
              boxSizing: 'border-box',
            }}
            onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px' }}
          />

          {/* Properties */}
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid var(--n-border)` }}>
            <PropRow label="Status" icon="●">
              <PropSelect
                value={status}
                options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label, color: v.color, bg: v.bg }))}
                onChange={v => setStatus(v as TaskStatus)}
              />
            </PropRow>
            <PropRow label="Prioridade" icon="⚑">
              <PropSelect
                value={priority}
                options={Object.entries(PRIORITY_CONFIG).map(([k, v]) => ({ value: k, label: v.label, color: v.color, bg: v.bg }))}
                onChange={v => setPrio(v as TaskPriority)}
              />
            </PropRow>
            <PropRow label="Prazo" icon="📅">
              <input
                type="date" value={dueDate} onChange={e => setDue(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'none', color: dueDate ? 'var(--n-text)' : 'var(--n-text3)', fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer', padding: '3px 6px', borderRadius: '4px' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              />
              {dueDate && (
                <button onClick={() => setDue('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--n-text3)', fontSize: '14px', padding: '0 4px' }}>×</button>
              )}
            </PropRow>
            <PropRow label="Tags" icon="🏷">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                {tags.map(tag => (
                  <span key={tag}
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 7px', borderRadius: '4px', fontSize: '12px', background: 'var(--n-blue-bg)', color: 'var(--n-blue)', cursor: 'pointer' }}
                  >{tag} ×</span>
                ))}
                <input
                  value={newTag} onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newTag.trim()) { setTags(t => [...t, newTag.trim()]); setNewTag('') } }}
                  placeholder="+ Tag"
                  style={{ border: 'none', outline: 'none', background: 'none', fontSize: '12px', color: 'var(--n-text3)', width: '55px', fontFamily: 'inherit' }}
                />
              </div>
            </PropRow>
          </div>

          {/* Editor */}
          <div style={{ fontSize: '14px', color: 'var(--n-text)', lineHeight: 1.65, minHeight: '100px' }}>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid var(--n-border)`, padding: '11px 56px', display: 'flex', justifyContent: 'flex-end', gap: '8px', background: 'var(--n-bg2)' }}>
          <button
            onClick={onClose}
            style={cancelBtnStyle}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {isNew ? 'Cancelar' : 'Fechar'}
          </button>
          {isNew && (
            <button
              onClick={handleSave}
              disabled={!title.trim() || saving}
              style={saveBtnStyle(!title.trim() || saving)}
            >
              {saving ? 'Criando...' : 'Criar tarefa'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function PropRow({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', minHeight: '32px' }}>
      <div style={{ width: '130px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--n-text2)', fontSize: '14px' }}>
        <span>{icon}</span><span>{label}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>{children}</div>
    </div>
  )
}

function PropSelect({ value, options, onChange }: {
  value: string
  options: { value: string; label: string; color: string; bg: string }[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const sel = options.find(o => o.value === value)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '13px', background: sel?.bg ?? 'var(--n-bg3)', color: sel?.color ?? 'var(--n-text)', fontFamily: 'inherit', fontWeight: 500 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {sel?.label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 15 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 20, background: 'var(--n-bg)', border: `1px solid var(--n-border)`, borderRadius: '7px', boxShadow: 'var(--n-shadow-lg)', minWidth: '160px', padding: '4px' }}>
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer', width: '100%', fontSize: '14px', color: 'var(--n-text)', fontFamily: 'inherit', transition: 'background 0.08s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '12px', fontWeight: 500, background: opt.bg, color: opt.color }}>{opt.label}</span>
                {opt.value === value && <span style={{ marginLeft: 'auto', color: 'var(--n-accent)', fontSize: '12px' }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const cancelBtnStyle: React.CSSProperties = {
  padding: '6px 13px', borderRadius: '6px',
  border: `1px solid var(--n-border)`, background: 'none',
  color: 'var(--n-text)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
  transition: 'background 0.1s',
}

const saveBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '6px 13px', borderRadius: '6px', border: 'none',
  background: disabled ? 'var(--n-bg3)' : 'var(--n-text)',
  color: disabled ? 'var(--n-text3)' : 'var(--n-bg)',
  fontSize: '13px', fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
})
