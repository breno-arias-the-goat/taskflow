import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?:    'sm' | 'md' | 'lg'
  loading?: boolean
}

const V = {
  primary:   'bg-[var(--color-accent)] text-[var(--color-bg-base)] hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)]',
  secondary: 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-overlay)] hover:border-[var(--color-accent)]',
  ghost:     'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]',
  danger:    'bg-[oklch(65%_0.18_25_/_15%)] text-[var(--color-danger)] border border-[oklch(65%_0.18_25_/_30%)] hover:bg-[oklch(65%_0.18_25_/_25%)]',
}
const S = {
  sm: 'h-8 px-3 text-xs rounded-[var(--radius-md)]',
  md: 'h-9 px-4 text-sm rounded-[var(--radius-md)]',
  lg: 'h-11 px-5 text-sm rounded-[var(--radius-lg)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${V[variant]} ${S[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
