import { NavLink, Outlet } from 'react-router-dom'
import { loggedOut } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const Layout = () => {
  const dispatch = useAppDispatch()
  const displayName = useAppSelector((state) => state.auth.displayName)

  const handleLogout = () => {
    sessionStorage.removeItem('estoque-demo-user')
    dispatch(loggedOut())
  }

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <NavLink to="/produtos" className="brand">
            <span className="brand-mark" aria-hidden="true">E</span>
            <span>Estoque <strong>+</strong></span>
          </NavLink>

          <nav aria-label="Navegação principal">
            <NavLink to="/produtos">Produtos</NavLink>
            <NavLink to="/categorias">Categorias</NavLink>
            <NavLink to="/fornecedores">Fornecedores</NavLink>
          </nav>

          <div className="account-menu">
            <span className="account-name">{displayName}</span>
            <button type="button" className="button button-quiet" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>Gerenciador de estoque</span>
        <span>Acesso demonstrativo</span>
      </footer>
    </>
  )
}

export default Layout
