
import type { Produto, ProdutoInput } from './types'


let produtos: Produto[] = [
  {
    id: 1,
    tipoProduto: 'PERECIVEL',
    nome: 'Leite Integral 1L',
    descricao: 'Caixa com 12 unidades',
    preco: 54.9,
    quantidadeEstoque: 40,
    categoriaId: 1,
    fornecedorId: 1,
    dataValidade: '2026-12-31',
    lote: 'L2026-10',
  },
  {
    id: 2,
    tipoProduto: 'NAO_PERECIVEL',
    nome: 'Fone de Ouvido Bluetooth',
    preco: 149.9,
    quantidadeEstoque: 15,
    categoriaId: 2,
    fornecedorId: 2,
    garantiaMeses: 12,
  },
]

let proximoId = 3

export const listarProdutos = async (): Promise<Produto[]> =>
  [...produtos].sort((a, b) => a.nome.localeCompare(b.nome))

export const obterProduto = async (
  id: number,
): Promise<Produto | undefined> =>
  produtos.find((p) => p.id === id)

export const incluirProduto = async (
  dados: ProdutoInput,
): Promise<Produto> => {
  const novo = { ...dados, id: proximoId++ } as Produto

  produtos = [...produtos, novo]

  return novo
}

export const alterarProduto = async (
  id: number,
  dados: ProdutoInput,
): Promise<Produto> => {
  const atualizado = { ...dados, id } as Produto

  produtos = produtos.map((p) => (p.id === id ? atualizado : p))

  return atualizado
}

export const excluirProduto = async (
  id: number,
): Promise<void> => {
  produtos = produtos.filter((p) => p.id !== id)
}
