import { format, isToday, isYesterday, isTomorrow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function toDate(val: number | Date | undefined): Date | null {
  if (!val) return null
  return val instanceof Date ? val : new Date(val)
}

export function formatDate(val: number | Date | undefined): string {
  const d = toDate(val)
  if (!d) return ''
  if (isToday(d))     return 'Hoje'
  if (isYesterday(d)) return 'Ontem'
  if (isTomorrow(d))  return 'Amanhã'
  return format(d, "d 'de' MMM", { locale: ptBR })
}

export function isOverdue(val: number | Date | undefined, status: string): boolean {
  const d = toDate(val)
  if (!d || status === 'done') return false
  return d < new Date()
}

export function toggleTheme(): 'light' | 'dark' {
  const isDark = document.documentElement.classList.toggle('dark')
  const theme = isDark ? 'dark' : 'light'
  localStorage.setItem('theme', theme)
  return theme
}

export function currentTheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}
