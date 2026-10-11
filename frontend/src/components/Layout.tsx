import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header>
        <h1>Gerenciador de Estoque</h1>
        <nav>
          <Link to="/produtos">Produtos</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
