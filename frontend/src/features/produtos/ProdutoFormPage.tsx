import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  alterarProduto,
  incluirProduto,
  obterProduto,
} from './produtoService'
import type { ProdutoInput, TipoProduto } from './types'
import type { Categoria } from '../categorias/type'
import type { Fornecedor } from '../fornecedores/type'
import { listarCategorias } from './categoriaService'
import { listarFornecedores } from './fornecedorService'

// Estado do formulário: todos os campos como texto, como vêm dos inputs.
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

const estadoInicial: FormState = {
  tipoProduto: 'PERECIVEL',
  nome: '',
  descricao: '',
  preco: '',
  quantidadeEstoque: '0',
  categoriaId: '',
  fornecedorId: '',
  dataValidade: '',
  lote: '',
  garantiaMeses: '',
}

export default function ProdutoFormPage() {
  const { id } = useParams()
  const editando = id !== undefined
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(estadoInicial)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarCategorias().then(setCategorias)
    listarFornecedores().then(setFornecedores)
  }, [])

  useEffect(() => {
    if (id === undefined) return
    obterProduto(Number(id)).then((produto) => {
      if (!produto) {
        setErro('Produto não encontrado.')
        return
      }
      setForm({
        tipoProduto: produto.tipoProduto,
        nome: produto.nome,
        descricao: produto.descricao ?? '',
        preco: String(produto.preco),
        quantidadeEstoque: String(produto.quantidadeEstoque),
        categoriaId: String(produto.categoriaId),
        fornecedorId: String(produto.fornecedorId),
        dataValidade:
          produto.tipoProduto === 'PERECIVEL' ? produto.dataValidade : '',
        lote: produto.tipoProduto === 'PERECIVEL' ? produto.lote : '',
        garantiaMeses:
          produto.tipoProduto === 'NAO_PERECIVEL'
            ? String(produto.garantiaMeses)
            : '',
      })
    })
  }, [id])

  function atualizar<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function handleSubmit(evento: FormEvent) {
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

    if (editando) {
      await alterarProduto(Number(id), dados)
    } else {
      await incluirProduto(dados)
    }
    navigate('/produtos')
  }

  return (
    <section>
      <div className="page-title">
        <h2>{editando ? 'Editar produto' : 'Novo produto'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {erro && <p className="error">{erro}</p>}

        <label>
          Tipo de produto
          <select
            value={form.tipoProduto}
            onChange={(e) =>
              atualizar('tipoProduto', e.target.value as TipoProduto)
            }
          >
            <option value="PERECIVEL">Perecível</option>
            <option value="NAO_PERECIVEL">Não perecível</option>
          </select>
        </label>

        <label>
          Nome
          <input
            type="text"
            required
            maxLength={150}
            value={form.nome}
            onChange={(e) => atualizar('nome', e.target.value)}
          />
        </label>

        <label>
          Descrição
          <textarea
            maxLength={255}
            rows={3}
            value={form.descricao}
            onChange={(e) => atualizar('descricao', e.target.value)}
          />
        </label>

        <label>
          Preço
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.preco}
            onChange={(e) => atualizar('preco', e.target.value)}
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
            onChange={(e) => atualizar('quantidadeEstoque', e.target.value)}
          />
        </label>

        <label>
          Categoria
          <select
            required
            value={form.categoriaId}
            onChange={(e) => atualizar('categoriaId', e.target.value)}
          >
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fornecedor
          <select
            required
            value={form.fornecedorId}
            onChange={(e) => atualizar('fornecedorId', e.target.value)}
          >
            <option value="">Selecione...</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </label>

        {form.tipoProduto === 'PERECIVEL' ? (
          <>
            <label>
              Data de validade
              <input
                type="date"
                required
                value={form.dataValidade}
                onChange={(e) => atualizar('dataValidade', e.target.value)}
              />
            </label>
            <label>
              Lote
              <input
                type="text"
                required
                maxLength={50}
                value={form.lote}
                onChange={(e) => atualizar('lote', e.target.value)}
              />
            </label>
          </>
        ) : (
          <label>
            Garantia (meses)
            <input
              type="number"
              required
              min="0"
              step="1"
              value={form.garantiaMeses}
              onChange={(e) => atualizar('garantiaMeses', e.target.value)}
            />
          </label>
        )}

        <div className="actions">
          <button type="submit">Salvar</button>
          <Link to="/produtos" className="button secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}
