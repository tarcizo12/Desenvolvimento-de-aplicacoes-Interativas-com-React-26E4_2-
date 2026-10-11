
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarCategorias } from './categoriaService'
import type { Categoria } from './type'

const CategoriaListPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarCategorias().then((dados) => {
      setCategorias(dados)
      setCarregando(false)
    })
  }, [])

  return (
    <section>
      <div className="page-title">
        <h2>Categorias</h2>

        <Link to="/categorias/nova" className="button">
          Nova categoria
        </Link>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : categorias.length === 0 ? (
        <p>Nenhuma categoria cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nome}</td>
                <td>{categoria.descricao ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default CategoriaListPage
