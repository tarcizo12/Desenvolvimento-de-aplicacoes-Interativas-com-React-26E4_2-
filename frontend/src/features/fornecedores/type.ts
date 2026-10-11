export interface Fornecedor {
  id: number
  nome: string
  cnpj: string
  telefone?: string
  email?: string
  endereco?: string
}

export type FornecedorInput = Omit<Fornecedor, 'id'>