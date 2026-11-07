import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Feedback from '../../components/Feedback'
import useFormFields from '../../hooks/useFormFields'
import { incluirCategoria } from './categoriaService'

interface CategoriaForm {
  nome: string
  descricao: string
}

const CategoriaFormPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [erro, setErro] = useState('')
  const { values: form, updateField: atualizar } = useFormFields<CategoriaForm>({
    nome: '',
    descricao: '',
  })
  const salvarMutation = useMutation({
    mutationFn: (dados: Parameters<typeof incluirCategoria>[0]) =>
      incluirCategoria(dados),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categorias'] })
      navigate('/categorias')
    },
  })

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setErro('')
    try {
      await salvarMutation.mutateAsync({
        nome: form.nome.trim(),
        descricao: form.descricao.trim() || undefined,
      })
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar a categoria.')
    }
  }

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Organização</p>
          <h1>Nova categoria</h1>
        </div>
      </div>

      {erro && <Feedback kind="error" message={erro} />}
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            type="text"
            required
            maxLength={100}
            value={form.nome}
            onChange={(event) => atualizar('nome', event.target.value)}
          />
        </label>

        <label>
          Descrição
          <textarea
            maxLength={255}
            rows={3}
            value={form.descricao}
            onChange={(event) => atualizar('descricao', event.target.value)}
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={salvarMutation.isPending}>
            {salvarMutation.isPending ? 'Salvando…' : 'Salvar categoria'}
          </button>
          <Link to="/categorias" className="button button-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default CategoriaFormPage
