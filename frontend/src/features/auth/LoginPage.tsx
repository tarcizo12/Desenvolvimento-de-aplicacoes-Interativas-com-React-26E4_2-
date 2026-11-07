import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { loggedIn } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const LoginPage = () => {
  const [nome, setNome] = useState('')
  const dispatch = useAppDispatch()
  const authenticated = useAppSelector((state) => state.auth.displayName.length > 0)
  const location = useLocation()
  const navigate = useNavigate()
  const origem = (location.state as { from?: { pathname?: string } } | null)
    ?.from?.pathname ?? '/produtos'

  if (authenticated) return <Navigate to={origem} replace />

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nomeNormalizado = nome.trim()
    sessionStorage.setItem('estoque-demo-user', nomeNormalizado)
    dispatch(loggedIn(nomeNormalizado))
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
