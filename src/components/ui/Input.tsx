import { type InputHTMLAttributes, forwardRef } from 'react'
import type { ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string
  error?:    string
  leftIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">{leftIcon}</span>
        )}
        <input
          ref={ref}
          className={`w-full h-10 bg-[var(--color-bg-elevated)] border rounded-[var(--radius-md)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] transition-all outline-none ${leftIcon ? 'pl-9 pr-4' : 'px-4'} ${error ? 'border-[var(--color-danger)] focus:ring-2 focus:ring-[oklch(65%_0.18_25_/_20%)]' : 'border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
