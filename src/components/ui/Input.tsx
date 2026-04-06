import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string
  error?:    string
  leftIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', style, ...props }, ref) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={className}
          style={{
            width: '100%',
            height: '40px',
            background: 'var(--color-bg-elevated)',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            borderRadius: '0.625rem',
            padding: leftIcon ? '0 16px 0 36px' : '0 16px',
            fontSize: '0.875rem',
            color: 'var(--color-text-primary)',
            outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            ...style,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-accent)'; e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'oklch(65% 0.18 25 / 15%)' : 'var(--color-accent-subtle)'}` }}
          onBlur={e =>  { e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)';  e.currentTarget.style.boxShadow = 'none' }}
          placeholder={props.placeholder}
          {...props}
        />
      </div>
      {error && <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', margin: 0 }}>{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
