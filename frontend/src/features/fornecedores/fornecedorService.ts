import type { Fornecedor } from "./type"


// Dados de exemplo. Será substituído pela chamada à API.
const fornecedores: Fornecedor[] = [
  { id: 1, nome: 'Distribuidora Alfa', cnpj: '11.111.111/0001-11' },
  { id: 2, nome: 'Tech Import', cnpj: '22.222.222/0001-22' },
]

export async function listarFornecedores(): Promise<Fornecedor[]> {
  return [...fornecedores]
}