export type TaskStatus   = 'todo' | 'in_progress' | 'done' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Workspace {
  id: string; name: string; emoji: string; color: string
  ownerId: string; createdAt: number; updatedAt: number
}

export interface Task {
  id: string; workspaceId: string; projectId: string | null
  title: string; description: string; status: TaskStatus
  priority: TaskPriority; dueDate: number | null; tags: string[]
  order: number; createdAt: number; updatedAt: number
}

export interface Note {
  id: string; workspaceId: string; projectId: string | null
  title: string; content: string; tags: string[]
  pinned: boolean; createdAt: number; updatedAt: number
}
