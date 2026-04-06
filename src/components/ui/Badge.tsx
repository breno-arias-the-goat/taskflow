type V = 'todo' | 'in_progress' | 'done' | 'blocked' | 'low' | 'medium' | 'high' | 'urgent'

const STYLES: Record<V, { bg: string; color: string }> = {
  todo:        { bg: 'rgba(148,148,168,0.12)', color: '#9494a8' },
  in_progress: { bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa' },
  done:        { bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
  blocked:     { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
  low:         { bg: 'rgba(58,58,74,0.5)',     color: '#5c5c70' },
  medium:      { bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa' },
  high:        { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' },
  urgent:      { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
}

const LABELS: Record<V, string> = {
  todo: 'A fazer', in_progress: 'Em andamento', done: 'Concluído', blocked: 'Bloqueado',
  low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente',
}

export function Badge({ variant }: { variant: V }) {
  const s = STYLES[variant]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 500, background: s.bg, color: s.color, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
      {LABELS[variant]}
    </span>
  )
}
