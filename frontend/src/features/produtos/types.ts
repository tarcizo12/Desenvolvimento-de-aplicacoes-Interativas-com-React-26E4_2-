export type TipoProduto = 'PERECIVEL' | 'NAO_PERECIVEL'

interface ProdutoBase {
  id: number
  nome: string
  descricao?: string
  preco: number
  quantidadeEstoque: number
  categoriaId: number
  fornecedorId: number
}

export interface ProdutoPerecivel extends ProdutoBase {
  tipoProduto: 'PERECIVEL'
  dataValidade: string
  lote: string
}

export interface ProdutoNaoPerecivel extends ProdutoBase {
  tipoProduto: 'NAO_PERECIVEL'
  garantiaMeses: number
}

export type Produto = ProdutoPerecivel | ProdutoNaoPerecivel

export type ProdutoInput =
  | Omit<ProdutoPerecivel, 'id'>
  | Omit<ProdutoNaoPerecivel, 'id'>

export interface ProdutoApiResponse {
  idProduto: number
  nome: string
  descricao: string | null
  preco: number
  quantidadeEstoque: number
  idCategoria: number
  nomeCategoria: string
  idFornecedor: number
  nomeFornecedor: string
  perecivel: boolean
  dataValidade: string | null
  lote: string | null
  garantiaMeses: number | null
}

export interface ProdutoApiInput {
  nome: string
  descricao?: string
  preco: number
  quantidadeEstoque: number
  idCategoria: number
  idFornecedor: number
  perecivel: boolean
  dataValidade?: string
  lote?: string
  garantiaMeses?: number
}
