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
  dataValidade: string // formato ISO: AAAA-MM-DD
  lote: string
}

export interface ProdutoNaoPerecivel extends ProdutoBase {
  tipoProduto: 'NAO_PERECIVEL'
  garantiaMeses: number
}

export type Produto = ProdutoPerecivel | ProdutoNaoPerecivel

// Dados enviados ao criar ou alterar um produto (sem o id).
export type ProdutoInput =
  | Omit<ProdutoPerecivel, 'id'>
  | Omit<ProdutoNaoPerecivel, 'id'>
