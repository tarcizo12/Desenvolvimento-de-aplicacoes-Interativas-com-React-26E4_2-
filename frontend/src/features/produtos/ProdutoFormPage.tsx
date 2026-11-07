import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Feedback from '../../components/Feedback'
import useFormFields from '../../hooks/useFormFields'
import { listarCategorias } from '../categorias/categoriaService'
import type { Categoria } from '../categorias/type'
import { listarFornecedores } from '../fornecedores/fornecedorService'
import type { Fornecedor } from '../fornecedores/type'
import {
  alterarProduto,
  incluirProduto,
  obterProduto,
} from './produtoService'
import type { Produto, ProdutoInput, TipoProduto } from './types'

interface FormState {
  tipoProduto: TipoProduto
  nome: string
  descricao: string
  preco: string
  quantidadeEstoque: string
  categoriaId: string
  fornecedorId: string
  dataValidade: string
  lote: string
  garantiaMeses: string
}

const estadoInicial = (produto?: Produto): FormState => ({
  tipoProduto: produto?.tipoProduto ?? 'PERECIVEL',
  nome: produto?.nome ?? '',
  descricao: produto?.descricao ?? '',
  preco: produto ? String(produto.preco) : '',
  quantidadeEstoque: produto ? String(produto.quantidadeEstoque) : '0',
  categoriaId: produto ? String(produto.categoriaId) : '',
  fornecedorId: produto ? String(produto.fornecedorId) : '',
  dataValidade:
    produto?.tipoProduto === 'PERECIVEL' ? produto.dataValidade : '',
  lote: produto?.tipoProduto === 'PERECIVEL' ? produto.lote : '',
  garantiaMeses:
    produto?.tipoProduto === 'NAO_PERECIVEL'
      ? String(produto.garantiaMeses)
      : '',
})

const ProdutoFormPage = () => {
  const { id } = useParams()
  const editando = id !== undefined
  const produtoId = Number(id)
  const produtoQuery = useQuery({
    queryKey: ['produtos', produtoId],
    queryFn: ({ signal }) => obterProduto(produtoId, signal),
    enabled: editando && Number.isInteger(produtoId) && produtoId > 0,
  })

  if (editando && !Number.isInteger(produtoId)) {
    return <Feedback kind="error" message="Identificador de produto inválido." />
  }
  if (editando && produtoQuery.isPending) {
    return <p className="loading-state">Carregando produto…</p>
  }
  if (editando && produtoQuery.isError) {
    return (
      <Feedback
        kind="error"
        message={`Não foi possível carregar o produto: ${produtoQuery.error.message}`}
      />
    )
  }
  if (editando && !produtoQuery.data) {
    return <Feedback kind="error" message="Produto não encontrado." />
  }

  return (
    <ProdutoEditor
      key={id ?? 'novo'}
      produto={produtoQuery.data}
      editando={editando}
    />
  )
}

