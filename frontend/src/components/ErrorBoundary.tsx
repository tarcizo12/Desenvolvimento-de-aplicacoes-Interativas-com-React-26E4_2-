import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import Feedback from './Feedback'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  // Captura falhas de renderização; erros de eventos e requisições são tratados nas próprias telas.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro inesperado na interface React:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-main">
          <Feedback
            kind="error"
            message="Ocorreu um erro inesperado. Atualize a página para tentar novamente."
          />
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
