import { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Plus, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuthStore } from '@/store/auth'
import { useWorkspaceStore } from '@/store/workspace'
import { createNote, updateNote } from '@/lib/db'
import type { Note } from '@/lib/types'

const EDITOR_CSS = `
  .ProseMirror { outline: none; min-height: 300px; }
  .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--color-text-muted); pointer-events: none; float: left; height: 0; }
  .ProseMirror h1,.ProseMirror h2,.ProseMirror h3 { color: var(--color-text-primary); font-family: var(--font-display); font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; }
  .ProseMirror h1 { font-size: 1.5rem; } .ProseMirror h2 { font-size: 1.25rem; } .ProseMirror h3 { font-size: 1.1rem; }
  .ProseMirror p { color: var(--color-text-secondary); margin-bottom: 0.75rem; line-height: 1.7; }
  .ProseMirror strong { color: var(--color-text-primary); }
  .ProseMirror ul,.ProseMirror ol { color: var(--color-text-secondary); padding-left: 1.5rem; margin-bottom: 0.75rem; }
  .ProseMirror blockquote { border-left: 3px solid var(--color-accent); padding-left: 1rem; color: var(--color-text-muted); margin: 1rem 0; }
  .ProseMirror code { background: var(--color-bg-elevated); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: var(--font-mono); font-size: 0.875em; color: var(--color-accent); }
`

function NoteEditor({ note, onUpdate }: { note: Note; onUpdate: (id: string, d: Partial<Note>) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Escreva algo...' })],
    content: note.content,
    onUpdate: ({ editor }) => onUpdate(note.id, { content: editor.getHTML() }),
  })

  useEffect(() => {
    if (editor && note.id) editor.commands.setContent(note.content ?? '')
  }, [note.id])

  return <><style>{EDITOR_CSS}</style><EditorContent editor={editor} /></>
}

export function NotesView() {
  const { user }  = useAuthStore()
  const { notes, activeWorkspaceId } = useWorkspaceStore()
  const [activeId, setActiveId]       = useState<string | null>(null)
  const [pending, setPending]         = useState<Record<string, Partial<Note>>>({})

  const active = notes.find(n => n.id === activeId)

  useEffect(() => { if (notes.length > 0 && !activeId) setActiveId(notes[0].id) }, [notes])

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!user || !Object.keys(pending).length) return
      for (const [id, data] of Object.entries(pending)) await updateNote(user.uid, id, data)
      setPending({})
    }, 1200)
    return () => clearTimeout(t)
  }, [pending, user])

  const onUpdate = useCallback((id: string, d: Partial<Note>) => setPending(p => ({ ...p, [id]: { ...p[id], ...d } })), [])

  const handleNew = async () => {
    if (!user || !activeWorkspaceId) return
    const n = await createNote(user.uid, { workspaceId: activeWorkspaceId, projectId: null, title: 'Nova nota', content: '', tags: [], pinned: false })
    setActiveId(n.id)
  }

  const sorted = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt)

  return (
    <div className="flex h-full -m-6 overflow-hidden">
      <div className="w-64 shrink-0 border-r flex flex-col" style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Notas</span>
          <button onClick={handleNew} className="p-1.5 rounded cursor-pointer transition-colors" style={{ color: 'var(--color-text-muted)' }}><Plus size={15} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <FileText size={24} style={{ color: 'var(--color-text-muted)' }} />
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Nenhuma nota ainda</p>
            </div>
          )}
          {sorted.map(n => (
            <button key={n.id} onClick={() => setActiveId(n.id)}
                    className="w-full text-left p-3 rounded-lg transition-colors cursor-pointer"
                    style={{ background: activeId === n.id ? 'var(--color-accent-subtle)' : 'transparent', border: activeId === n.id ? '1px solid oklch(75% 0.18 65 / 30%)' : '1px solid transparent' }}>
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{n.title || 'Sem título'}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {format(new Date(n.updatedAt), "dd MMM 'às' HH:mm", { locale: ptBR })}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {active ? (
          <>
            <div className="flex items-center gap-2 px-8 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <input className="flex-1 bg-transparent text-lg font-bold outline-none"
                     style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                     placeholder="Título da nota" value={active.title}
                     onChange={e => onUpdate(active.id, { title: e.target.value })} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {Object.keys(pending).length > 0 ? 'Salvando...' : 'Salvo ✓'}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <NoteEditor key={active.id} note={active} onUpdate={onUpdate} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <FileText size={40} style={{ color: 'var(--color-text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Selecione ou crie uma nota</p>
            <button onClick={handleNew} className="text-sm cursor-pointer hover:underline" style={{ color: 'var(--color-accent)' }}>Criar primeira nota</button>
          </div>
        )}
      </div>
    </div>
  )
}
