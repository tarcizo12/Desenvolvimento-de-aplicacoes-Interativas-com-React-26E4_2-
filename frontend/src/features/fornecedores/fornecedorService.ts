
import type { Fornecedor, FornecedorInput } from './type'

let fornecedores: Fornecedor[] = [
  { id: 1, nome: 'Distribuidora Alfa', cnpj: '11.111.111/0001-11' },
  { id: 2, nome: 'Tech Import', cnpj: '22.222.222/0001-22' },
]

let proximoId = 3

export const listarFornecedores = async (): Promise<Fornecedor[]> =>
  [...fornecedores].sort((a, b) => a.nome.localeCompare(b.nome))

export const incluirFornecedor = async (
  dados: FornecedorInput,
): Promise<Fornecedor> => {
  const existe = fornecedores.some((f) => f.cnpj === dados.cnpj)

  if (existe) {
    throw new Error('Já existe um fornecedor com esse CNPJ.')
  }

  const novo: Fornecedor = { ...dados, id: proximoId++ }

  fornecedores = [...fornecedores, novo]

  return novo
}
