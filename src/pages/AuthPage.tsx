import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'

export default function AuthPage() {
  const [mode, setMode]           = useState<'signin' | 'signup'>('signin')
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const { signInGoogle, signInEmail, signUpEmail, loading, error, clearError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signin') await signInEmail(email, password)
    else await signUpEmail(email, password, name)
  }

  const toggle = () => { setMode(m => m === 'signin' ? 'signup' : 'signin'); clearError() }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg-base)' }}>
      {/* Painel esquerdo */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 border-r p-12 relative overflow-hidden"
           style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: 'linear-gradient(oklch(92% 0.005 260) 1px,transparent 1px),linear-gradient(90deg,oklch(92% 0.005 260) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-[0.08]"
             style={{ background: 'var(--color-accent)' }} />

        <div className="relative z-10 flex items-center gap-3">
          <Logo size={36} />
          <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>TaskFlow</span>
        </div>

        <div className="relative z-10 space-y-8">
          {[
            { e: '⚡', t: 'Kanban em tempo real', d: 'Arraste e organize com sincronização instantânea.' },
            { e: '📝', t: 'Notas estilo Notion',  d: 'Editor rico para documentar qualquer coisa.' },
            { e: '📅', t: 'Vista de calendário',  d: 'Visualize prazos e planeje sua semana.' },
          ].map(i => (
            <div key={i.t} className="flex gap-4">
              <span className="text-2xl">{i.e}</span>
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{i.t}</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{i.d}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Seus dados são seus. Protegidos pelo Firebase com criptografia em repouso.
        </p>
      </div>

      {/* Painel direito */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <Logo size={32} />
          <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>TaskFlow</span>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              {mode === 'signin' ? 'Bem-vindo de volta' : 'Criar sua conta'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {mode === 'signin' ? 'Entre para acessar seu workspace' : 'Comece a organizar seu trabalho'}
            </p>
          </div>

          <Button variant="secondary" size="lg" className="w-full" onClick={signInGoogle} loading={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.185l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.963L3.964 7.295C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>ou com email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input label="Seu nome" placeholder="Como quer ser chamado?" value={name}
                     onChange={e => setName(e.target.value)} leftIcon={<User size={15} />} required />
            )}
            <Input label="Email" type="email" placeholder="voce@email.com" value={email}
                   onChange={e => setEmail(e.target.value)} leftIcon={<Mail size={15} />} required />
            <Input label="Senha" type={showPass ? 'text' : 'password'}
                   placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                   value={password} onChange={e => setPassword(e.target.value)}
                   leftIcon={<Lock size={15} />} error={error ?? undefined} required />

            <button type="button" onClick={() => setShowPass(v => !v)}
                    className="flex items-center gap-1.5 text-xs -mt-2 transition-colors cursor-pointer"
                    style={{ color: 'var(--color-text-muted)' }}>
              {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
              {showPass ? 'Ocultar senha' : 'Mostrar senha'}
            </button>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {mode === 'signin' ? 'Entrar' : 'Criar conta'}
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {mode === 'signin' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button onClick={toggle} className="font-medium cursor-pointer hover:underline"
                    style={{ color: 'var(--color-accent)' }}>
              {mode === 'signin' ? 'Criar agora' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
