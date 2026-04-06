import { useState } from 'react'
import { useAuthStore } from '@/store/auth'

export default function AuthPage() {
  const { signInGoogle, signInEmail, signUpEmail, loading, error, clearError } = useAuthStore()
  const [mode, setMode]       = useState<'signin' | 'signup'>('signin')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [name, setName]       = useState('')
  const [showPass, setShow]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'signin') await signInEmail(email, password)
    else                   await signUpEmail(email, password, name)
  }

  const switchMode = () => { setMode(m => m === 'signin' ? 'signup' : 'signin'); clearError() }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--n-bg)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }} className="anim-fade">
        {/* Logo mark */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: 44, height: 44,
            borderRadius: '10px',
            background: 'var(--n-text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: 'var(--n-shadow-md)',
          }}>
            <span style={{ color: 'var(--n-bg)', fontSize: '22px', lineHeight: 1 }}>✓</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--n-text)', margin: 0, letterSpacing: '-0.01em' }}>
            {mode === 'signin' ? 'Entrar' : 'Criar conta'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--n-text2)', marginTop: '6px' }}>
            {mode === 'signin' ? 'Continue organizando suas tarefas' : 'Comece a organizar suas tarefas'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--n-bg)',
          border: `1px solid var(--n-border)`,
          borderRadius: '10px',
          padding: '20px',
          boxShadow: 'var(--n-shadow-md)',
        }}>
          {/* Google */}
          <button
            onClick={() => signInGoogle()}
            disabled={loading}
            style={googleBtnStyle(loading)}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--n-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--n-bg)')}
          >
            <GoogleIcon />
            Continuar com Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--n-border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--n-text3)' }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'var(--n-border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mode === 'signup' && (
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Seu nome" required style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--n-accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--n-border)')}
              />
            )}
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email" required style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--n-accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--n-border)')}
            />
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPass(e.target.value)}
                placeholder="Senha" required style={{ ...inputStyle, paddingRight: '40px' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--n-accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--n-border)')}
              />
              <button type="button" onClick={() => setShow(s => !s)} style={eyeBtnStyle}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: 'var(--n-red)', background: 'var(--n-red-bg)', padding: '8px 12px', borderRadius: '6px', margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading || !email || !password}
              style={submitBtnStyle(loading || !email || !password)}
            >
              {loading ? 'Aguarde...' : mode === 'signin' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--n-text2)', marginTop: '14px' }}>
          {mode === 'signin' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button onClick={switchMode} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--n-accent)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit' }}>
            {mode === 'signin' ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 11px',
  borderRadius: '6px', border: `1px solid var(--n-border)`,
  background: 'var(--n-bg)', color: 'var(--n-text)',
  fontSize: '14px', outline: 'none',
  transition: 'border-color 0.15s', fontFamily: 'inherit', boxSizing: 'border-box',
}

const eyeBtnStyle: React.CSSProperties = {
  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
  border: 'none', background: 'none', cursor: 'pointer', color: 'var(--n-text3)',
  fontSize: '13px', padding: '2px', lineHeight: 1,
}

const googleBtnStyle = (loading: boolean): React.CSSProperties => ({
  width: '100%', padding: '9px',
  borderRadius: '7px', border: `1px solid var(--n-border)`,
  background: 'var(--n-bg)', cursor: loading ? 'not-allowed' : 'pointer',
  fontSize: '14px', fontWeight: 500, color: 'var(--n-text)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
  transition: 'background 0.1s', fontFamily: 'inherit', opacity: loading ? 0.7 : 1,
})

const submitBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '9px', borderRadius: '7px', border: 'none',
  background: disabled ? 'var(--n-bg3)' : 'var(--n-text)',
  color: disabled ? 'var(--n-text3)' : 'var(--n-bg)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.1s',
})
