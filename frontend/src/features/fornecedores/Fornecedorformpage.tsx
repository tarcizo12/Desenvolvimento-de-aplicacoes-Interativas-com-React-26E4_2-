
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { incluirFornecedor } from './fornecedorService'

const FornecedorFormPage = () => {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [endereco, setEndereco] = useState('')
  const [erro, setErro] = useState('')

  const handleSubmit = async (evento: FormEvent) => {
    evento.preventDefault()
    setErro('')

    try {
      await incluirFornecedor({
        nome: nome.trim(),
        cnpj: cnpj.trim(),
        telefone: telefone.trim() || undefined,
        email: email.trim() || undefined,
        endereco: endereco.trim() || undefined,
      })

      navigate('/fornecedores')
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : 'Erro ao salvar o fornecedor.',
      )
    }
  }

  return (
    <section>
      <div className="page-title">
        <h2>Novo fornecedor</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {erro && <p className="error">{erro}</p>}

        <label>
          Nome
          <input
            type="text"
            required
            maxLength={150}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>

        <label>
          CNPJ
          <input
            type="text"
            required
            maxLength={18}
            placeholder="00.000.000/0000-00"
            pattern="\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}"
            title="Use o formato 00.000.000/0000-00"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />
        </label>

        <label>
          Telefone
          <input
            type="tel"
            maxLength={20}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            maxLength={150}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Endereço
          <input
            type="text"
            maxLength={255}
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </label>

        <div className="actions">
          <button type="submit">Salvar</button>

          <Link to="/fornecedores" className="button secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default FornecedorFormPage
