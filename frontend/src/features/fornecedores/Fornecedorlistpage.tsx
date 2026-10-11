
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { listarFornecedores } from './fornecedorService'
import type { Fornecedor } from './type'

const FornecedorListPage = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [carregando, setCarregando] = useState(true)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const inputArquivoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listarFornecedores().then((dados) => {
      setFornecedores(dados)
      setCarregando(false)
    })
  }, [])

  const handleSelecionarArquivo = (
    evento: ChangeEvent<HTMLInputElement>,
  ) => {
    setArquivo(evento.target.files?.[0] ?? null)
  }

  const handleLimparArquivo = () => {
    setArquivo(null)

    if (inputArquivoRef.current) {
      inputArquivoRef.current.value = ''
    }
  }

  const handleEnviarCsv = () => {
  }

  return (
    <section>
      <div className="page-title">
        <h2>Fornecedores</h2>

        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => inputArquivoRef.current?.click()}
          >
            Importar CSV
          </button>

          <Link to="/fornecedores/novo" className="button">
            Novo fornecedor
          </Link>
        </div>
      </div>

      <input
        ref={inputArquivoRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleSelecionarArquivo}
        hidden
      />

      {arquivo && (
        <div className="actions" style={{ marginBottom: '1rem' }}>
          <span>
            Arquivo selecionado: <strong>{arquivo.name}</strong>
          </span>

          <button type="button" onClick={handleEnviarCsv}>
            Enviar
          </button>

          <button
            type="button"
            className="secondary"
            onClick={handleLimparArquivo}
          >
            Remover
          </button>
        </div>
      )}

      {carregando ? (
        <p>Carregando...</p>
      ) : fornecedores.length === 0 ? (
        <p>Nenhum fornecedor cadastrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Endereço</th>
            </tr>
          </thead>

          <tbody>
            {fornecedores.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td>{fornecedor.nome}</td>
                <td>{fornecedor.cnpj}</td>
                <td>{fornecedor.telefone ?? '-'}</td>
                <td>{fornecedor.email ?? '-'}</td>
                <td>{fornecedor.endereco ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default FornecedorListPage
