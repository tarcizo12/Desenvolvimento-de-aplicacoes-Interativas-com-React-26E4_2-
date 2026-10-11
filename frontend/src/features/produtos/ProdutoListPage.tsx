
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarProdutos, excluirProduto } from './produtoService'
import { formatarMoeda } from '../../utils/format'
import type { Produto } from './types'

const ProdutoListPage = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarProdutos().then((dados) => {
      setProdutos(dados)
      setCarregando(false)
    })
  }, [])

  const handleExcluir = (produto: Produto) => {
    if (!window.confirm(`Excluir o produto "${produto.nome}"?`)) return

    excluirProduto(produto.id)

    setProdutos((atual) =>
      atual.filter((p) => p.id !== produto.id),
    )
  }

  return (
    <section>
      <div className="page-title">
        <h2>Produtos</h2>

        <Link to="/produtos/novo" className="button">
          Novo produto
        </Link>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : produtos.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>

                <td>
                  {produto.tipoProduto === 'PERECIVEL'
                    ? 'Perecível'
                    : 'Não perecível'}
                </td>

                <td>{formatarMoeda(produto.preco)}</td>

                <td>{produto.quantidadeEstoque}</td>

                <td>
                  <div className="actions">
                    <Link
                      to={`/produtos/${produto.id}/editar`}
                      className="button secondary"
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleExcluir(produto)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default ProdutoListPage
