export interface Categoria {
  id: number
  nome: string
  descricao?: string
}

// Dados enviados ao criar uma categoria (sem o id).
export type CategoriaInput = Omit<Categoria, 'id'>