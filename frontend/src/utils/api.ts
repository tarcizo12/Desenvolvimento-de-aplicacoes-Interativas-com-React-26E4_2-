const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8080/com/api'
).replace(/\/$/, '')

const REQUEST_TIMEOUT_MS = 15_000

interface ApiErrorBody {
  mensagem?: string
}

export class ApiError extends Error {
  readonly status?: number

  constructor(
    message: string,
    status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const request = async <T>(
  path: string,
  init: RequestInit = {},
  externalSignal?: AbortSignal,
): Promise<T> => {
  const controller = new AbortController()
  const abortRequest = () => controller.abort(externalSignal?.reason)

  if (externalSignal?.aborted) {
    abortRequest()
  } else {
    externalSignal?.addEventListener('abort', abortRequest, { once: true })
  }

  let timeoutId: number | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      controller.abort()
      reject(new ApiError('A requisição excedeu o tempo limite.'))
    }, REQUEST_TIMEOUT_MS)
  })

  try {
    const response = await Promise.race([
      fetch(`${API_BASE_URL}${path}`, {
        ...init,
        signal: controller.signal,
      }),
      timeout,
    ])

    if (!response.ok) {
      let mensagem = `Erro na requisição (${response.status}).`
      try {
        const body = (await response.json()) as ApiErrorBody
        if (body.mensagem) mensagem = body.mensagem
      } catch {
        // A resposta pode não conter JSON; o status HTTP continua disponível.
      }
      throw new ApiError(mensagem, response.status)
    }

    if (response.status === 204) return undefined as T

    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body: unknown = await response.json()
      return body as T
    }
    const body: unknown = await response.text()
    return body as T
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    externalSignal?.removeEventListener('abort', abortRequest)
  }
}

export const apiGet = <T>(path: string, signal?: AbortSignal): Promise<T> =>
  request<T>(path, {}, signal)

export const apiPost = <T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> =>
  request<T>(
    path,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    signal,
  )

export const apiPut = <T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> =>
  request<T>(
    path,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    signal,
  )

export const apiDelete = (path: string, signal?: AbortSignal): Promise<void> =>
  request<void>(path, { method: 'DELETE' }, signal)

export const apiUpload = <T>(
  path: string,
  formData: FormData,
  signal?: AbortSignal,
): Promise<T> =>
  request<T>(path, { method: 'PUT', body: formData }, signal)
