import { type ButtonHTMLAttributes, forwardRef, type CSSProperties } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?:    'sm' | 'md' | 'lg'
  loading?: boolean
}

const SIZE_CLASS = { sm: 'h-8 px-3 text-xs', md: 'h-9 px-4 text-sm', lg: 'h-11 px-5 text-sm' }

function getStyle(variant: string, disabled: boolean): CSSProperties {
  const base: CSSProperties = { borderRadius: '0.625rem', transition: 'all 0.15s', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }
  if (variant === 'primary')   return { ...base, background: 'var(--color-accent)', color: 'var(--color-bg-base)', border: 'none' }
  if (variant === 'secondary') return { ...base, background: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }
  if (variant === 'ghost')     return { ...base, background: 'transparent', color: 'var(--color-text-secondary)', border: 'none' }
  if (variant === 'danger')    return { ...base, background: 'oklch(65% 0.18 25 / 15%)', color: 'var(--color-danger)', border: '1px solid oklch(65% 0.18 25 / 30%)' }
  return base
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', style, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium select-none ${SIZE_CLASS[size]} ${className}`}
      style={{ ...getStyle(variant, !!(disabled || loading)), ...style }}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
