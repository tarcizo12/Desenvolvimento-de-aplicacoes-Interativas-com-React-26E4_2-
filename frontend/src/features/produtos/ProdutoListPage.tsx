import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import type { DataTableColumn } from '../../components/DataTable'
import ConfirmButton from '../../components/ConfirmButton'
import Feedback from '../../components/Feedback'
import { formatarMoeda } from '../../utils/format'
import { excluirProduto, listarProdutos } from './produtoService'
import type { Produto } from './types'

const ProdutoListPage = () => {
  const queryClient = useQueryClient()
  const produtosQuery = useQuery({
    queryKey: ['produtos'],
    queryFn: ({ signal }) => listarProdutos(signal),
  })
  const excluirMutation = useMutation({
    mutationFn: (id: number) => excluirProduto(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['produtos'] }),
  })

  const colunas: DataTableColumn<Produto>[] = [
    { key: 'nome', header: 'Produto', render: (produto) => produto.nome },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (produto) =>
        produto.tipoProduto === 'PERECIVEL' ? 'Perecível' : 'Não perecível',
    },
    {
      key: 'preco',
      header: 'Preço',
      render: (produto) => formatarMoeda(produto.preco),
    },
    {
      key: 'estoque',
      header: 'Estoque',
      render: (produto) => produto.quantidadeEstoque,
    },
    {
      key: 'acoes',
      header: 'Ações',
      render: (produto) => (
        <div className="actions">
          <Link
            to={`/produtos/${produto.id}/editar`}
            className="button button-secondary"
          >
            Editar
          </Link>
          <ConfirmButton
            label="Excluir"
            confirmation={`Excluir o produto "${produto.nome}"?`}
            disabled={excluirMutation.isPending}
            onConfirm={() => excluirMutation.mutate(produto.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h1>Produtos</h1>
          <p className="page-description">Gerencie os itens e níveis de estoque.</p>
        </div>
        <Link to="/produtos/novo" className="button">
          Novo produto
        </Link>
      </div>

      {produtosQuery.isPending && <p className="loading-state">Carregando produtos…</p>}
      {produtosQuery.isError && (
        <Feedback
          kind="error"
          message={`Não foi possível carregar os produtos: ${produtosQuery.error.message}`}
        />
      )}
      {excluirMutation.isError && (
        <Feedback
          kind="error"
          message={`Não foi possível excluir o produto: ${excluirMutation.error.message}`}
        />
      )}
      {!produtosQuery.isPending && !produtosQuery.isError && (
        produtosQuery.data.length === 0 ? (
          <div className="empty-state">Nenhum produto cadastrado.</div>
        ) : (
          <DataTable
            caption="Produtos cadastrados"
            rows={produtosQuery.data}
            columns={colunas}
            getRowKey={(produto) => produto.id}
          />
        )
      )}
    </section>
  )
}

export default ProdutoListPage
