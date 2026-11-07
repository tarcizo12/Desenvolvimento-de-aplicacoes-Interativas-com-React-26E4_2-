export interface CepAddress {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export const buscarEnderecoPorCep = async (
  cep: string,
  signal?: AbortSignal,
): Promise<CepAddress> => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal })
  if (!response.ok) {
    throw new Error(`O serviço ViaCEP respondeu com status ${response.status}.`)
  }

  const address: CepAddress = await response.json()
  if (address.erro) {
    throw new Error('CEP não encontrado. Confira os oito dígitos informados.')
  }

  return address
}
