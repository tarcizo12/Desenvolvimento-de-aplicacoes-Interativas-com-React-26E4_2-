import type { Produto, ProdutoInput } from './types'

// Serviço com dados em memória, apenas para desenvolver as telas.
// Quando a API for integrada, só este arquivo precisa mudar.
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

export async function listarProdutos(): Promise<Produto[]> {
  return [...produtos].sort((a, b) => a.nome.localeCompare(b.nome))
}

export async function obterProduto(id: number): Promise<Produto | undefined> {
  return produtos.find((p) => p.id === id)
}

export async function incluirProduto(dados: ProdutoInput): Promise<Produto> {
  const novo = { ...dados, id: proximoId++ } as Produto
  produtos = [...produtos, novo]
  return novo
}

export async function alterarProduto(
  id: number,
  dados: ProdutoInput,
): Promise<Produto> {
  const atualizado = { ...dados, id } as Produto
  produtos = produtos.map((p) => (p.id === id ? atualizado : p))
  return atualizado
}

export async function excluirProduto(id: number): Promise<void> {
  produtos = produtos.filter((p) => p.id !== id)
}
