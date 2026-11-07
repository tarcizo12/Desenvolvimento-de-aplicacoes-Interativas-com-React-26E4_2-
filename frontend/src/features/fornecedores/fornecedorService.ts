import { apiGet, apiPost, apiUpload } from '../../utils/api'
import type { Fornecedor, FornecedorInput } from './type'

const endpoint = '/fornecedores'

export const listarFornecedores = (
  signal?: AbortSignal,
): Promise<Fornecedor[]> => apiGet<Fornecedor[]>(endpoint, signal)

export const incluirFornecedor = (
  dados: FornecedorInput,
  signal?: AbortSignal,
): Promise<Fornecedor> => apiPost<Fornecedor>(endpoint, dados, signal)

export const importarFornecedoresCsv = (
  arquivo: File,
  signal?: AbortSignal,
): Promise<string> => {
  const dados = new FormData()
  dados.append('arquivo', arquivo)
  return apiUpload<string>(`${endpoint}/importacao`, dados, signal)
}
