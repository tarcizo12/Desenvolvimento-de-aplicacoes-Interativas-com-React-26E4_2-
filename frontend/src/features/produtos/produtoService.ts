import { ApiError, apiDelete, apiGet, apiPost, apiPut } from '../../utils/api'
import type {
  Produto,
  ProdutoApiInput,
  ProdutoApiResponse,
  ProdutoInput,
} from './types'

const endpoint = '/produtos'

const toProduto = (response: ProdutoApiResponse): Produto => {
  const base = {
    id: response.idProduto,
    nome: response.nome,
    descricao: response.descricao ?? undefined,
    preco: response.preco,
    quantidadeEstoque: response.quantidadeEstoque,
    categoriaId: response.idCategoria,
    fornecedorId: response.idFornecedor,
  }

  if (response.perecivel) {
    if (!response.dataValidade || !response.lote) {
      throw new ApiError('A API retornou dados incompletos para um produto perecível.')
    }
    return {
      ...base,
      tipoProduto: 'PERECIVEL',
      dataValidade: response.dataValidade,
      lote: response.lote,
    }
  }

  if (typeof response.garantiaMeses !== 'number') {
    throw new ApiError('A API retornou a garantia ausente para um produto não perecível.')
  }
  return {
    ...base,
    tipoProduto: 'NAO_PERECIVEL',
    garantiaMeses: response.garantiaMeses,
  }
}

const toApiInput = (input: ProdutoInput): ProdutoApiInput => {
  const base = {
    nome: input.nome,
    descricao: input.descricao,
    preco: input.preco,
    quantidadeEstoque: input.quantidadeEstoque,
    idCategoria: input.categoriaId,
    idFornecedor: input.fornecedorId,
  }

  return input.tipoProduto === 'PERECIVEL'
    ? {
        ...base,
        perecivel: true,
        dataValidade: input.dataValidade,
        lote: input.lote,
      }
    : {
        ...base,
        perecivel: false,
        garantiaMeses: input.garantiaMeses,
      }
}

export const listarProdutos = async (
  signal?: AbortSignal,
): Promise<Produto[]> => {
  const respostas = await apiGet<ProdutoApiResponse[]>(endpoint, signal)
  return respostas.map(toProduto)
}

export const obterProduto = async (
  id: number,
  signal?: AbortSignal,
): Promise<Produto> =>
  toProduto(await apiGet<ProdutoApiResponse>(`${endpoint}/${id}`, signal))

export const incluirProduto = async (
  dados: ProdutoInput,
  signal?: AbortSignal,
): Promise<Produto> =>
  toProduto(
    await apiPost<ProdutoApiResponse>(endpoint, toApiInput(dados), signal),
  )

export const alterarProduto = async (
  id: number,
  dados: ProdutoInput,
  signal?: AbortSignal,
): Promise<Produto> =>
  toProduto(
    await apiPut<ProdutoApiResponse>(
      `${endpoint}/${id}`,
      toApiInput(dados),
      signal,
    ),
  )

export const excluirProduto = (
  id: number,
  signal?: AbortSignal,
): Promise<void> => apiDelete(`${endpoint}/${id}`, signal)
