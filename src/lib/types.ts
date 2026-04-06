export type TaskStatus   = 'todo' | 'in_progress' | 'done' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ViewType     = 'board' | 'list' | 'calendar' | 'notes'

export interface Workspace {
  id: string
  name: string
  emoji: string
  color: string
  ownerId: string
  createdAt: number
  updatedAt: number
}

export interface Task {
  id: string
  workspaceId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: number
  tags: string[]
  order: number
  createdAt: number
  updatedAt: number
}

export interface Note {
  id: string
  workspaceId: string
  title: string
  content: string
  tags: string[]
  pinned: boolean
  emoji?: string
  createdAt: number
  updatedAt: number
}

export const STATUS_CONFIG: Record<TaskStatus, {
  label: string; color: string; bg: string; dot: string;
}> = {
  todo:        { label: 'A fazer',      color: 'var(--n-text3)',  bg: 'var(--n-bg3)',       dot: '#9b9a97' },
  in_progress: { label: 'Em andamento', color: 'var(--n-blue)',   bg: 'var(--n-blue-bg)',   dot: '#0b6e99' },
  done:        { label: 'Concluído',    color: 'var(--n-green)',  bg: 'var(--n-green-bg)',  dot: '#0f7b6c' },
  blocked:     { label: 'Bloqueado',    color: 'var(--n-red)',    bg: 'var(--n-red-bg)',    dot: '#eb5757' },
}

export const PRIORITY_CONFIG: Record<TaskPriority, {
  label: string; color: string; bg: string; icon: string;
}> = {
  low:    { label: 'Baixa',   color: 'var(--n-text3)',  bg: 'var(--n-bg3)',       icon: '↓' },
  medium: { label: 'Média',   color: 'var(--n-yellow)', bg: 'var(--n-yellow-bg)', icon: '→' },
  high:   { label: 'Alta',    color: 'var(--n-orange)', bg: 'var(--n-orange-bg)', icon: '↑' },
  urgent: { label: 'Urgente', color: 'var(--n-red)',    bg: 'var(--n-red-bg)',    icon: '⚡' },
}
