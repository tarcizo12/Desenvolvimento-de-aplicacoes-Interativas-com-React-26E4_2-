
import type { Categoria, CategoriaInput } from './type'

let categorias: Categoria[] = [
  { id: 1, nome: 'Alimentos', descricao: 'Produtos alimentícios' },
  { id: 2, nome: 'Eletrônicos', descricao: 'Aparelhos e acessórios' },
  { id: 3, nome: 'Limpeza' },
]

let proximoId = 4

export const listarCategorias = async (): Promise<Categoria[]> =>
  [...categorias].sort((a, b) => a.nome.localeCompare(b.nome))

export const incluirCategoria = async (
  dados: CategoriaInput,
): Promise<Categoria> => {
  const existe = categorias.some(
    (c) => c.nome.toLowerCase() === dados.nome.toLowerCase(),
  )

  if (existe) {
    throw new Error('Já existe uma categoria com esse nome.')
  }

  const nova: Categoria = { ...dados, id: proximoId++ }

  categorias = [...categorias, nova]

  return nova
}
