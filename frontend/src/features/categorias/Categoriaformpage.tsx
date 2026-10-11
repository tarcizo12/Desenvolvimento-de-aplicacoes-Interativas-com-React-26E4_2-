
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { incluirCategoria } from './categoriaService'

const CategoriaFormPage = () => {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState('')

  const handleSubmit = async (evento: FormEvent) => {
    evento.preventDefault()
    setErro('')

    try {
      await incluirCategoria({
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
      })

      navigate('/categorias')
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : 'Erro ao salvar a categoria.',
      )
    }
  }

  return (
    <section>
      <div className="page-title">
        <h2>Nova categoria</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {erro && <p className="error">{erro}</p>}

        <label>
          Nome
          <input
            type="text"
            required
            maxLength={100}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>

        <label>
          Descrição
          <textarea
            maxLength={255}
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </label>

        <div className="actions">
          <button type="submit">Salvar</button>

          <Link to="/categorias" className="button secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default CategoriaFormPage