const ProdutoEditor = ({
  produto,
  editando,
}: {
  produto?: Produto
  editando: boolean
}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [erro, setErro] = useState('')
  const { values: form, updateField: atualizar } =
    useFormFields<FormState>(estadoInicial(produto))
  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: ({ signal }) => listarCategorias(signal),
  })
  const fornecedoresQuery = useQuery({
    queryKey: ['fornecedores'],
    queryFn: ({ signal }) => listarFornecedores(signal),
  })
  const salvarMutation = useMutation({
    mutationFn: (dados: ProdutoInput) => {
      if (editando) {
        if (!produto) throw new Error('Produto necessário para edição não foi carregado.')
        return alterarProduto(produto.id, dados)
      }
      return incluirProduto(dados)
    },
    onSuccess: async (salvo) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['produtos'] }),
        queryClient.invalidateQueries({ queryKey: ['produtos', salvo.id] }),
      ])
      navigate('/produtos')
    },
  })

  const categorias: Categoria[] = categoriasQuery.data ?? []
  const fornecedores: Fornecedor[] = fornecedoresQuery.data ?? []
  const carregarErro = categoriasQuery.error ?? fornecedoresQuery.error

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setErro('')

    const base = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || undefined,
      preco: Number(form.preco),
      quantidadeEstoque: Number(form.quantidadeEstoque),
      categoriaId: Number(form.categoriaId),
      fornecedorId: Number(form.fornecedorId),
    }

    const dados: ProdutoInput =
      form.tipoProduto === 'PERECIVEL'
        ? {
            ...base,
            tipoProduto: 'PERECIVEL',
            dataValidade: form.dataValidade,
            lote: form.lote.trim(),
          }
        : {
            ...base,
            tipoProduto: 'NAO_PERECIVEL',
            garantiaMeses: Number(form.garantiaMeses),
          }

    try {
      await salvarMutation.mutateAsync(dados)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar o produto.')
    }
  }

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h1>{editando ? 'Editar produto' : 'Novo produto'}</h1>
        </div>
      </div>

      {erro && <Feedback kind="error" message={erro} />}
      {carregarErro && (
        <Feedback
          kind="error"
          message={`Não foi possível carregar categorias e fornecedores: ${carregarErro.message}`}
        />
      )}
      {!carregarErro &&
        (categoriasQuery.isPending || fornecedoresQuery.isPending) && (
          <Feedback kind="info" message="Carregando categorias e fornecedores…" />
        )}
      {!carregarErro &&
        !categoriasQuery.isPending &&
        !fornecedoresQuery.isPending &&
        (categorias.length === 0 || fornecedores.length === 0) && (
          <Feedback
            kind="info"
            message="Cadastre ao menos uma categoria e um fornecedor antes de salvar um produto."
          />
        )}

      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Tipo de produto
          <select
            disabled={editando}
            value={form.tipoProduto}
            onChange={(event) =>
              atualizar('tipoProduto', event.target.value as TipoProduto)
            }
          >
            <option value="PERECIVEL">Perecível</option>
            <option value="NAO_PERECIVEL">Não perecível</option>
          </select>
          {editando && (
            <span className="field-hint">
              O tipo não pode ser alterado após o cadastro.
            </span>
          )}
        </label>

        <label>
          Nome
          <input
            type="text"
            required
            maxLength={150}
            value={form.nome}
            onChange={(event) => atualizar('nome', event.target.value)}
          />
        </label>

        <label>
          Descrição
          <textarea
            maxLength={255}
            rows={3}
            value={form.descricao}
            onChange={(event) => atualizar('descricao', event.target.value)}
          />
        </label>

        <div className="form-grid">
          <label>
            Preço (R$)
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.preco}
              onChange={(event) => atualizar('preco', event.target.value)}
            />
          </label>
          <label>
            Quantidade em estoque
            <input
              type="number"
              required
              min="0"
              step="1"
              value={form.quantidadeEstoque}
              onChange={(event) =>
                atualizar('quantidadeEstoque', event.target.value)
              }
            />
          </label>
        </div>

        <div className="form-grid">
          <label>
            Categoria
            <select
              required
              value={form.categoriaId}
              onChange={(event) => atualizar('categoriaId', event.target.value)}
            >
              <option value="">Selecione…</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fornecedor
            <select
              required
              value={form.fornecedorId}
              onChange={(event) => atualizar('fornecedorId', event.target.value)}
            >
              <option value="">Selecione…</option>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
          </label>
        </div>

        {form.tipoProduto === 'PERECIVEL' ? (
          <div className="form-grid">
            <label>
              Data de validade
              <input
                type="date"
                required
                value={form.dataValidade}
                onChange={(event) =>
                  atualizar('dataValidade', event.target.value)
                }
              />
            </label>
            <label>
              Lote
              <input
                type="text"
                required
                maxLength={50}
                value={form.lote}
                onChange={(event) => atualizar('lote', event.target.value)}
              />
            </label>
          </div>
        ) : (
          <label>
            Garantia (meses)
            <input
              type="number"
              required
              min="0"
              step="1"
              value={form.garantiaMeses}
              onChange={(event) =>
                atualizar('garantiaMeses', event.target.value)
              }
            />
          </label>
        )}

        <div className="form-actions">
          <button type="submit" disabled={salvarMutation.isPending}>
            {salvarMutation.isPending ? 'Salvando…' : 'Salvar produto'}
          </button>
          <Link to="/produtos" className="button button-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default ProdutoFormPage
