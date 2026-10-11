
import { NavLink, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <header>
        <h1>Gerenciador de Estoque</h1>

        <nav>
          <NavLink to="/produtos">Produtos</NavLink>
          <NavLink to="/categorias">Categorias</NavLink>
          <NavLink to="/fornecedores">Fornecedores</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
