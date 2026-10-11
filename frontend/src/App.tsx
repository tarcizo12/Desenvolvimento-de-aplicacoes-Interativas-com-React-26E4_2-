
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProdutoListPage from './features/produtos/ProdutoListPage'
import ProdutoFormPage from './features/produtos/ProdutoFormPage'
import CategoriaFormPage from './features/categorias/Categoriaformpage'
import CategoriaListPage from './features/categorias/Categorialistpage'
import FornecedorFormPage from './features/fornecedores/Fornecedorformpage'
import FornecedorListPage from './features/fornecedores/Fornecedorlistpage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/produtos" replace />} />

          <Route path="/produtos" element={<ProdutoListPage />} />
          <Route path="/produtos/novo" element={<ProdutoFormPage />} />
          <Route path="/produtos/:id/editar" element={<ProdutoFormPage />} />

          <Route path="/categorias" element={<CategoriaListPage />} />
          <Route path="/categorias/nova" element={<CategoriaFormPage />} />

          <Route path="/fornecedores" element={<FornecedorListPage />} />
          <Route path="/fornecedores/novo" element={<FornecedorFormPage />} />

          <Route path="*" element={<p>Página não encontrada.</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
