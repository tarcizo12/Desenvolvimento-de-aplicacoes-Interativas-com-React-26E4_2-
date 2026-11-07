import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import type { DataTableColumn } from '../../components/DataTable'
import Feedback from '../../components/Feedback'
import { listarCategorias } from './categoriaService'
import type { Categoria } from './type'

const CategoriaListPage = () => {
  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: ({ signal }) => listarCategorias(signal),
  })
  const colunas: DataTableColumn<Categoria>[] = [
    { key: 'nome', header: 'Categoria', render: (categoria) => categoria.nome },
    {
      key: 'descricao',
      header: 'Descrição',
      render: (categoria) => categoria.descricao || '—',
    },
  ]

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Organização</p>
          <h1>Categorias</h1>
          <p className="page-description">Classifique os produtos do estoque.</p>
        </div>
        <Link to="/categorias/nova" className="button">
          Nova categoria
        </Link>
      </div>

      {categoriasQuery.isPending && (
        <p className="loading-state">Carregando categorias…</p>
      )}
      {categoriasQuery.isError && (
        <Feedback
          kind="error"
          message={`Não foi possível carregar as categorias: ${categoriasQuery.error.message}`}
        />
      )}
      {!categoriasQuery.isPending && !categoriasQuery.isError && (
        categoriasQuery.data.length === 0 ? (
          <div className="empty-state">Nenhuma categoria cadastrada.</div>
        ) : (
          <DataTable
            caption="Categorias cadastradas"
            rows={categoriasQuery.data}
            columns={colunas}
            getRowKey={(categoria) => categoria.id}
          />
        )
      )}
    </section>
  )
}

export default CategoriaListPage
