import { buscarEnderecoPorCep } from './cepService'

describe('ViaCEP integration', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('fetches and returns an address for the requested postal code', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
      }),
    } as Response)

    await expect(buscarEnderecoPorCep('01001000')).resolves.toMatchObject({
      localidade: 'São Paulo',
      uf: 'SP',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/01001000/json/',
      { signal: undefined },
    )
  })

  it('reports a CEP that is not found', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ erro: true }),
    } as Response)

    await expect(buscarEnderecoPorCep('00000000')).rejects.toThrow('CEP não encontrado')
  })
})
