import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProdutoListPage from './features/produtos/ProdutoListPage'
import ProdutoFormPage from './features/produtos/ProdutoFormPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/produtos" replace />} />
          <Route path="/produtos" element={<ProdutoListPage />} />
          <Route path="/produtos/novo" element={<ProdutoFormPage />} />
          <Route path="/produtos/:id/editar" element={<ProdutoFormPage />} />
          <Route path="*" element={<p>Página não encontrada.</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
