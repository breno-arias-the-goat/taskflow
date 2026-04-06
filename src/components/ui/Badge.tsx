type V = 'todo' | 'in_progress' | 'done' | 'blocked' | 'low' | 'medium' | 'high' | 'urgent'

const STYLES: Record<V, string> = {
  todo:        'bg-[oklch(55%_0.01_260_/_15%)] text-[var(--color-todo)]',
  in_progress: 'bg-[oklch(70%_0.15_230_/_15%)] text-[var(--color-in-progress)]',
  done:        'bg-[oklch(70%_0.15_150_/_15%)] text-[var(--color-done)]',
  blocked:     'bg-[oklch(65%_0.18_25_/_15%)] text-[var(--color-blocked)]',
  low:         'bg-[oklch(40%_0.008_260_/_15%)] text-[var(--color-text-muted)]',
  medium:      'bg-[oklch(75%_0.15_80_/_15%)] text-[var(--color-warning)]',
  high:        'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]',
  urgent:      'bg-[oklch(65%_0.18_25_/_15%)] text-[var(--color-danger)]',
}

const LABELS: Record<V, string> = {
  todo: 'A fazer', in_progress: 'Em progresso', done: 'Concluído', blocked: 'Bloqueado',
  low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente',
}

export function Badge({ variant }: { variant: V }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STYLES[variant]}`}>
      {LABELS[variant]}
    </span>
  )
}
