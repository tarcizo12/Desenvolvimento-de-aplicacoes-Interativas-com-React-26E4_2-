import type { Categoria } from "../categorias/type"


// Dados de exemplo. Será substituído pela chamada à API.
const categorias: Categoria[] = [
  { id: 1, nome: 'Alimentos', descricao: 'Produtos alimentícios' },
  { id: 2, nome: 'Eletrônicos', descricao: 'Aparelhos e acessórios' },
  { id: 3, nome: 'Limpeza' },
]

export async function listarCategorias(): Promise<Categoria[]> {
  return [...categorias]
}
