import { apiGet, apiPost } from '../../utils/api'
import type { Categoria, CategoriaInput } from './type'

const endpoint = '/categorias'

export const listarCategorias = (
  signal?: AbortSignal,
): Promise<Categoria[]> => apiGet<Categoria[]>(endpoint, signal)

export const incluirCategoria = (
  dados: CategoriaInput,
  signal?: AbortSignal,
): Promise<Categoria> => apiPost<Categoria>(endpoint, dados, signal)
