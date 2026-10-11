export interface Categoria {
  id: number
  nome: string
  descricao?: string
}

export type CategoriaInput = Omit<Categoria, 'id'>