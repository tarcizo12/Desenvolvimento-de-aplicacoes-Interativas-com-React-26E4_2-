import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../auth/useAuth'

const LoginPage = () => {
  const [nome, setNome] = useState('')
  const { authenticated, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const origem = (location.state as { from?: { pathname?: string } } | null)
    ?.from?.pathname ?? '/produtos'

  if (authenticated) return <Navigate to={origem} replace />

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    login(nome)
    navigate(origem, { replace: true })
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <p className="eyebrow">Gerenciador de estoque</p>
        <h1>Acesso de demonstração</h1>
        <p>Informe um nome para acessar as telas do sistema.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              autoComplete="name"
              maxLength={80}
              pattern="\s*\S.*"
              required
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </label>
          <button type="submit">Entrar na demonstração</button>
        </form>
        <p className="demo-notice">
          Este acesso é apenas demonstrativo. Ele não autentica usuários nem
          protege a API.
        </p>
      </section>
    </main>
  )
}

export default LoginPage
