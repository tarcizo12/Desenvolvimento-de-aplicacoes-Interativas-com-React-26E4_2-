import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import type { DataTableColumn } from '../../components/DataTable'
import Feedback from '../../components/Feedback'
import { importarFornecedoresCsv, listarFornecedores } from './fornecedorService'
import type { Fornecedor } from './type'

const FornecedorListPage = () => {
  const queryClient = useQueryClient()
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [mensagemImportacao, setMensagemImportacao] = useState('')
  const inputArquivoRef = useRef<HTMLInputElement>(null)
  const fornecedoresQuery = useQuery({
    queryKey: ['fornecedores'],
    queryFn: ({ signal }) => listarFornecedores(signal),
  })
  const importacaoMutation = useMutation({
    mutationFn: (selectedFile: File) => importarFornecedoresCsv(selectedFile),
    onSuccess: async (mensagem) => {
      setMensagemImportacao(mensagem || 'Importação concluída.')
      await queryClient.invalidateQueries({ queryKey: ['fornecedores'] })
    },
  })

  const handleSelecionarArquivo = (event: ChangeEvent<HTMLInputElement>) => {
    setArquivo(event.target.files?.[0] ?? null)
    setMensagemImportacao('')
  }

  const handleEnviarCsv = () => {
    if (!arquivo) return
    importacaoMutation.mutate(arquivo)
  }

  const colunas: DataTableColumn<Fornecedor>[] = [
    { key: 'nome', header: 'Fornecedor', render: (fornecedor) => fornecedor.nome },
    { key: 'cnpj', header: 'CNPJ', render: (fornecedor) => fornecedor.cnpj },
    {
      key: 'telefone',
      header: 'Telefone',
      render: (fornecedor) => fornecedor.telefone || '—',
    },
    {
      key: 'email',
      header: 'E-mail',
      render: (fornecedor) => fornecedor.email || '—',
    },
    {
      key: 'endereco',
      header: 'Endereço',
      render: (fornecedor) => fornecedor.endereco || '—',
    },
  ]

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Parceiros</p>
          <h1>Fornecedores</h1>
          <p className="page-description">
            Consulte e cadastre os parceiros do estoque.
          </p>
        </div>
        <div className="actions">
          <label className="button button-secondary file-picker">
            Importar CSV
            <input
              ref={inputArquivoRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleSelecionarArquivo}
              aria-label="Selecionar arquivo CSV de fornecedores"
            />
          </label>
          <Link to="/fornecedores/novo" className="button">
            Novo fornecedor
          </Link>
        </div>
      </div>

      {arquivo && (
        <div className="upload-panel">
          <span>
            Arquivo selecionado: <strong>{arquivo.name}</strong>
          </span>
          <div className="actions">
            <button
              type="button"
              disabled={importacaoMutation.isPending}
              onClick={handleEnviarCsv}
            >
              {importacaoMutation.isPending ? 'Enviando…' : 'Enviar CSV'}
            </button>
            <button
              type="button"
              className="button button-quiet"
              onClick={() => {
                setArquivo(null)
                if (inputArquivoRef.current) inputArquivoRef.current.value = ''
              }}
            >
              Remover
            </button>
          </div>
        </div>
      )}

      {importacaoMutation.isError && (
        <Feedback
          kind="error"
          message={`Não foi possível importar o arquivo: ${importacaoMutation.error.message}`}
        />
      )}
      {mensagemImportacao && (
        <Feedback kind="success" message={mensagemImportacao} />
      )}
      {fornecedoresQuery.isPending && (
        <p className="loading-state">Carregando fornecedores…</p>
      )}
      {fornecedoresQuery.isError && (
        <Feedback
          kind="error"
          message={`Não foi possível carregar os fornecedores: ${fornecedoresQuery.error.message}`}
        />
      )}
      {!fornecedoresQuery.isPending && !fornecedoresQuery.isError && (
        fornecedoresQuery.data.length === 0 ? (
          <div className="empty-state">Nenhum fornecedor cadastrado.</div>
        ) : (
          <DataTable
            caption="Fornecedores cadastrados"
            rows={fornecedoresQuery.data}
            columns={colunas}
            getRowKey={(fornecedor) => fornecedor.id}
          />
        )
      )}
    </section>
  )
}

export default FornecedorListPage
