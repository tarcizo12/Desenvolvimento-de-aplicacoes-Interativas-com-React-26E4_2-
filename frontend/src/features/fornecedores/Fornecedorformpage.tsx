import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Feedback from '../../components/Feedback'
import useFormFields from '../../hooks/useFormFields'
import { buscarEnderecoPorCep } from './cepService'
import { incluirFornecedor } from './fornecedorService'

interface FornecedorForm {
  nome: string
  cnpj: string
  telefone: string
  email: string
  endereco: string
}

const FornecedorFormPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [erro, setErro] = useState('')
  const [cep, setCep] = useState('')
  const { values: form, updateField: atualizar } =
    useFormFields<FornecedorForm>({
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      endereco: '',
    })
  const consultaCepMutation = useMutation({
      mutationFn: (codigoPostal: string) =>
        queryClient.fetchQuery({
          queryKey: ['cep', codigoPostal],
          queryFn: () => buscarEnderecoPorCep(codigoPostal),
          staleTime: 5 * 60 * 1000,
        }),
    onSuccess: (endereco) => {
      const partes = [
        endereco.logradouro,
        endereco.bairro,
        `${endereco.localidade}/${endereco.uf}`,
      ].filter(Boolean)
      atualizar('endereco', partes.join(', '))
    },
  })
  const salvarMutation = useMutation({
    mutationFn: (dados: Parameters<typeof incluirFornecedor>[0]) =>
      incluirFornecedor(dados),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['fornecedores'] })
      navigate('/fornecedores')
    },
  })

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setErro('')
    try {
      await salvarMutation.mutateAsync({
        nome: form.nome.trim(),
        cnpj: form.cnpj.trim(),
        telefone: form.telefone.trim() || undefined,
        email: form.email.trim() || undefined,
        endereco: form.endereco.trim() || undefined,
      })
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar o fornecedor.')
    }
  }

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Parceiros</p>
          <h1>Novo fornecedor</h1>
        </div>
      </div>

      {erro && <Feedback kind="error" message={erro} />}
      {consultaCepMutation.isError && (
        <Feedback
          kind="error"
          message={`Não foi possível consultar o CEP: ${consultaCepMutation.error.message}`}
        />
      )}
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            type="text"
            required
            maxLength={150}
            value={form.nome}
            onChange={(event) => atualizar('nome', event.target.value)}
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
            value={form.cnpj}
            onChange={(event) => atualizar('cnpj', event.target.value)}
          />
        </label>

        <div className="form-grid">
          <label>
            Telefone
            <input
              type="tel"
              maxLength={20}
              value={form.telefone}
              onChange={(event) => atualizar('telefone', event.target.value)}
            />
          </label>
          <label>
            E-mail
            <input
              type="email"
              maxLength={150}
              value={form.email}
              onChange={(event) => atualizar('email', event.target.value)}
            />
          </label>
        </div>

        <label>
          CEP
          <div className="form-grid">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={9}
              placeholder="00000-000"
              aria-label="CEP para consulta de endereço"
              value={cep}
              onChange={(event) => setCep(event.target.value)}
            />
            <button
              type="button"
              className="button button-secondary"
              disabled={cep.replace(/\D/g, '').length !== 8 || consultaCepMutation.isPending}
              onClick={() => consultaCepMutation.mutate(cep.replace(/\D/g, ''))}
            >
              {consultaCepMutation.isPending ? 'Consultando…' : 'Buscar endereço'}
            </button>
          </div>
        </label>

        <label>
          Endereço
          <input
            type="text"
            maxLength={255}
            value={form.endereco}
            onChange={(event) => atualizar('endereco', event.target.value)}
          />
        </label>
        {consultaCepMutation.isSuccess && (
          <p role="status">Endereço preenchido pela consulta ViaCEP.</p>
        )}

        <div className="form-actions">
          <button type="submit" disabled={salvarMutation.isPending}>
            {salvarMutation.isPending ? 'Salvando…' : 'Salvar fornecedor'}
          </button>
          <Link to="/fornecedores" className="button button-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default FornecedorFormPage
