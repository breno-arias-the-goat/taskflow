import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useWorkspaceStore } from '@/store/workspace'
import { useAuthStore } from '@/store/auth'
import { createNote, updateNote, deleteNote } from '@/lib/db'
import type { Note } from '@/lib/types'

export default function NotesView() {
  const { notes, activeWorkspaceId } = useWorkspaceStore()
  const { user } = useAuthStore()
  const uid = user?.uid ?? ''

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [title, setTitle]           = useState('')
  const [saving, setSaving]         = useState(false)
  const [savedAt, setSavedAt]       = useState<Date | null>(null)

  const note = notes.find(n => n.id === selectedId)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Escreva algo...' }),
    ],
    content: '',
    onUpdate: () => setSaving(true),
  })

  // Sync editor content when switching notes
  useEffect(() => {
    if (!note) { editor?.commands.setContent(''); setTitle(''); return }
    setTitle(note.title)
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content ?? '')
    }
  }, [note?.id])

  // Auto-save
  useEffect(() => {
    if (!selectedId || !saving || !uid) return
    const t = setTimeout(async () => {
      await updateNote(uid, selectedId, { title: title || 'Sem título', content: editor?.getHTML() ?? '' })
      setSaving(false)
      setSavedAt(new Date())
    }, 900)
    return () => clearTimeout(t)
  }, [title, saving, selectedId])

  // Title change triggers save
  useEffect(() => {
    if (selectedId) setSaving(true)
  }, [title])

  async function handleNew() {
    if (!uid || !activeWorkspaceId) return
    const n = await createNote(uid, { workspaceId: activeWorkspaceId, title: 'Sem título', content: '', tags: [], pinned: false })
    setSelectedId(n.id)
    setTimeout(() => {
      const el = document.getElementById('note-title') as HTMLInputElement | null
      el?.focus(); el?.select()
    }, 80)
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    await deleteNote(uid, id)
    if (selectedId === id) setSelectedId(null)
  }

  const sorted = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.updatedAt - a.updatedAt
  })

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: 'var(--n-bg)' }}>
      {/* Notes sidebar */}
      <div style={{ width: '234px', flexShrink: 0, borderRight: `1px solid var(--n-border)`, display: 'flex', flexDirection: 'column', background: 'var(--n-bg2)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 12px 8px', borderBottom: `1px solid var(--n-border)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--n-text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notas</span>
          <button onClick={handleNew}
            style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--n-text2)', borderRadius: '4px', fontSize: '18px', transition: 'background 0.1s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            title="Nova nota"
          >+</button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px' }}>
          {sorted.length === 0 ? (
            <div style={{ padding: '24px 14px', textAlign: 'center', color: 'var(--n-text3)', fontSize: '13px' }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>📝</div>
              Nenhuma nota
            </div>
          ) : sorted.map(n => (
            <NoteItem
              key={n.id} note={n}
              isSelected={n.id === selectedId}
              onClick={() => setSelectedId(n.id)}
              onDelete={e => handleDelete(n.id, e)}
            />
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {!note ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--n-text3)', gap: '10px' }}>
            <div style={{ fontSize: '44px' }}>📝</div>
            <p style={{ fontSize: '15px', margin: 0, color: 'var(--n-text2)' }}>Selecione uma nota ou crie uma nova</p>
            <button onClick={handleNew}
              style={{ marginTop: '4px', padding: '7px 14px', borderRadius: '6px', border: `1px solid var(--n-border)`, background: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--n-text)', fontFamily: 'inherit', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >+ Nova nota</button>
          </div>
        ) : (
          <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', padding: '36px 56px 56px' }}>
            {/* Save status */}
            <div style={{ height: '18px', display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
              {saving
                ? <span style={{ fontSize: '12px', color: 'var(--n-text3)' }}>Salvando...</span>
                : savedAt
                  ? <span style={{ fontSize: '12px', color: 'var(--n-text3)' }}>Salvo ✓</span>
                  : null
              }
            </div>

            {/* Title */}
            <input
              id="note-title" type="text"
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Sem título"
              style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '30px', fontWeight: 700, color: 'var(--n-text)', background: 'none', letterSpacing: '-0.01em', marginBottom: '20px', padding: 0, boxSizing: 'border-box' }}
            />

            {/* Editor */}
            <div style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--n-text)' }}>
              <EditorContent editor={editor} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function NoteItem({ note, isSelected, onClick, onDelete }: {
  note: Note; isSelected: boolean
  onClick: () => void; onDelete: (e: React.MouseEvent) => void
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '8px 10px', borderRadius: '5px', border: 'none',
        cursor: 'pointer', textAlign: 'left', marginBottom: '1px',
        background: isSelected ? 'var(--n-active)' : hov ? 'var(--n-hover)' : 'none',
        display: 'flex', alignItems: 'flex-start', gap: '7px',
        position: 'relative', transition: 'background 0.08s', fontFamily: 'inherit',
      }}
    >
      <span style={{ fontSize: '14px', lineHeight: 1.4, flexShrink: 0, marginTop: '1px' }}>
        {note.pinned ? '📌' : '📄'}
      </span>
      <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: isSelected ? 500 : 400, color: 'var(--n-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {note.title || 'Sem título'}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--n-text3)' }}>
          {new Date(note.updatedAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {hov && (
        <button
          onClick={onDelete}
          style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'var(--n-bg4)', cursor: 'pointer', borderRadius: '3px', color: 'var(--n-text3)', fontSize: '12px', lineHeight: 1 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--n-red-bg)'; e.currentTarget.style.color = 'var(--n-red)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--n-bg4)'; e.currentTarget.style.color = 'var(--n-text3)' }}
        >×</button>
      )}
    </button>
  )
}
